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

const sampleMarkdown = `# md2doc

纯前端的 Markdown 转 Word/PDF 工具，支持多种可切换、可编辑的样式模板，所见即所得。

**纯前端，无后端，数据本地，安全**：所有处理均在浏览器内完成，文档内容与样式配置仅保存在本地，不上传任何服务器，隐私有保障。

## 功能特性

- **Markdown 编辑与实时预览**：支持常见语法（标题、列表、表格、代码块、引用、链接、图片等），代码块语法高亮
- **导出 Word / PDF**：一键导出为 \`.docx\` 或 \`.pdf\` 格式
- **样式模板系统**：内置默认、学术论文、技术文档三种预设模板，支持切换和实时预览
- **自定义模板**：可修改样式配置，自定义模板自动保存到本地
- **所见即所得**：预览区以纸张形式展示，带缩放控制

### 代码示例

\`\`\`bash
npm install
npm run dev
\`\`\`

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 + TypeScript | 前端框架 |
| Vite 6 | 构建工具 |
| markdown-it + highlight.js | Markdown 解析与代码高亮 |
| docx | Word 导出 |
| html2pdf.js | PDF 导出 |

> 提示：所有数据仅在浏览器本地处理，不会上传到服务器。

---

[GitHub 仓库](https://github.com/DeepFlowAI/md2doc)
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
