# React 核心基础与 Hooks 完全指南

既然我们要用 React 重写这个复杂的 AI 聊天项目，复习一下 React 的核心思想是非常有必要的。不要被各种新名词吓到，React 的本质其实非常简单。

## 1. React 的世界观：UI = f(state)

在以前（比如 jQuery 时代），如果我们要更新页面上的一个数字，我们需要：
1. 找到那个 HTML 元素 (`document.getElementById`)
2. 修改它的内容 (`element.innerText = newValue`)

在 React 的世界里，**你永远不要直接去操作 DOM（HTML 元素）**。
React 的核心公式是：`UI = f(state)`
（用户界面 = 函数(状态)）

意思是：**你只需要把“数据（State）”准备好，React 会自动帮你把数据渲染成“界面（UI）”。数据一变，界面自动变。**

---

## 2. 组件 (Components)

在 React 中，页面是由一个个“组件”拼装起来的。组件就像是乐高积木。
在现代 React 中，组件本质上就是**一个返回了 HTML (确切说是 JSX) 的普通 JavaScript 函数**。

```tsx
// 这是一个最简单的组件
function Welcome() {
  return <h1>你好，世界！</h1>;
}
```

### 什么是 JSX？
JSX 就是让你在 JavaScript 里面直接写 HTML 标签。它只是个语法糖，最终会被编译成普通的 JS 代码。
*   可以在里面用大括号 `{}` 插入 JS 变量。

```tsx
function Greeting() {
  const name = "张三";
  return <h1>你好, {name}!</h1>; // 渲染出：你好, 张三!
}
```

---

## 3. 什么是 Hook (钩子)？

前面说了，组件就是一个函数。但是，普通的 JS 函数运行完就结束了，里面的变量也会被销毁。
如果我们的组件需要**“记住”**一些东西（比如用户的输入、当前的页码），或者需要**“做一些副作用”**（比如发网络请求），普通函数就搞不定了。

所以 React 发明了 **Hooks（钩子）**。
**Hook 就是一些特殊的函数，它们能让普通的函数组件“钩入（Hook into）” React 的核心功能（如状态管理、生命周期等）。**

Hook 的名字一定是以 `use` 开头的（比如 `useState`, `useEffect`）。

---

## 4. 最常用的核心 Hooks

### 4.1 `useState`：给组件添加记忆 (状态)

`useState` 是最常用的 Hook。它让组件拥有自己的数据。

```tsx
import { useState } from 'react';

function Counter() {
  // 定义一个叫 count 的状态，初始值是 0
  // setCount 是用来修改 count 的专用函数
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点了 {count} 次</p>
      {/* 点击按钮时，调用 setCount 修改数据。数据一变，页面自动更新！ */}
      <button onClick={() => setCount(count + 1)}>
        点我加1
      </button>
    </div>
  );
}
```
**黄金法则**：永远不要直接修改 state (比如 `count = 1` 是错的！)，必须调用专门的 set 函数 (`setCount(1)`)，这样 React 才知道数据变了，才会去更新页面。

### 4.2 `useEffect`：处理副作用 (Side Effects)

除了把数据变成 UI 渲染出来，组件有时候还需要干点“别的事”，比如：
*   组件刚加载时，去后台拉取数据。
*   手动修改浏览器的标题。
*   设置一个定时器。
这些与直接渲染无关的操作，叫“副作用”。

```tsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 这里的代码会在组件“渲染到屏幕上之后”执行
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // 返回一个清理函数（组件被销毁时执行）
    return () => clearInterval(interval);
  }, []); // <-- 注意这个空数组 []
  
  return <p>时间: {seconds} 秒</p>;
}
```
**关于 `useEffect` 的第二个参数（依赖数组）：**
*   `[]` (空数组)：只在组件第一次加载时执行一次。
*   `[name, age]`：当 `name` 或 `age` 发生变化时，才会再次执行。
*   不传：组件每次重新渲染都会执行（非常危险，容易死循环）。

---

## 5. 自定义 Hook (Custom Hooks)

这是 React 最强大的特性之一！
你可以把多个基础的 Hook（`useState`, `useEffect` 等）封装到一个你自己写的函数里，这个函数就叫**自定义 Hook**。

这有什么用呢？**复用逻辑！**
比如，我们刚刚写的 `useSubmitMessage` 就是一个自定义 Hook。它把“发送消息”、“处理流式响应”、“控制加载状态”这些复杂的**业务逻辑**全都打包在一起了。

这样，我们的 UI 组件（比如 `DebugPanel`）就会变得非常干净，它只需要关心长什么样，不需要关心背后怎么发请求：

```tsx
// UI 组件很干净
function ChatInput() {
  // 直接调用我们封装好的逻辑包
  const { submitMessage, isSubmitting } = useSubmitMessage();
  const [text, setText] = useState('');

  return (
    <button 
      onClick={() => submitMessage(text)} 
      disabled={isSubmitting}
    >
      发送
    </button>
  );
}
```

## 6. React 与 Zustand 的关系

我们在项目中大量使用了 `Zustand`。
*   `useState` 只能管理**当前这个小组件自己**的状态。如果别的组件也想用这个状态，会非常麻烦（要一层层传）。
*   `Zustand` (`useChatStore`) 就像是**一个全公司共享的公共大仓库**。任何组件（不管在哪个层级）都可以随时去这个大仓库里拿数据，或者修改数据。

## 总结

1.  **组件**就是普通的 JS 函数，负责把数据变成 JSX (HTML)。
2.  **`useState`** 让组件有了“记忆”（状态）。
3.  **`useEffect`** 让组件可以去干“网络请求、定时器”等杂活。
4.  **自定义 Hook** 让你把复杂的逻辑抽离出来，保持 UI 代码的清爽。
5.  数据变了，React 自动更新页面。你只管操作数据。
