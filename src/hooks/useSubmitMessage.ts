// src/hooks/useSubmitMessage.ts
import { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { createChatCompletion } from '@/lib/api'

export const useSubmitMessage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addMessage, updateLastMessage, currentConversationId, conversations } = useChatStore()

  const submitMessage = async (text: string) => {
    if (!text.trim() || isSubmitting) return

    // 1. 获取当前会话
    const conversation = conversations.find((c) => c.id === currentConversationId)
    if (!conversation) return

    setIsSubmitting(true)

    try {
      // 2. 添加用户消息
      addMessage({
        role: 'user',
        content: text,
      })

      // 3. 添加一个空的助手消息，作为打字机的“占位符”
      addMessage({
        role: 'assistant',
        content: '',
        loading: true, // 标记正在加载
      })

      // 4. 准备传给大模型的历史消息记录
      // 我们需要拿到最新的消息列表（包含刚刚 push进去的 user 消息）
      // 排除刚加进去的那条空的 assistant 消息
      const apiMessages = conversation.messages.concat({
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      })

      // 5. 发起请求，传入 onUpdate 回调函数接收流式数据
      await createChatCompletion(apiMessages, (content, reasoningContent) => {
        // 按照你 store 里的定义，第一个参数是 content，第二个是 reasoning
        updateLastMessage(content, reasoningContent)
      })
    } catch (error: unknown) {
      // 1. 将 any 改为 unknown
      console.error('发送消息失败:', error)
      // 2. 类型守卫，判断 error 是不是 Error 实例
      if (error instanceof Error) {
        updateLastMessage(`\n\n**[请求失败: ${error.message}]**`)
      } else {
        updateLastMessage(`\n\n**[请求失败: 未知错误]**`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return { submitMessage, isSubmitting }
}
