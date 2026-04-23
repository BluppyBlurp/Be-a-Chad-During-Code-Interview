import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <p className="tag">// powered by Groq + Monaco</p>
        <h1>Be a <span className="chad">Chad</span> During Code Interview</h1>
        <p className="sub">Stop fumbling. Start coding like you own the room.</p>
        <button onClick={() => navigate('/config')} className="start-btn">
          Start Coding →
        </button>
      </section>

      {/* WHAT IT OFFERS */}
      <section className="offers">
        <h2>// what it offers</h2>
        <div className="cards">
          <div className="card">🧠 5 guidance levels — from vibe coding to hint-only</div>
          <div className="card">🎤 AI interviewer that speaks to you</div>
          <div className="card">📍 Line-by-line code feedback</div>
          <div className="card">⏱ Timed sessions like a real interview</div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>// about</h2>
        <p>Built by someone who fumbled a live coding interview and said — never again.</p>
      </section>

    </div>
  )
}