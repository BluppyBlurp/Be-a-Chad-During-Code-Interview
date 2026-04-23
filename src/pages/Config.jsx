import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Config.css'

const languages = ['JavaScript', 'Python', 'TypeScript', 'Java']
const interviewTypes = ['DSA', 'OOP', 'Output Tracing', 'Framework Q&A']

export default function Config() {
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  const handleStart = () => {
    if (!selectedLang || !selectedType) return
    navigate('/ide', { state: { language: selectedLang, type: selectedType } })
  }

  return (
    <div className="config">
      <p className="tag">// setup your session</p>
      <h1>Choose Your <span className="chad">Battlefield</span></h1>

      <div className="section">
        <h2>// select language</h2>
        <div className="options">
          {languages.map(lang => (
            <button
              key={lang}
              className={`option-btn ${selectedLang === lang ? 'active' : ''}`}
              onClick={() => setSelectedLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>// select interview type</h2>
        <div className="options">
          {interviewTypes.map(type => (
            <button
              key={type}
              className={`option-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`start-btn ${!selectedLang || !selectedType ? 'disabled' : ''}`}
        onClick={handleStart}
      >
        Let's Go →
      </button>
    </div>
  )
}