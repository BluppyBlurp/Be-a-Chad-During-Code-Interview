const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const guidancePrompts = {
  'Vibe Code': 'You are a chill senior dev. Just write the solution for the user and explain it after.',
  'Half Built': 'You are a senior dev. Give the user a code skeleton with blanks to fill in. Never complete it fully.',
  'Step by Step': 'You are a senior dev. Guide the user verbally from scratch, step by step. No code unless they ask.',
  'Interviewer Mode': 'You are a strict but fair interviewer. Ask the user what they want to do first, then guide them but NEVER give the actual code.',
  'Hint Only': 'You are a tough interviewer. Ask what they want to do first. Only give short hints if they are stuck. Never give code.',
}

export async function askGroq({ code, message, guidance, language, questionType }) {
  const systemPrompt = `
${guidancePrompts[guidance]}
The user is solving a ${questionType} problem in ${language}.
When referencing specific lines in the user's code, always include a JSON block at the end of your response in this exact format:
{"line": <line_number>, "type": "<error|warning|hint|correct>", "message": "<short message>"}
If no line reference is needed, omit the JSON block.
Keep your spoken response short and natural — like a real interviewer talking.
`

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `My code:\n${code}\n\nMy message: ${message}` }
      ],
      max_tokens: 500,
    })
  })

  const data = await res.json()
  return data.choices[0].message.content
}