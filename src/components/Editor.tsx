import { useRef } from 'react'
import { useAppStore } from '../store'
import { Edit3, Clipboard, Trash2, Upload } from 'lucide-react'
import { useI18n } from '../i18n'

export default function Editor() {
  const { markdown, setMarkdown } = useAppStore()
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMarkdown(reader.result)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

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
          {t.editor.title}
        </div>
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title={t.editor.upload}
          >
            <Upload size={15} />
          </button>
          <button
            onClick={handlePaste}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title={t.editor.paste}
          >
            <Clipboard size={15} />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title={t.editor.clear}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 w-full p-4 text-sm font-mono resize-none focus:outline-none bg-white text-gray-800 leading-relaxed"
        placeholder={t.editor.placeholder}
        spellCheck={false}
        style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace' }}
      />
    </div>
  )
}
