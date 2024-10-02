import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, generateText, streamText } from 'ai'
import { getTools } from './tools'
import { getModel } from '../utils'
import { AnswerSection } from '@/components/answer-section'

const SYSTEM_PROMPT = `As a highly skilled real estate and property research analyst specialising in the Australian market, you have access to comprehensive property data, market trends, and economic indicators. Your expertise encompasses residential, commercial, and industrial property sectors across Australia.

For each user query:
1. Utilise the most up-to-date and relevant search results to provide thorough, data-driven insights.
2. Incorporate key Australian property metrics such as median house prices, rental yields, vacancy rates, and capital growth figures when applicable.
3. Reference reputable Australian sources like the Australian Bureau of Statistics (ABS), CoreLogic, Domain, and state-specific real estate institutes.
4. Include relevant images, charts, or graphs that illustrate market trends or property data.
5. Consider both macro and micro factors affecting the Australian property market, including interest rates, government policies, demographic shifts, and local area developments.
6. Provide analysis on property market forecasts, investment opportunities, and potential risks within the Australian context.
7. When discussing specific locations, include suburb profiles and local market conditions where relevant.
8. Address sustainability and environmental factors impacting property values and development in Australia.
9. Explain any technical terms or jargon specific to the Australian real estate market.
10. Highlight any recent legislative changes or proposed reforms that may affect the property sector.

Aim to deliver a comprehensive, well-researched response that directly addresses the user's query while offering additional valuable insights for property research in Australia. All responses should use Australian English spelling and terminology. Always cite sources (with links).

If the search results do not provide sufficient information to answer the query fully, clearly state this and offer the best analysis possible based on available data, while suggesting potential avenues for further research.`

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  try {
    let fullResponse = ''
    const streamableText = createStreamableValue<string>()
    let toolResults: any[] = []

    const currentDate = new Date().toLocaleString()
    const result = await streamText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      messages: messages,
      tools: getTools({
        uiStream,
        fullResponse
      }),
      maxSteps: 5,
      onStepFinish: async event => {
        if (event.stepType === 'initial') {
          if (event.toolCalls && event.toolCalls.length > 0) {
            uiStream.append(<AnswerSection result={streamableText.value} />)
            toolResults = event.toolResults
          } else {
            uiStream.update(<AnswerSection result={streamableText.value} />)
          }
        }
      }
    })

    for await (const delta of result.fullStream) {
      if (delta.type === 'text-delta' && delta.textDelta) {
        fullResponse += delta.textDelta
        streamableText.update(fullResponse)
      }
    }

    streamableText.done(fullResponse)

    return { text: fullResponse, toolResults }
  } catch (error) {
    console.error('Error in researcher:', error)
    return {
      text: 'An error has occurred. Please try again.',
      toolResults: []
    }
  }
}

export async function researcherWithOllama(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  try {
    const fullResponse = ''
    const streamableText = createStreamableValue<string>()
    let toolResults: any[] = []

    const currentDate = new Date().toLocaleString()
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      messages: messages,
      tools: getTools({
        uiStream,
        fullResponse
      }),
      maxSteps: 5,
      onStepFinish: async event => {
        if (event.stepType === 'initial') {
          if (event.toolCalls) {
            uiStream.append(<AnswerSection result={streamableText.value} />)
            toolResults = event.toolResults
          } else {
            uiStream.update(<AnswerSection result={streamableText.value} />)
          }
        }
      }
    })

    streamableText.done(result.text)

    return { text: result.text, toolResults }
  } catch (error) {
    console.error('Error in researcherWithOllama:', error)
    return {
      text: 'An error has occurred. Please try again.',
      toolResults: []
    }
  }
}
