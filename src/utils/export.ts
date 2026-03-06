import { TemplateStyles } from '../templates'
import { renderMarkdown } from './markdown'
import { generatePreviewCSS } from './styles'
import mermaid from 'mermaid'

async function renderMermaidInContainer(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>('.mermaid')
  for (const node of nodes) {
    const code = node.textContent || ''
    const id = `mermaid-export-${Math.random().toString(36).slice(2, 10)}`
    try {
      const { svg } = await mermaid.render(id, code)
      node.innerHTML = svg
    } catch {
      node.innerHTML = `<pre style="color:#e53e3e;">[Mermaid] Render error</pre>`
    }
  }
}

export async function exportToPDF(markdown: string, styles: TemplateStyles, filename = 'document') {
  const html = renderMarkdown(markdown)
  const css = generatePreviewCSS(styles)

  const container = document.createElement('div')
  container.innerHTML = `<style>${css}</style><div class="preview-content">${html}</div>`
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '210mm'
  document.body.appendChild(container)

  await renderMermaidInContainer(container)

  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf()
      .set({
        margin: 0,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(container.querySelector('.preview-content'))
      .save()
  } finally {
    document.body.removeChild(container)
  }
}

function ptToHalfPoints(pt: number): number {
  return Math.round(pt * 2)
}

function ptToTwips(pt: number): number {
  return Math.round(pt * 20)
}

function mmToTwips(mm: number): number {
  return Math.round(mm * 56.7)
}

function hexToRGB(hex: string): string {
  return hex.replace('#', '')
}

function parseSpacing(pt: number): number {
  return ptToTwips(pt)
}

export async function exportToWord(markdown: string, styles: TemplateStyles, filename = 'document') {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, HeadingLevel, BorderStyle, TableLayoutType } = await import('docx')
  const { saveAs } = await import('file-saver')

  const lines = markdown.split('\n')
  const children: (typeof Paragraph.prototype | typeof Table.prototype)[] = []

  let inCodeBlock = false
  let codeContent: string[] = []
  let codeBlockLang = ''
  let inTable = false
  let tableRows: string[][] = []
  let inMathBlock = false
  let mathContent: string[] = []

  const alignMap: Record<string, typeof AlignmentType[keyof typeof AlignmentType]> = {
    left: AlignmentType.LEFT,
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
  }

  const baseFont = styles.fontFamily.split(',')[0].trim().replace(/"/g, '')

  function createTextRuns(text: string, baseOpts: Record<string, unknown> = {}): (typeof TextRun.prototype)[] {
    const runs: (typeof TextRun.prototype)[] = []
    const regex = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|~~.+?~~|`.+?`|\[.+?\]\(.+?\)|\$\$.+?\$\$|\$[^$]+?\$)/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        runs.push(new TextRun({ text: text.slice(lastIndex, match.index), ...baseOpts } as any))
      }
      const m = match[0]
      if (m.startsWith('***') && m.endsWith('***')) {
        runs.push(new TextRun({ text: m.slice(3, -3), bold: true, italics: true, ...baseOpts } as any))
      } else if (m.startsWith('$$') && m.endsWith('$$')) {
        runs.push(new TextRun({
          text: m.slice(2, -2),
          font: 'Cambria Math',
          italics: true,
          ...baseOpts,
        } as any))
      } else if (m.startsWith('$') && m.endsWith('$')) {
        runs.push(new TextRun({
          text: m.slice(1, -1),
          font: 'Cambria Math',
          italics: true,
          ...baseOpts,
        } as any))
      } else if (m.startsWith('**') && m.endsWith('**')) {
        runs.push(new TextRun({ text: m.slice(2, -2), bold: true, ...baseOpts } as any))
      } else if (m.startsWith('*') && m.endsWith('*')) {
        runs.push(new TextRun({ text: m.slice(1, -1), italics: true, ...baseOpts } as any))
      } else if (m.startsWith('~~') && m.endsWith('~~')) {
        runs.push(new TextRun({ text: m.slice(2, -2), strike: true, ...baseOpts } as any))
      } else if (m.startsWith('`') && m.endsWith('`')) {
        runs.push(new TextRun({
          text: m.slice(1, -1),
          font: styles.code.fontFamily.split(',')[0].trim().replace(/"/g, ''),
          size: ptToHalfPoints(styles.code.fontSize),
          ...baseOpts,
        } as any))
      } else if (m.startsWith('[')) {
        const linkMatch = m.match(/\[(.+?)\]\((.+?)\)/)
        if (linkMatch) {
          runs.push(new TextRun({
            text: linkMatch[1],
            color: hexToRGB(styles.themeColor),
            underline: {},
            ...baseOpts,
          } as any))
        }
      }
      lastIndex = match.index + m.length
    }

    if (lastIndex < text.length) {
      runs.push(new TextRun({ text: text.slice(lastIndex), ...baseOpts } as any))
    }

    if (runs.length === 0) {
      runs.push(new TextRun({ text: text || '', ...baseOpts } as any))
    }

    return runs
  }

  function flushTable() {
    if (tableRows.length === 0) return
    const borderType = styles.table.borderMode === 'all' ? BorderStyle.SINGLE : BorderStyle.NONE

    const table = new Table({
      layout: TableLayoutType.FIXED,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows.map((cells, rowIdx) =>
        new TableRow({
          children: cells.map((cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: createTextRuns(cell.trim(), {
                    font: styles.fontFamily.split(',')[0].trim().replace(/"/g, ''),
                    size: ptToHalfPoints(styles.fontSize),
                    bold: rowIdx === 0 && styles.table.headerBold,
                    color: rowIdx === 0 ? hexToRGB(styles.table.headerColor) : hexToRGB(styles.fontColor),
                  }),
                }),
              ],
              shading: rowIdx === 0 && styles.table.headerBg !== 'transparent'
                ? { fill: hexToRGB(styles.table.headerBg) }
                : undefined,
              borders: {
                top: { style: styles.table.borderMode === 'all' ? BorderStyle.SINGLE : BorderStyle.SINGLE, size: 1, color: hexToRGB(styles.table.borderColor) },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToRGB(styles.table.borderColor) },
                left: { style: borderType, size: 1, color: hexToRGB(styles.table.borderColor) },
                right: { style: borderType, size: 1, color: hexToRGB(styles.table.borderColor) },
              },
            })
          ),
        })
      ),
    })
    children.push(table as any)
    tableRows = []
    inTable = false
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        if (codeBlockLang === 'mermaid') {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 120 },
              children: [
                new TextRun({
                  text: '[Mermaid Diagram — visible in PDF/HTML export]',
                  italics: true,
                  color: '999999',
                  font: baseFont,
                  size: ptToHalfPoints(styles.fontSize),
                } as any),
              ],
            }) as any
          )
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeContent.join('\n'),
                  font: styles.code.fontFamily.split(',')[0].trim().replace(/"/g, ''),
                  size: ptToHalfPoints(styles.code.fontSize),
                } as any),
              ],
              shading: { fill: hexToRGB(styles.code.bgColor) },
              indent: { left: 360, right: 360 },
              spacing: { before: 120, after: 120 },
            }) as any
          )
        }
        codeContent = []
        codeBlockLang = ''
        inCodeBlock = false
      } else {
        if (inTable) flushTable()
        codeBlockLang = line.replace('```', '').trim()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    if (line.trim() === '$$') {
      if (inMathBlock) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: mathContent.join('\n'),
                font: 'Cambria Math',
                italics: true,
                size: ptToHalfPoints(styles.fontSize),
                color: hexToRGB(styles.fontColor),
              } as any),
            ],
          }) as any
        )
        mathContent = []
        inMathBlock = false
      } else {
        if (inTable) flushTable()
        inMathBlock = true
      }
      continue
    }

    if (inMathBlock) {
      mathContent.push(line)
      continue
    }

    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1)
      if (cells.every((c) => /^[\s:-]+$/.test(c))) continue
      tableRows.push(cells)
      inTable = true
      continue
    } else if (inTable) {
      flushTable()
    }

    const baseRunOpts = {
      font: baseFont,
      size: ptToHalfPoints(styles.fontSize),
      color: hexToRGB(styles.fontColor),
    }

    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: alignMap[styles.h1.align],
          spacing: { before: parseSpacing(styles.h1.marginTop), after: parseSpacing(styles.h1.marginBottom) },
          children: createTextRuns(line.slice(2), {
            font: baseFont,
            size: ptToHalfPoints(styles.h1.fontSize),
            bold: styles.h1.bold,
            color: hexToRGB(styles.h1.color),
          }),
        }) as any
      )
    } else if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: alignMap[styles.h2.align],
          spacing: { before: parseSpacing(styles.h2.marginTop), after: parseSpacing(styles.h2.marginBottom) },
          children: createTextRuns(line.slice(3), {
            font: baseFont,
            size: ptToHalfPoints(styles.h2.fontSize),
            bold: styles.h2.bold,
            color: hexToRGB(styles.h2.color),
          }),
        }) as any
      )
    } else if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          alignment: alignMap[styles.h3.align],
          spacing: { before: parseSpacing(styles.h3.marginTop), after: parseSpacing(styles.h3.marginBottom) },
          children: createTextRuns(line.slice(4), {
            font: baseFont,
            size: ptToHalfPoints(styles.h3.fontSize),
            bold: styles.h3.bold,
            color: hexToRGB(styles.h3.color),
          }),
        }) as any
      )
    } else if (line.startsWith('#### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_4,
          alignment: alignMap[styles.h4.align],
          spacing: { before: parseSpacing(styles.h4.marginTop), after: parseSpacing(styles.h4.marginBottom) },
          children: createTextRuns(line.slice(5), {
            font: baseFont,
            size: ptToHalfPoints(styles.h4.fontSize),
            bold: styles.h4.bold,
            color: hexToRGB(styles.h4.color),
          }),
        }) as any
      )
    } else if (line.startsWith('> ')) {
      children.push(
        new Paragraph({
          indent: { left: 720 },
          border: { left: { style: BorderStyle.SINGLE, size: 6, color: hexToRGB(styles.themeColor) } },
          children: createTextRuns(line.slice(2), { ...baseRunOpts, color: '666666' }),
        }) as any
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: createTextRuns(line.slice(2), baseRunOpts),
        }) as any
      )
    } else if (/^\d+\. /.test(line)) {
      const text = line.replace(/^\d+\.\s/, '')
      children.push(
        new Paragraph({
          numbering: { reference: 'default-numbering', level: 0 },
          children: createTextRuns(text, baseRunOpts),
        }) as any
      )
    } else if (line.trim() === '---' || line.trim() === '***') {
      children.push(
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: styles.separator.thickness * 6, color: hexToRGB(styles.separator.color) } },
          spacing: { after: 200 },
        }) as any
      )
    } else if (line.trim() === '') {
      children.push(new Paragraph({ children: [] }) as any)
    } else {
      children.push(
        new Paragraph({
          spacing: { after: parseSpacing(styles.paragraphSpacing) },
          children: createTextRuns(line, baseRunOpts),
        }) as any
      )
    }
  }

  if (inTable) flushTable()

  // Remove top spacing from the first element
  if (children.length > 0) {
    const first = children[0] as any
    if (first.options?.spacing) {
      first.options.spacing.before = 0
    }
  }

  const marginTwips = mmToTwips(styles.pageMargin)

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            { level: 0, format: 'decimal' as any, text: '%1.', alignment: AlignmentType.LEFT },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children: children as any[],
      },
    ],
  })

  const buffer = await Packer.toBlob(doc)
  saveAs(buffer, `${filename}.docx`)
}
