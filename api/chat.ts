import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers to support local development (Vite at :5173 -> Vercel dev at :3000)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    const completion = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages,
      temperature: 0.7,
    })
    const reply = completion.choices[0]?.message?.content ?? ''
    res.json({ reply })
  } catch (error: any) {
    console.error('Chat error', error)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
}
