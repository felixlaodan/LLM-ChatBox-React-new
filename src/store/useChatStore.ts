import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Conversation,type Message } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // 确保你安装了 uuid: pnpm add uuid @types/uuid

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;

  // Actions
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateLastMessage: (content: string, reasoning?: string) => void;
  
  // Getters (Selectors)
  getCurrentConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,

      createConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: '新对话',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          let newCurrentId = state.currentConversationId;

          // 如果删除的是当前会话，需要切换到其他会话
          if (state.currentConversationId === id) {
            newCurrentId = newConversations.length > 0 ? newConversations[0].id : null;
          }

          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          };
        });
        
        // 如果删光了，自动新建一个
        if (get().conversations.length === 0) {
          get().createConversation();
        }
      },

      selectConversation: (id) => {
        set({ currentConversationId: id });
      },

      updateConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }));
      },

      addMessage: (message) => {
        const currentId = get().currentConversationId;
        if (!currentId) return;

        const newMessage: Message = {
          id: uuidv4(),
          timestamp: Date.now(),
          ...message,
        };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === currentId
              ? { ...c, messages: [...c.messages, newMessage] }
              : c
          ),
        }));
      },

      // 专门用于流式响应的高频更新
      updateLastMessage: (content, reasoning) => {
        const currentId = get().currentConversationId;
        if (!currentId) return;

        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== currentId) return c;
            
            const lastMsgIndex = c.messages.length - 1;
            if (lastMsgIndex < 0) return c;

            const newMessages = [...c.messages];
            const lastMsg = { ...newMessages[lastMsgIndex] };
            
            // 增量更新或全量替换，这里假设是追加更新，但通常流式处理会在外部拼接好
            // 简单起见，我们这里直接替换 content，由外部控制拼接逻辑
            lastMsg.content = content;
            if (reasoning) lastMsg.reasoning_content = reasoning;
            
            newMessages[lastMsgIndex] = lastMsg;
            
            return { ...c, messages: newMessages };
          }),
        }));
      },

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((c) => c.id === currentConversationId);
      },
    }),
    {
      name: 'chat-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);