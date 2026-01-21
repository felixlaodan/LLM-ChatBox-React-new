// src/types/index.ts

export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  // 预留字段：思考过程（用于 DeepSeek R1 等推理模型）
  reasoning_content?: string; 
  // 预留字段：是否正在加载/生成中
  loading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  apiKey: string;
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  stream: boolean;
}

// 默认设置常量
export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  model: 'deepseek-ai/DeepSeek-R1', // 默认模型，可根据需求修改
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2000,
  stream: true,
};