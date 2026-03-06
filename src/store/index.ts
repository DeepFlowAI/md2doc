import { create } from 'zustand'
import { Template, TemplateStyles, presetTemplates, getCustomTemplate, saveCustomTemplate } from '../templates'

interface AppState {
  markdown: string
  setMarkdown: (md: string) => void

  currentTemplate: Template
  setCurrentTemplate: (id: string) => void
  updateStyles: (styles: Partial<TemplateStyles>) => void
  updateHeadingStyle: (level: 'h1' | 'h2' | 'h3' | 'h4', updates: Record<string, unknown>) => void
  updateTableStyle: (updates: Record<string, unknown>) => void
  updateCodeStyle: (updates: Record<string, unknown>) => void
  updateSeparatorStyle: (updates: Record<string, unknown>) => void

  zoom: number
  setZoom: (zoom: number) => void
}

const allTemplates = [...presetTemplates, getCustomTemplate()]

const sampleMarkdown = `# 项目简介

这是一个 Markdown 转 Word/PDF 的工具。

## 功能特点

- 实时预览转换效果
- 支持多种样式模板
- 纯前端实现，无需后端
- 导出 Word 和 PDF

### 代码示例

\`\`\`javascript
const greeting = 'Hello, md2doc!';
console.log(greeting);
\`\`\`

## 表格示例

| 功能 | 状态 |
|------|------|
| Markdown 解析 | ✅ |
| Word 导出 | ✅ |
| PDF 导出 | ✅ |
| 样式模板 | ✅ |

> 提示：所有数据仅在浏览器本地处理，不会上传到服务器。

---

**加粗文本**、*斜体文本*、~~删除线~~

[访问 GitHub](https://github.com)
`

export const useAppStore = create<AppState>((set, get) => ({
  markdown: sampleMarkdown,
  setMarkdown: (md) => set({ markdown: md }),

  currentTemplate: allTemplates[0],
  setCurrentTemplate: (id) => {
    const all = [...presetTemplates, getCustomTemplate()]
    const found = all.find((t) => t.id === id)
    if (found) set({ currentTemplate: found })
  },

  updateStyles: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: { ...currentTemplate.styles, ...updates },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateHeadingStyle: (level, updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        [level]: { ...currentTemplate.styles[level], ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateTableStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        table: { ...currentTemplate.styles.table, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateCodeStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        code: { ...currentTemplate.styles.code, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateSeparatorStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        separator: { ...currentTemplate.styles.separator, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  zoom: 100,
  setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(200, zoom)) }),
}))
