// src/lib/api.ts
import { useSettingsStore } from '@/store/useSettingsStore'
import { type Message } from '@/types' // 确保这里引入了你在 2.1 阶段定义的 Message 类型

const API_BASE_URL = 'https://api.siliconflow.cn/v1'

/**
 * 创建聊天完成请求 (支持流式和非流式)
 * @param messages 历史消息列表
 * @param onUpdate 流式更新时的回调函数 (传入拼接好的完整内容和推理内容)
 */
export async function createChatCompletion(
  messages: Message[],
  onUpdate: (content: string, reasoningContent?: string) => void,
) {
  // 1. 直接从 Zustand 仓库获取最新的设置，不需要通过 React 组件传参！
  const { settings } = useSettingsStore.getState()

  if (!settings.apiKey) {
    throw new Error('请先在设置中配置 API Key')
  }

  // 2. 构造请求体 (剔除前端 UI 特有的字段如 id, loading 等，只保留 role 和 content 给 API)
  const payload = {
    model: settings.model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: settings.stream,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    top_p: settings.topP,
    top_k: settings.topK,
  }

  // 3. 发起 Fetch 请求
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`)
  }

  // 4. 处理非流式响应 (普通的一波流)
  if (!settings.stream) {
    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    const reasoningContent = data.choices[0]?.message?.reasoning_content || ''
    onUpdate(content, reasoningContent)
    return
  }

  // 5. 处理流式响应 (Streaming)
  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')

  if (!reader) {
    throw new Error('无法读取响应流')
  }

  let fullContent = ''
  let fullReasoning = ''

  try {
    // 开启一个无限循环来持续读取流数据
    while (true) {
      const { done, value } = await reader.read()
      if (done) break // 读取完毕

      // 将二进制分块解码为字符串
      const chunk = decoder.decode(value, { stream: true })
      // API 返回的数据包可能是多个连在一起的，按换行符分割
      const lines = chunk.split('\n')

      for (const line of lines) {
        // SSE 规范：数据以 "data: " 开头
        if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
          try {
            // 截取 "data: " 后面的 JSON 字符串进行解析
            const data = JSON.parse(line.slice(6))
            const delta = data.choices[0]?.delta

            // 累加内容
            if (delta?.content) {
              fullContent += delta.content
            }
            if (delta?.reasoning_content) {
              fullReasoning += delta.reasoning_content // 适配 DeepSeek-R1 的思考过程
            }

            // ★ 触发回调，把最新拼接好的文本传给 UI
            onUpdate(fullContent, fullReasoning)
          } catch (e) {
            // 忽略 JSON 解析错误（有时候流被截断可能会导致半个 JSON）
            console.warn('解析流数据块失败', line, e)
          }
        }
      }
    }
  } finally {
    // 确保无论如何都释放 reader 锁
    reader.releaseLock()
  }
}
