import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers to support local development
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
    const { prompt, style = 'vivid' } = req.body

        if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' })
    }

    // Create exciting, adventurous images that kids will love while maintaining safety
    const enhancedPrompt = `Create an epic, high-quality image for an exciting space adventure story: ${prompt}. Style: dynamic and cinematic with vibrant colors, dramatic lighting, and amazing details. Make it look awesome and thrilling - the kind of image kids would want as their wallpaper. Include epic sci-fi elements, cool technology, alien worlds, space battles, or magical creatures as appropriate. Keep all content completely family-friendly with no nudity, no sexual content, and no suggestive or romantic posing. Absolutely avoid sexualized bodies or clothing (no cleavage, lingerie, swimwear, exposed midriff, or tight/transparent outfits); characters are depicted in fully modest attire suitable for kids. No kissing, flirting, or adult themes. Focus on adventure, heroism, friendship, and epic moments. Strictly avoid text on the images.`

    // First, try the original prompt
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        style: style as "vivid" | "natural",
        quality: "standard"
      })

      const imageUrl = response.data?.[0]?.url
      
      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E')
      }

      res.json({ 
        imageUrl,
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        wasSanitized: false
      })

    } catch (dalleError: any) {
      // If DALL-E rejects due to content policy, try AI sanitization
      if (dalleError.code === 'content_policy_violation') {
        console.log('Content policy violation, attempting AI sanitization...')
        
        const sanitizationResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a content safety assistant for epic adventure content. Your job is to make prompts safe for children aged 8-14 while keeping them COOL, EXCITING, and EPIC - never childish or babyish. Replace inappropriate content with awesome alternatives that kids think are amazing. Transform: weapons→energy tools/tech gadgets, violence→heroic challenges, scary monsters→awesome alien creatures, destruction→spectacular effects. Strictly prohibit any nudity, sexual content, suggestive clothing, romantic posing, kissing, or adult themes; characters must be fully modest and age-appropriate. Keep it cinematic, dramatic, and thrilling. Return ONLY the sanitized prompt, nothing else."
            },
            {
              role: "user",
              content: `Please make this image prompt safe and appropriate for kids while keeping it exciting: "${prompt}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })

        const sanitizedPrompt = sanitizationResponse.choices[0]?.message?.content?.trim() || prompt
        const sanitizedEnhancedPrompt = `Create an epic, high-quality image for an exciting space adventure story: ${sanitizedPrompt}. Style: dynamic and cinematic with vibrant colors, dramatic lighting, and amazing details. Make it look awesome and thrilling - the kind of image kids would want as their wallpaper. Include epic sci-fi elements, cool technology, alien worlds, space battles, or magical creatures as appropriate. Keep all content completely family-friendly with no nudity, sexual content, or inappropriate material whatsoever. Focus on adventure, heroism, friendship, and epic moments. Strictly avoid text on the images.`

        // Try again with sanitized prompt
        const retryResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: sanitizedEnhancedPrompt,
          n: 1,
          size: "1024x1024",
          style: style as "vivid" | "natural",
          quality: "standard"
        })

        const retryImageUrl = retryResponse.data?.[0]?.url
        
        if (!retryImageUrl) {
          throw new Error('No image URL returned from DALL-E after sanitization')
        }

        res.json({ 
          imageUrl: retryImageUrl,
          prompt: sanitizedEnhancedPrompt,
          originalPrompt: prompt,
          sanitizedPrompt: sanitizedPrompt,
          wasSanitized: true
        })
      } else {
        // Re-throw non-content-policy errors
        throw dalleError
      }
    }

  } catch (error: any) {
    console.error('DALL-E image generation error:', error)
    
    // Return specific error messages for different scenarios
    if (error.code === 'content_policy_violation') {
      res.status(400).json({ error: 'Content not suitable for image generation. Please try a different description.' })
    } else if (error.code === 'rate_limit_exceeded') {
      res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
    } else {
      res.status(500).json({ error: 'Failed to generate image. Please try again.' })
    }
  }
}
