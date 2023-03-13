import { Button } from 'antd';
import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { leftSiderElementAtom } from '../jotai-state';

const TalkWithAI = () => {
  const navigate = useNavigate();
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);

  const leftSiderButtons = [
    <Button
      key={0}
      className="w-full"
      type="default"
      ghost
      onClick={() => {
        navigate('/');
      }}
    >
      返回
    </Button>,
  ];

  useEffect(() => {
    setLeftSiderElement(leftSiderButtons);
    return () => {
      setLeftSiderElement([]);
    };
  }, []);

  return <div>123</div>;
};

export default TalkWithAI;
