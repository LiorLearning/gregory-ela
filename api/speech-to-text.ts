import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import formidable from 'formidable'
import { createReadStream } from 'fs'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, multipart/form-data')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('[speech] Starting audio processing...')
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('[speech] OPENAI_API_KEY not found')
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      maxFields: 10,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB for fields
      keepExtensions: true,
      filename: (name, ext, part) => {
        return `upload_${Date.now()}${ext}`
      }
    })
    
    const [fields, files] = await form.parse(req)
    
    const audioFiles = files.audio
    if (!audioFiles || audioFiles.length === 0) {
      console.error('[speech] No audio file provided')
      return res.status(400).json({ error: 'No audio file provided' })
    }
    
    const audioFile = audioFiles[0]
    console.log('[speech] Processing audio file, size:', audioFile.size, 'type:', audioFile.mimetype, 'path:', audioFile.filepath)
    
    // Convert audio to text using OpenAI Whisper
    console.log('[speech] Sending to OpenAI Whisper...')
    
    let fileStream: any = null
    try {
      fileStream = createReadStream(audioFile.filepath)
      
      const response = await openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
        language: 'en'
      })

      const transcript = response.text || ''
      console.log('[speech] Transcript received:', transcript)
      
      return res.json({ transcript: transcript.trim() })
    } catch (whisperError: any) {
      console.error('[speech] OpenAI Whisper error:', whisperError)
      throw new Error(`Whisper API error: ${whisperError.message || whisperError}`)
    } finally {
      // Cleanup file stream if it was created
      if (fileStream && typeof fileStream.destroy === 'function') {
        try {
          fileStream.destroy()
        } catch (cleanupError) {
          console.warn('[speech] File stream cleanup error:', cleanupError)
        }
      }
    }
  } catch (error: any) {
    console.error('[speech] Speech-to-text error:', error.message || error)
    console.error('[speech] Error stack:', error.stack)
    if (error.response) {
      console.error('[speech] API response error:', error.response.data)
    }
    return res.status(500).json({ 
      error: 'Speech-to-text conversion failed: ' + (error.message || 'Unknown error') 
    })
  }
}
