import './ToolCard.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ToolCard = (props: ToolCardProps) => {
  const navigate = useNavigate();

  const handleClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className={`tool-card select-none p-4 m-2.5 w-[240px] h-[150px] opacity-90 rounded-lg overflow-auto ${
        props.route ? 'cursor-pointer' : ''
      }`}
      style={{ backgroundColor: props.bgColor }}
      onClick={() => handleClick(props.route)}
    >
      <h3 className="text-white text-xl font-semibold mb-[8px]">{props.title}</h3>
      <p className="tool-card-description text-white">{props.description}</p>
    </div>
  );
};

export interface ToolCardProps {
  title: string;
  description: string;
  bgColor: string;
  route?: string;
}
