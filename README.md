# md2doc

纯前端的 Markdown 转 Word/PDF 工具，支持多种可切换、可编辑的样式模板，所见即所得。

## 功能特性

- **Markdown 编辑与实时预览**：支持常见语法（标题、列表、表格、代码块、引用、链接、图片等），代码块语法高亮
- **导出 Word / PDF**：一键导出为 `.docx` 或 `.pdf` 格式
- **样式模板系统**：内置默认、学术论文、技术文档三种预设模板，支持切换和实时预览
- **自定义模板**：可修改样式配置（字体、字号、颜色、行高、标题样式、表格样式等），自定义模板自动保存到本地
- **所见即所得**：预览区以纸张形式展示，带缩放控制

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- markdown-it + highlight.js（Markdown 解析与代码高亮）
- docx（Word 导出）
- html2pdf.js（PDF 导出）

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
md2doc/
├── src/
│   ├── components/     # 编辑器、预览、样式面板等组件
│   ├── store/          # Zustand 状态管理
│   ├── templates/      # 预设与自定义模板
│   └── utils/          # Markdown 解析、导出、样式工具
├── docs/               # 需求文档、技术分析
└── index.html
```

## License

Apache-2.0
