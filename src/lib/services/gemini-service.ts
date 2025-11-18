import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Generate product recommendations based on user behavior
 */
export async function generateProductRecommendations(
  userHistory: {
    viewedProducts: string[]
    purchasedProducts: string[]
    searchQueries: string[]
  },
  availableProducts: Array<{
    id: string
    name: string
    category: string
    price: number
    description: string
  }>
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are an AI shopping assistant for an e-commerce platform. Based on the user's shopping behavior, recommend products that would be most relevant to them.

User's Shopping History:
- Viewed Products: ${userHistory.viewedProducts.join(', ')}
- Purchased Products: ${userHistory.purchasedProducts.join(', ')}
- Search Queries: ${userHistory.searchQueries.join(', ')}

Available Products:
${availableProducts.map((p, i) => `${i + 1}. ${p.name} (${p.category}) - ${p.price} PKR - ${p.description.substring(0, 100)}`).join('\n')}

Recommend the top 5 products that would be most interesting to this user. Return only the product IDs as a comma-separated list, nothing else.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse product IDs from response
    const recommendedIds = text
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
      .slice(0, 5)

    return recommendedIds
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return []
  }
}

/**
 * Enhance product search with natural language understanding
 */
export async function enhanceProductSearch(query: string): Promise<{
  enhancedQuery: string
  suggestedFilters: {
    category?: string
    priceRange?: { min: number; max: number }
    brand?: string
    attributes?: Record<string, string>
  }
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are an AI search assistant for an e-commerce platform. Analyze the following search query and extract useful information:

Search Query: "${query}"

Extract:
1. Enhanced search keywords (remove filler words, fix typos)
2. Suggested category (if mentioned)
3. Price range (if mentioned)
4. Brand (if mentioned)
5. Any product attributes (color, size, material, etc.)

Return a JSON object with this structure:
{
  "enhancedQuery": "cleaned search keywords",
  "category": "category name or null",
  "priceRange": { "min": number, "max": number } or null,
  "brand": "brand name or null",
  "attributes": { "key": "value" } or null
}

Return ONLY valid JSON, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    // Remove markdown code blocks if present
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')

    const parsed = JSON.parse(jsonText)

    return {
      enhancedQuery: parsed.enhancedQuery || query,
      suggestedFilters: {
        category: parsed.category || undefined,
        priceRange: parsed.priceRange || undefined,
        brand: parsed.brand || undefined,
        attributes: parsed.attributes || undefined,
      },
    }
  } catch (error) {
    console.error('Error enhancing search:', error)
    return {
      enhancedQuery: query,
      suggestedFilters: {},
    }
  }
}

/**
 * Generate product description from basic info
 */
export async function generateProductDescription(product: {
  name: string
  category: string
  attributes: Record<string, string>
  keyFeatures?: string[]
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a compelling and SEO-friendly product description for an e-commerce listing.

Product Name: ${product.name}
Category: ${product.category}
Attributes: ${JSON.stringify(product.attributes)}
Key Features: ${product.keyFeatures?.join(', ') || 'None provided'}

Write a product description that:
1. Is 150-200 words
2. Highlights key features and benefits
3. Uses persuasive language
4. Includes relevant keywords for SEO
5. Is formatted in paragraphs

Return only the product description, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating description:', error)
    return ''
  }
}

/**
 * Analyze review sentiment
 */
export async function analyzeReviewSentiment(reviewText: string): Promise<{
  score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  keyPhrases: string[]
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Analyze the sentiment of this product review:

"${reviewText}"

Provide:
1. Sentiment score from -1 (very negative) to 1 (very positive)
2. Overall sentiment classification (positive, neutral, or negative)
3. Key phrases that influenced the sentiment (up to 5)

Return a JSON object:
{
  "score": number,
  "sentiment": "positive" | "neutral" | "negative",
  "keyPhrases": ["phrase1", "phrase2", ...]
}

Return ONLY valid JSON, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    const parsed = JSON.parse(jsonText)

    return {
      score: parsed.score || 0,
      sentiment: parsed.sentiment || 'neutral',
      keyPhrases: parsed.keyPhrases || [],
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    return {
      score: 0,
      sentiment: 'neutral',
      keyPhrases: [],
    }
  }
}

/**
 * AI Chatbot for customer support
 */
export async function getChatbotResponse(
  message: string,
  context?: {
    userName?: string
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
    orderHistory?: any[]
  }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let contextText = ''
    if (context?.userName) {
      contextText += `Customer Name: ${context.userName}\n`
    }
    if (context?.previousMessages && context.previousMessages.length > 0) {
      contextText += 'Previous Conversation:\n'
      context.previousMessages.forEach((msg) => {
        contextText += `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}\n`
      })
    }

    const prompt = `
You are a helpful customer support AI for an e-commerce platform. Your role is to:
- Answer questions about products, orders, shipping, and returns
- Be friendly, professional, and concise
- Provide accurate information
- Escalate to human support when needed

${contextText}

Customer Message: "${message}"

Provide a helpful response. If you cannot answer, politely suggest contacting human support.
Keep responses under 150 words.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error getting chatbot response:', error)
    return 'I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.'
  }
}

/**
 * Detect potential fraud in orders
 */
export async function detectFraud(orderData: {
  userId?: string
  email: string
  shippingAddress: string
  billingAddress: string
  totalAmount: number
  itemsCount: number
  paymentMethod: string
  userAgent?: string
  ipAddress?: string
}): Promise<{
  isSuspicious: boolean
  riskScore: number
  reasons: string[]
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Analyze this e-commerce order for potential fraud:

Order Details:
- User ID: ${orderData.userId || 'Guest'}
- Email: ${orderData.email}
- Shipping Address: ${orderData.shippingAddress}
- Billing Address: ${orderData.billingAddress}
- Total Amount: ${orderData.totalAmount} PKR
- Items Count: ${orderData.itemsCount}
- Payment Method: ${orderData.paymentMethod}

Analyze for fraud indicators such as:
- Mismatched addresses
- Unusually high order value
- Suspicious email patterns
- Payment method risks

Return a JSON object:
{
  "isSuspicious": boolean,
  "riskScore": number (0-100),
  "reasons": ["reason1", "reason2", ...]
}

Return ONLY valid JSON, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    const parsed = JSON.parse(jsonText)

    return {
      isSuspicious: parsed.isSuspicious || false,
      riskScore: parsed.riskScore || 0,
      reasons: parsed.reasons || [],
    }
  } catch (error) {
    console.error('Error detecting fraud:', error)
    return {
      isSuspicious: false,
      riskScore: 0,
      reasons: [],
    }
  }
}
