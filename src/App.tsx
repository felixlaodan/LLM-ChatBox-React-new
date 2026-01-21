// function App() {
//   return (
//     // 这是一个空的路由占位容器
//     <div className="min-h-screen bg-background font-sans antialiased">
//       {/* 后续这里会放 <RouterProvider /> 或路由入口 */}
//       <div className="flex items-center justify-center h-screen text-muted-foreground">
//         App is ready.
//       </div>
//     </div>
//   )
// }

// export default App

// import { Button } from "@/components/ui/button" // 👈 测试 alias 是否工作
// import { useState } from "react"

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-slate-50">
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold text-blue-600">环境检查通过！</h1>
//         <p className="text-slate-500">Tailwind CSS v4 正常工作</p>
//         <Button onClick={() => setCount(c => c + 1)}>
//           Shadcn 按钮被点击了 {count} 次
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default App

// src/App.tsx 的临时测试代码
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

function App() {
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    // 打印当前的设置，看看是否读取到了默认值或之前保存的值
    console.log('Current Settings:', settings);
    
    // 把 Store 挂载到 window 对象上，方便在控制台调试
    // @ts-expect-error for debugging purposes
    window.useSettingsStore = useSettingsStore;
  }, [settings]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Settings Store Test</h1>
      <p>Current API Key: {settings.apiKey || 'Not Set'}</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => updateSettings({ apiKey: 'test-key-' + Date.now() })}
      >
        Set Random API Key
      </button>
    </div>
  );
}

export default App;