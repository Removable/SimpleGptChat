import { Button, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { MinutesLeftSiderProps } from './MinutesLeftSider.types';

export const MinutesLeftSider = (props: MinutesLeftSiderProps) => {
  const navigate = useNavigate();
  const className =
    props.className === null || props.className === undefined ? '' : props.className;
  return (
    <div className={`text-center ${className}`} style={props.style}>
      <Space direction="vertical" size="middle" style={{ width: '90%' }}>
        <Button
          className="w-full"
          ghost
          type={'dashed'}
          onClick={() => {
            navigate('/');
          }}
        >
          回到 ChatGPT
        </Button>
      </Space>
    </div>
  );
};
