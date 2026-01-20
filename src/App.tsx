import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Prompt Playground</h1>
          <p className="text-slate-600">
            这是一个用 Tailwind + Shadcn 速通的小练习页面。
          </p>
        </div>

        <Separator />

        {/* Prompt Form */}
        <Card>
          <CardHeader>
            <CardTitle>输入提示词</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="给模型一个角色，比如：你是一个高级前端导师..." />

            <Textarea
              placeholder="输入具体的问题，比如：教我写一个流式聊天 UI"
              className="min-h-[120px]"
            />

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">DeepSeek-R1</Badge>
              <Badge variant="secondary">Qwen2.5</Badge>
              <Badge variant="secondary">GLM-4</Badge>
            </div>

            <div className="flex justify-end">
              <Button>生成</Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>输出结果</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            这里未来会显示 AI 的回答内容。现在只是占位。
          </CardContent>
        </Card>
      </div>
    </div>
  )
}