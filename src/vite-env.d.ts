/// <reference types="vite/client" />

declare module 'html2pdf.js' {
  const html2pdf: any
  export default html2pdf
}

declare module '@vscode/markdown-it-katex' {
  import type MarkdownIt from 'markdown-it'
  const katexPlugin: MarkdownIt.PluginWithOptions<{ throwOnError?: boolean }>
  export default katexPlugin
}
