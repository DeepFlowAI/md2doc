export type Locale = 'zh' | 'en'

export interface Messages {
  topBar: {
    subtitle: string
  }
  editor: {
    title: string
    upload: string
    paste: string
    clear: string
    placeholder: string
  }
  preview: {
    title: string
    exportWord: string
    exportPDF: string
    exporting: string
    exportWordFail: string
    exportPDFFail: string
  }
  stylePanel: {
    templateSelection: string
    bodyStyle: string
    font: string
    fontSize: string
    color: string
    lineHeight: string
    paragraphSpacing: string
    heading: string
    weight: string
    bold: string
    normal: string
    align: string
    left: string
    center: string
    right: string
    marginTop: string
    marginBottom: string
    tableStyle: string
    borderColor: string
    borderMode: string
    allBorders: string
    horizontalOnly: string
    headerBg: string
    headerBold: string
    headerColor: string
    yes: string
    no: string
    codeBlock: string
    codeFont: string
    codeBgColor: string
    codeBorder: string
    withBorder: string
    noBorder: string
    separator: string
    separatorType: string
    solid: string
    dashed: string
    dotted: string
    thickness: string
    page: string
    pageMargin: string
    themeColor: string
    fontMsYahei: string
    fontTimesNewRoman: string
    fontArial: string
    fontSystemSansSerif: string
    fontSimsun: string
  }
  templates: {
    default: string
    academic: string
    tech: string
    custom: string
  }
  language: {
    zh: string
    en: string
  }
  sampleMarkdown: string
}

const zh: Messages = {
  topBar: {
    subtitle: 'Markdown → Word / PDF',
  },
  editor: {
    title: 'Markdown 编辑',
    upload: '上传 MD 文件',
    paste: '粘贴',
    clear: '清除',
    placeholder: '在此粘贴或输入 Markdown...',
  },
  preview: {
    title: '实时预览',
    exportWord: '导出 Word',
    exportPDF: '导出 PDF',
    exporting: '导出中...',
    exportWordFail: '导出 Word 失败：',
    exportPDFFail: '导出 PDF 失败：',
  },
  stylePanel: {
    templateSelection: '模板选择',
    bodyStyle: '正文样式',
    font: '字体',
    fontSize: '字号',
    color: '颜色',
    lineHeight: '行高',
    paragraphSpacing: '段落间距',
    heading: '标题',
    weight: '粗细',
    bold: '加粗',
    normal: '正常',
    align: '对齐',
    left: '左对齐',
    center: '居中',
    right: '右对齐',
    marginTop: '上间距',
    marginBottom: '下间距',
    tableStyle: '表格样式',
    borderColor: '边框颜色',
    borderMode: '边框模式',
    allBorders: '全部边框',
    horizontalOnly: '仅横线',
    headerBg: '表头背景',
    headerBold: '表头加粗',
    headerColor: '表头颜色',
    yes: '是',
    no: '否',
    codeBlock: '代码块',
    codeFont: '字体',
    codeBgColor: '背景色',
    codeBorder: '边框',
    withBorder: '有边框',
    noBorder: '无边框',
    separator: '分隔线',
    separatorType: '类型',
    solid: '实线',
    dashed: '虚线',
    dotted: '点线',
    thickness: '粗细',
    page: '页面',
    pageMargin: '页边距',
    themeColor: '主题色',
    fontMsYahei: '微软雅黑',
    fontTimesNewRoman: 'Times New Roman',
    fontArial: 'Arial',
    fontSystemSansSerif: '系统无衬线',
    fontSimsun: '宋体',
  },
  templates: {
    default: '默认模板',
    academic: '学术论文',
    tech: '技术文档',
    custom: '自定义',
  },
  language: {
    zh: '中文',
    en: 'English',
  },
  sampleMarkdown: `# md2doc

纯前端的 Markdown 转 Word/PDF 工具，支持多种可切换、可编辑的样式模板，所见即所得。

**纯前端，无后端，数据本地，安全**：所有处理均在浏览器内完成，文档内容与样式配置仅保存在本地，不上传任何服务器，隐私有保障。

## 功能特性

- **Markdown 编辑与实时预览**：支持常见语法（标题、列表、表格、代码块、引用、链接、图片等），代码块语法高亮
- **导出 Word / PDF**：一键导出为 \`.docx\` 或 \`.pdf\` 格式
- **样式模板系统**：内置默认、学术论文、技术文档三种预设模板，支持切换和实时预览
- **自定义模板**：可修改样式配置，自定义模板自动保存到本地
- **所见即所得**：预览区以纸张形式展示，带缩放控制
- **Mermaid 图表**：支持流程图、时序图、甘特图等多种图表
- **LaTeX 数学公式**：支持行内公式与块级公式渲染

### 代码示例

\`\`\`python
from dataclasses import dataclass, field


@dataclass
class Task:
    title: str
    done: bool = False
    tags: list[str] = field(default_factory=list)

    def toggle(self):
        self.done = not self.done
        return self


tasks = [Task("Write README", tags=["docs"]), Task("Fix bug", tags=["urgent"])]
active = [t for t in tasks if not t.done]
print(f"Pending: {len(active)}/{len(tasks)}")
\`\`\`

### Mermaid 流程图

\`\`\`mermaid
graph TD
    A[输入 Markdown] --> B[解析渲染]
    B --> C{选择导出格式}
    C -->|Word| D[导出 .docx]
    C -->|PDF| E[导出 .pdf]
\`\`\`

### LaTeX 数学公式

行内公式：质能方程 $E = mc^2$，欧拉公式 $e^{i\\pi} + 1 = 0$

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 + TypeScript | 前端框架 |
| Vite 6 | 构建工具 |
| markdown-it + highlight.js | Markdown 解析与代码高亮 |
| Mermaid | 图表渲染 |
| KaTeX | 数学公式渲染 |
| docx | Word 导出 |
| html2pdf.js | PDF 导出 |

> 提示：所有数据仅在浏览器本地处理，不会上传到服务器。

---

[GitHub 仓库](https://github.com/DeepFlowAI/md2doc)
`,
}

