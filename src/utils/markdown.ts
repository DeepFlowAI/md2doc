import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import katexPlugin from '@vscode/markdown-it-katex'

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${str}</div>`
    }
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {
        // fallback
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

md.use(katexPlugin, { throwOnError: false })

export function renderMarkdown(source: string): string {
  return md.render(source)
}
