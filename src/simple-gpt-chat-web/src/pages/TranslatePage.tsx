import './TranslatePage.css';

import { Button, Select } from 'antd';
import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { leftSiderElementAtom } from '../jotai-state';

const { Option } = Select;

const TranslatePage = () => {
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);
  const navigate = useNavigate();

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

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-white">
      <div className="max-w-7xl border md:rounded-md w-[90%]">
        <div className="h-12 border-b-[1px] bg-white shadow-lg">
          <div className="w-full h-full flex flex-col">
            <div className="h-12 border-b-[1px] bg-white max-w-7xl md:rounded-t-md flex items-center justify-between px-4">
              <Select defaultValue="auto" style={{ width: 120 }} disabled>
                <Option value="auto">自动检测</Option>
                <Option value="en">英语</Option>
                <Option value="zh">中文</Option>
                {/* 更多语言选项 */}
              </Select>
              <span>翻译成</span>
              <Select defaultValue="en" style={{ width: 120 }}>
                <Option value="英文">英语</Option>
                <Option value="中文">中文</Option>
                <Option value="日文">日语</Option>
                <Option value="韩文">韩语</Option>
                {/* 更多语言选项 */}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-between bg-white p-5 max-h-5xl">
          <textarea
            className="w-full md:w-[48%] h-48 p-2 text-base border border-gray-300 rounded-md resize-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            placeholder="在此输入要翻译的文本"
          ></textarea>
          <textarea
            className="w-full md:w-[48%] h-48 p-2 mt-4 md:mt-0 text-base bg-gray-100 border border-gray-300 rounded-md resize-none readonly focus:ring-0 focus:border-gray-300"
            placeholder="翻译后的文本将显示在这里"
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
