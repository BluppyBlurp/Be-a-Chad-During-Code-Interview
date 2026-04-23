import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { askGroq } from '../services/groq'
import './IDE.css'

const guidanceLevels = ['Vibe Code', 'Half Built', 'Step by Step', 'Interviewer Mode', 'Hint Only']

export default function IDE() {
  const { state } = useLocation()
  const { language, type } = state || {}

  const [code, setCode] = useState('// start coding here')
  const [guidance, setGuidance] = useState('Interviewer Mode')
  const [messages, setMessages] = useState([
    { role: 'groq', text: `Hey! I'm Chad, your interviewer today. We'll be doing a ${type} problem in ${language}. Select your guidance level above and tell me when you're ready.` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const editorRef = useRef(null)
  const decorationsRef = useRef([])

  const handleEditorMount = (editor) => {
    editorRef.current = editor
  }

  const highlightLine = (line, type) => {
    const classMap = {
      error: 'highlight-error',
      warning: 'highlight-warning',
      hint: 'highlight-hint',
      correct: 'highlight-correct',
    }
    const editor = editorRef.current
    if (!editor || !line) return
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [{
      range: new window.monaco.Range(line, 1, line, 1),
      options: { isWholeLine: true, className: classMap[type] || 'highlight-hint' }
    }])
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const raw = await askGroq({ code, message: input, guidance, language, questionType: type })

    // parse optional JSON line reference
    const jsonMatch = raw.match(/\{.*"line".*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        highlightLine(parsed.line, parsed.type)
      } catch (_) {}
    }

    const cleanText = raw.replace(/\{.*"line".*\}/, '').trim()
    setMessages(prev => [...prev, { role: 'groq', text: cleanText }])
    setLoading(false)

    // speak
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 200))
    utterance.rate = 1
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="ide">

      {/* TOP BAR */}
      <div className="topbar">
        <span className="ide-title">🗿 Chad Interview Sim — {type} / {language}</span>
        <select
          className="guidance-select"
          value={guidance}
          onChange={e => setGuidance(e.target.value)}
        >
          {guidanceLevels.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* MAIN */}
      <div className="ide-main">

        {/* EDITOR */}
        <div className="editor-panel">
          <Editor
            height="100%"
            language={language?.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={val => setCode(val)}
            onMount={handleEditorMount}
          />
        </div>

        {/* CHAT */}
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`bubble ${msg.role}`}>
                <span className="bubble-label">{msg.role === 'groq' ? '🗿 Chad' : '👤 You'}</span>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && <div className="bubble groq"><span className="bubble-label">🗿 Chad</span><p>thinking...</p></div>}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Chad or describe your approach..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>

      </div>
    </div>
  )
}