const en: Messages = {
  topBar: {
    subtitle: 'Markdown → Word / PDF',
  },
  editor: {
    title: 'Markdown Editor',
    upload: 'Upload MD File',
    paste: 'Paste',
    clear: 'Clear',
    placeholder: 'Paste or type Markdown here...',
  },
  preview: {
    title: 'Live Preview',
    exportWord: 'Export Word',
    exportPDF: 'Export PDF',
    exporting: 'Exporting...',
    exportWordFail: 'Export Word failed: ',
    exportPDFFail: 'Export PDF failed: ',
  },
  stylePanel: {
    templateSelection: 'Templates',
    bodyStyle: 'Body Style',
    font: 'Font',
    fontSize: 'Size',
    color: 'Color',
    lineHeight: 'Line Height',
    paragraphSpacing: 'Paragraph Spacing',
    heading: 'Heading',
    weight: 'Weight',
    bold: 'Bold',
    normal: 'Normal',
    align: 'Align',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    marginTop: 'Top Margin',
    marginBottom: 'Bottom Margin',
    tableStyle: 'Table Style',
    borderColor: 'Border Color',
    borderMode: 'Border Mode',
    allBorders: 'All Borders',
    horizontalOnly: 'Horizontal Only',
    headerBg: 'Header Background',
    headerBold: 'Header Bold',
    headerColor: 'Header Color',
    yes: 'Yes',
    no: 'No',
    codeBlock: 'Code Block',
    codeFont: 'Font',
    codeBgColor: 'Background',
    codeBorder: 'Border',
    withBorder: 'With Border',
    noBorder: 'No Border',
    separator: 'Separator',
    separatorType: 'Type',
    solid: 'Solid',
    dashed: 'Dashed',
    dotted: 'Dotted',
    thickness: 'Thickness',
    page: 'Page',
    pageMargin: 'Page Margin',
    themeColor: 'Theme Color',
    fontMsYahei: 'Microsoft YaHei',
    fontTimesNewRoman: 'Times New Roman',
    fontArial: 'Arial',
    fontSystemSansSerif: 'System Sans-Serif',
    fontSimsun: 'SimSun',
  },
  templates: {
    default: 'Default',
    academic: 'Academic',
    tech: 'Technical',
    custom: 'Custom',
  },
  language: {
    zh: '中文',
    en: 'English',
  },
  sampleMarkdown: `# md2doc

A pure front-end Markdown to Word/PDF tool with switchable and editable style templates. What you see is what you get.

**Pure front-end, no backend, local data, secure**: All processing is done in the browser. Document content and style settings are stored locally only — nothing is uploaded to any server.

## Features

- **Markdown Editing & Live Preview**: Supports common syntax (headings, lists, tables, code blocks, quotes, links, images, etc.) with syntax highlighting
- **Export to Word / PDF**: One-click export to \`.docx\` or \`.pdf\` format
- **Style Template System**: Built-in Default, Academic, and Technical presets with real-time preview
- **Custom Templates**: Modify style settings; custom templates are auto-saved locally
- **WYSIWYG**: Preview area displayed as a paper page with zoom control
- **Mermaid Diagrams**: Supports flowcharts, sequence diagrams, Gantt charts, and more
- **LaTeX Math**: Supports inline and block math formula rendering

### Code Example

\`\`\`python
from dataclasses import dataclass, field


@dataclass
class Task:
    title: str
    done: bool = False
    tags: list[str] = field(default_factory=list)

    def toggle(self):
        self.done = not self.done
        return self


tasks = [Task("Write README", tags=["docs"]), Task("Fix bug", tags=["urgent"])]
active = [t for t in tasks if not t.done]
print(f"Pending: {len(active)}/{len(tasks)}")
\`\`\`

### Mermaid Flowchart

\`\`\`mermaid
graph TD
    A[Input Markdown] --> B[Parse & Render]
    B --> C{Choose Format}
    C -->|Word| D[Export .docx]
    C -->|PDF| E[Export .pdf]
\`\`\`

### LaTeX Math

Inline: Mass-energy equivalence $E = mc^2$, Euler's formula $e^{i\\pi} + 1 = 0$

Block formulas:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

## Tech Stack

| Technology | Purpose |
|------|------|
| React 19 + TypeScript | Frontend Framework |
| Vite 6 | Build Tool |
| markdown-it + highlight.js | Markdown Parsing & Highlighting |
| Mermaid | Diagram Rendering |
| KaTeX | Math Formula Rendering |
| docx | Word Export |
| html2pdf.js | PDF Export |

> Note: All data is processed locally in the browser and is never uploaded to any server.

---

[GitHub Repository](https://github.com/DeepFlowAI/md2doc)
`,
}

export const messages: Record<Locale, Messages> = { zh, en }
