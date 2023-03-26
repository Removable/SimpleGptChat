import React from 'react';

import ToolCard from '../components/ToolCard';
import { ToolCardProps } from '../components/ToolCard/ToolCard';

const tools: ToolCardProps[] = [
  {
    title: '随便聊聊',
    description: '对ChatGPT官网的拙劣模仿',
    bgColor: '#149f83',
    route: '/chat',
  },
  {
    title: '翻译',
    description: '让AI充当翻译官，更适合大段文字的翻译',
    bgColor: '#5287ff',
    route: '/translate',
  },
  {
    title: '语法辅导',
    description: '来自美国的AI帮你纠正英文语法错误',
    bgColor: '#fc8475',
    route: '/grammar',
  },
  {
    title: '代码运行器',
    description: 'Code Playground',
    bgColor: '#f8bb35',
    route: '/playground',
  },
  {
    title: '菜谱推荐',
    description: '随机或根据已有食材推荐',
    bgColor: '#44c416',
    route: '/cookbook',
  },
  {
    title: '开发中...',
    description: '欢迎提供你的创意~',
    bgColor: '#3c24b3',
  },
];

const ToolsIndex = () => {
  return (
    <div className="flex flex-wrap justify-center m-auto">
      {tools.map((tool, idx) => (
        <ToolCard key={idx} {...tools[idx]} />
      ))}
    </div>
  );
};

export default ToolsIndex;
