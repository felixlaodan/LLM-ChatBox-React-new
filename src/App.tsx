import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-600">
          Tailwind + Shadcn 配置成功!
        </h1>
        <p className="text-gray-500">
          如果看到蓝色标题和下面的黑色按钮，说明环境搭建完美。
        </p>
        <Button onClick={() => alert("Shadcn UI Works!")}>
          点击我测试交互
        </Button>
      </div>
    </div>
  )
}

export default App