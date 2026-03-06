import { TemplateStyles } from '../templates'

export function generatePreviewCSS(styles: TemplateStyles): string {
  const borderStyle = styles.table.borderMode === 'all'
    ? `border: 1px solid ${styles.table.borderColor};`
    : `border: none; border-top: 1px solid ${styles.table.borderColor}; border-bottom: 1px solid ${styles.table.borderColor};`

  const cellBorder = styles.table.borderMode === 'all'
    ? `border: 1px solid ${styles.table.borderColor};`
    : `border: none; border-bottom: 1px solid ${styles.table.borderColor};`

  return `
    .preview-content {
      font-family: ${styles.fontFamily};
      font-size: ${styles.fontSize}pt;
      color: ${styles.fontColor};
      line-height: ${styles.lineHeight};
      padding: ${styles.pageMargin}mm;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .preview-content p {
      margin: ${styles.paragraphSpacing}pt 0;
    }
    .preview-content h1 {
      font-size: ${styles.h1.fontSize}pt;
      font-weight: ${styles.h1.bold ? 'bold' : 'normal'};
      color: ${styles.h1.color};
      text-align: ${styles.h1.align};
      margin-top: ${styles.h1.marginTop}pt;
      margin-bottom: ${styles.h1.marginBottom}pt;
    }
    .preview-content h2 {
      font-size: ${styles.h2.fontSize}pt;
      font-weight: ${styles.h2.bold ? 'bold' : 'normal'};
      color: ${styles.h2.color};
      text-align: ${styles.h2.align};
      margin-top: ${styles.h2.marginTop}pt;
      margin-bottom: ${styles.h2.marginBottom}pt;
    }
    .preview-content h3 {
      font-size: ${styles.h3.fontSize}pt;
      font-weight: ${styles.h3.bold ? 'bold' : 'normal'};
      color: ${styles.h3.color};
      text-align: ${styles.h3.align};
      margin-top: ${styles.h3.marginTop}pt;
      margin-bottom: ${styles.h3.marginBottom}pt;
    }
    .preview-content h4 {
      font-size: ${styles.h4.fontSize}pt;
      font-weight: ${styles.h4.bold ? 'bold' : 'normal'};
      color: ${styles.h4.color};
      text-align: ${styles.h4.align};
      margin-top: ${styles.h4.marginTop}pt;
      margin-bottom: ${styles.h4.marginBottom}pt;
    }
    .preview-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      ${borderStyle}
    }
    .preview-content th,
    .preview-content td {
      padding: 8px 12px;
      text-align: left;
      ${cellBorder}
    }
    .preview-content thead th {
      background-color: ${styles.table.headerBg};
      font-weight: ${styles.table.headerBold ? 'bold' : 'normal'};
      color: ${styles.table.headerColor};
    }
    .preview-content code {
      font-family: ${styles.code.fontFamily};
      font-size: ${styles.code.fontSize}pt;
      background-color: ${styles.code.bgColor};
      padding: 2px 6px;
      border-radius: 3px;
      ${styles.code.border ? `border: 1px solid #e0e0e0;` : ''}
    }
    .preview-content pre {
      background-color: ${styles.code.bgColor} !important;
      padding: 20px 24px !important;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1em 0;
      ${styles.code.border ? `border: 1px solid #e0e0e0;` : ''}
    }
    .preview-content pre code {
      padding: 0 !important;
      border: none;
      background: transparent !important;
    }
    .preview-content blockquote {
      border-left: 4px solid ${styles.themeColor};
      margin: 1em 0;
      padding: 0.5em 1em;
      color: #666;
      background: #f9f9f9;
    }
    .preview-content a {
      color: ${styles.themeColor};
      text-decoration: underline;
    }
    .preview-content hr {
      border: none;
      border-top: ${styles.separator.thickness}px ${styles.separator.lineType} ${styles.separator.color};
      margin: 1.5em 0;
    }
    .preview-content ul, .preview-content ol {
      padding-left: 2em;
      margin: 0.5em 0;
    }
    .preview-content li {
      margin: 0.25em 0;
    }
    .preview-content img {
      max-width: 100%;
      height: auto;
    }
    .preview-content > :first-child {
      margin-top: 0;
    }
    .preview-content strong {
      font-weight: bold;
    }
    .preview-content em {
      font-style: italic;
    }
    .preview-content del {
      text-decoration: line-through;
    }
  `
}
