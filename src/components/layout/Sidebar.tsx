import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/store/useChatStore"
import { cn } from "@/lib/utils" 

export function Sidebar() {
  const { 
    conversations, 
    currentConversationId, 
    createConversation, 
    selectConversation, 
    deleteConversation 
  } = useChatStore()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex">
      {/* 顶部区域：标题和新建对话按钮。shrink-0 确保在内容过多时头部不会被压缩 */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <span className="font-semibold text-foreground">LLM ChatBox</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={createConversation}
          title="新建对话"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* 列表区域：使用 ScrollArea 包裹，支持滚动。p-2 内边距移到内部容器 */}
      <ScrollArea className="flex-1 h-0">
        <div className="flex flex-col gap-1 p-2">
          {conversations.map((conv) => {
            const isActive = conv.id === currentConversationId
            
            return (
              <div 
                key={conv.id}
                className={cn(
                  "group relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted cursor-pointer",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-foreground"
                )}
                onClick={() => selectConversation(conv.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="truncate">{conv.title}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100",
                    isActive ? "text-primary-foreground hover:text-primary-foreground hover:bg-primary/80" : "text-muted-foreground hover:text-destructive"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conv.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
