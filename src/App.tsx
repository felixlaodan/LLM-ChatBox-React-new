import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <AppLayout>
      {/* 以下内容会作为 children 传入，并渲染在 AppLayout 的 main 标签内 */}

      {/* 模拟一个顶部 Header 区域 */}
      <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
        <div className="font-semibold">当前对话标题</div>
        <Button variant="outline" size="sm">
          设置
        </Button>
      </header>

      {/* 模拟中间的消息展示区 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4 w-max max-w-[80%]">你好！我是用户。</div>
          <div className="rounded-lg bg-primary text-primary-foreground p-4 w-max max-w-[80%] ml-auto">
            你好！我是 AI 助手，有什么可以帮你的？
          </div>
          <p className="text-muted-foreground text-sm mt-4">
            (尝试改变浏览器窗口宽度，观察左侧边栏的变化)
          </p>
        </div>
      </div>

      {/* 模拟底部输入区 */}
      <div className="border-t p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          {/* 先用普通的 input 占位，后面换成 shadcn 的 Textarea */}
          <input
            type="text"
            className="flex-1 rounded-md border px-3 py-2 bg-background text-sm"
            placeholder="输入消息..."
          />
          <Button>发送</Button>
        </div>
      </div>
    </AppLayout>
  )
}

export default App
