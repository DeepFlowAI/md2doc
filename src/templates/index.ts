export interface HeadingStyle {
  fontSize: number
  bold: boolean
  color: string
  align: 'left' | 'center' | 'right'
  marginTop: number
  marginBottom: number
}

export interface TableStyle {
  borderColor: string
  borderMode: 'all' | 'horizontal'
  headerBg: string
  headerBold: boolean
  headerColor: string
}

export interface CodeStyle {
  fontFamily: string
  fontSize: number
  bgColor: string
  border: boolean
}

export interface SeparatorStyle {
  lineType: 'solid' | 'dashed' | 'dotted'
  color: string
  thickness: number
}

export interface TemplateStyles {
  fontFamily: string
  fontSize: number
  fontColor: string
  lineHeight: number
  paragraphSpacing: number
  h1: HeadingStyle
  h2: HeadingStyle
  h3: HeadingStyle
  h4: HeadingStyle
  table: TableStyle
  code: CodeStyle
  separator: SeparatorStyle
  pageMargin: number
  themeColor: string
}

export interface Template {
  id: string
  name: string
  icon: string
  styles: TemplateStyles
  readonly?: boolean
}

export const defaultTemplate: Template = {
  id: 'default',
  name: '默认模板',
  icon: 'file-text',
  readonly: true,
  styles: {
    fontFamily: '"Microsoft YaHei", "微软雅黑", sans-serif',
    fontSize: 12,
    fontColor: '#333333',
    lineHeight: 1.5,
    paragraphSpacing: 6,
    h1: { fontSize: 18, bold: true, color: '#000000', align: 'center', marginTop: 10, marginBottom: 5 },
    h2: { fontSize: 15, bold: true, color: '#000000', align: 'left', marginTop: 8, marginBottom: 4 },
    h3: { fontSize: 13, bold: true, color: '#000000', align: 'left', marginTop: 6, marginBottom: 3 },
    h4: { fontSize: 12, bold: true, color: '#555555', align: 'left', marginTop: 5, marginBottom: 2 },
    table: { borderColor: '#cccccc', borderMode: 'all', headerBg: '#f2f2f2', headerBold: true, headerColor: '#000000' },
    code: { fontFamily: 'Consolas, Monaco, "Courier New", monospace', fontSize: 11, bgColor: '#f5f5f5', border: true },
    separator: { lineType: 'solid', color: '#cccccc', thickness: 1 },
    pageMargin: 20,
    themeColor: '#0066cc',
  },
}

export const academicTemplate: Template = {
  id: 'academic',
  name: '学术论文',
  icon: 'graduation-cap',
  readonly: true,
  styles: {
    fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
    fontSize: 12,
    fontColor: '#000000',
    lineHeight: 2.0,
    paragraphSpacing: 6,
    h1: { fontSize: 18, bold: true, color: '#000000', align: 'center', marginTop: 10, marginBottom: 5 },
    h2: { fontSize: 15, bold: true, color: '#000000', align: 'left', marginTop: 8, marginBottom: 4 },
    h3: { fontSize: 13, bold: true, color: '#000000', align: 'left', marginTop: 6, marginBottom: 3 },
    h4: { fontSize: 12, bold: true, color: '#333333', align: 'left', marginTop: 5, marginBottom: 2 },
    table: { borderColor: '#999999', borderMode: 'horizontal', headerBg: 'transparent', headerBold: true, headerColor: '#000000' },
    code: { fontFamily: 'Consolas, Monaco, "Courier New", monospace', fontSize: 10, bgColor: '#f8f8f8', border: false },
    separator: { lineType: 'solid', color: '#999999', thickness: 1 },
    pageMargin: 25.4,
    themeColor: '#1a1a1a',
  },
}

export const techTemplate: Template = {
  id: 'tech',
  name: '技术文档',
  icon: 'code',
  readonly: true,
  styles: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 11,
    fontColor: '#333333',
    lineHeight: 1.4,
    paragraphSpacing: 4,
    h1: { fontSize: 17, bold: true, color: '#1a1a1a', align: 'left', marginTop: 8, marginBottom: 4 },
    h2: { fontSize: 14, bold: true, color: '#2c3e50', align: 'left', marginTop: 6, marginBottom: 3 },
    h3: { fontSize: 12, bold: true, color: '#34495e', align: 'left', marginTop: 5, marginBottom: 2 },
    h4: { fontSize: 11, bold: true, color: '#555555', align: 'left', marginTop: 4, marginBottom: 2 },
    table: { borderColor: '#e0e0e0', borderMode: 'all', headerBg: '#e8e8e8', headerBold: true, headerColor: '#333333' },
    code: { fontFamily: 'Consolas, Monaco, "Fira Code", monospace', fontSize: 11, bgColor: '#f5f5f5', border: true },
    separator: { lineType: 'dashed', color: '#dddddd', thickness: 1 },
    pageMargin: 20,
    themeColor: '#3498db',
  },
}

export function getCustomTemplate(): Template {
  const saved = localStorage.getItem('md2doc-custom-template')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      // fallback
    }
  }
  return {
    id: 'custom',
    name: '自定义',
    icon: 'palette',
    readonly: false,
    styles: { ...defaultTemplate.styles },
  }
}

export function saveCustomTemplate(template: Template) {
  localStorage.setItem('md2doc-custom-template', JSON.stringify(template))
}

export const presetTemplates: Template[] = [defaultTemplate, academicTemplate, techTemplate]
export const allTemplates = (): Template[] => [...presetTemplates, getCustomTemplate()]
