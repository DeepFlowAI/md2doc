import { useAppStore } from '../store'
import { Edit3, Clipboard, Trash2 } from 'lucide-react'

export default function Editor() {
  const { markdown, setMarkdown } = useAppStore()

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setMarkdown(text)
    } catch {
      // Clipboard API may not be available
    }
  }

  const handleClear = () => {
    setMarkdown('')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Edit3 size={16} className="text-gray-500" />
          Markdown 编辑
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePaste}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title="粘贴"
          >
            <Clipboard size={15} />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title="清除"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 w-full p-4 text-sm font-mono resize-none focus:outline-none bg-white text-gray-800 leading-relaxed"
        placeholder="在此粘贴或输入 Markdown..."
        spellCheck={false}
        style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace' }}
      />
    </div>
  )
}
