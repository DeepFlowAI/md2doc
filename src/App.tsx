import TopBar from './components/TopBar'
import StylePanel from './components/StylePanel'
import Editor from './components/Editor'
import Preview from './components/Preview'

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <div className="w-[300px] shrink-0 overflow-hidden">
          <StylePanel />
        </div>
        <div className="flex-1 min-w-0 border-r border-gray-200">
          <Editor />
        </div>
        <div className="flex-1 min-w-0">
          <Preview />
        </div>
      </div>
    </div>
  )
}
