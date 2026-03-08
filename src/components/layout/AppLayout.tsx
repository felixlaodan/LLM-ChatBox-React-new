import React from 'react'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    // 最外层容器：
    // h-screen: 占据视口 100% 高度
    // w-full: 占据视口 100% 宽度
    // flex: 开启 flex 布局，默认为行方向 (row)
    // overflow-hidden: 隐藏超出屏幕的内容，防止出现全局滚动条
    // bg-background: 使用 shadcn 配置的背景色变量 (亮/暗模式自动切换)
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ======================================= */}
      {/* 侧边栏区域 (Sidebar)                      */}
      {/* ======================================= */}
      {/* w-64: 固定宽度 16rem (256px)              */}
      {/* hidden md:flex: 在移动端隐藏，在 md 尺寸 (>=768px) 及以上显示并开启 flex */}
      {/* flex-col: 内部元素垂直排列                */}
      {/* border-r: 右边框，与主内容区分隔          */}
      {/* bg-muted/20: 稍微区别于主背景色的侧边栏背景 */}
      <Sidebar />

      {/* ======================================= */}
      {/* 主内容区域 (Main Content)                 */}
      {/* ======================================= */}
      {/* flex-1: 占据除了侧边栏之外的所有剩余空间  */}
      {/* flex flex-col: 内部开启垂直方向的 flex 布局 */}
      <main className="flex flex-1 flex-col">
        {/* children 就是我们在路由中传入的具体页面内容 (比如聊天界面) */}
        {children}
      </main>
    </div>
  )
}
