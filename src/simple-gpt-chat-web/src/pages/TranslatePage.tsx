import './TranslatePage.css';

import { useRequest } from 'ahooks';
import { Button, message, Select } from 'antd';
import { useSetAtom } from 'jotai';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { leftSiderElementAtom } from '../jotai-state';
import { myAxios } from '../my-axios';

const { Option } = Select;

const TranslatePage = () => {
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [translateResult, setTranslateResult] = useState('');
  const [translateFrom, setTranslateFrom] = useState('English');
  const [translateTo, setTranslateTo] = useState('简体中文');

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputLength = event.target.value.length;
    setCharCount(inputLength);
    setUserInput(event.target.value);
  };

  const callTranslate = (originContent: string, from: string, to: string) => {
    const param: FormData = new FormData();
    param.append('originContent', originContent);
    param.append('from', from);
    param.append('to', to);
    return myAxios.post<string>('/api/Translate/Translate', param, 'fromForm');
  };
  const callTranslateRequest = useRequest(callTranslate, {
    manual: true,
  });

  const translate = async () => {
    if (userInput.trim().length <= 0) {
      message.warning('请输入要翻译的内容!');
      return;
    }

    setTranslateResult('');
    const res = await callTranslateRequest.runAsync(
      userInput,
      translateFrom,
      translateTo,
    );
    if (res.status !== 200) {
      message.error('翻译失败');
    } else {
      setTranslateResult(res.data);
    }
  };

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
      <div
        className="max-w-7xl w-full md:w-[90%] h-full md:h-[60%] border md:rounded-lg overflow-auto border-[#dae1e8] flex flex-col"
        style={{ boxShadow: 'rgb(0 0 0 / 0.2) 0px 0px 20px' }}
      >
        <div className="h-12 border-b-[1px] bg-white flex-none">
          <div className="w-full h-full flex flex-col">
            <div className="h-12 border-b-[1px] bg-white max-w-7xl md:rounded-t-md flex items-center justify-between px-4">
              <Select
                defaultValue="English"
                style={{ width: 120 }}
                onChange={(v) => setTranslateFrom(v)}
              >
                <Option value="English">English</Option>
                <Option value="zh-Hans">简体中文</Option>
                <Option value="zh-Hant">繁體中文</Option>
                <Option value="Japanese">日语</Option>
                <Option value="Korean">韩语</Option>
                <Option value="French">法语</Option>
              </Select>
              <span>翻译成</span>
              <Select
                defaultValue={translateTo}
                style={{ width: 120 }}
                onChange={(v) => setTranslateTo(v)}
              >
                <Option value="zh-Hans">简体中文</Option>
                <Option value="zh-Hant">繁體中文</Option>
                <Option value="English">English</Option>
                <Option value="Japanese">日语</Option>
                <Option value="Korean">韩语</Option>
                <Option value="French">法语</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-between bg-white p-5 max-h-5xl grow">
          <div className="relative md:w-[45%] w-full h-[45%] md:h-full">
            <textarea
              className="w-full h-full p-2 text-base border border-gray-300 rounded-md resize-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="在此输入要翻译的文本"
              maxLength={1500}
              onChange={handleInputChange}
              disabled={callTranslateRequest.loading}
            ></textarea>
            <p className="absolute bottom-1 right-1 text-xs text-[#9ca3af]">
              {charCount}/1500
            </p>
          </div>
          <div className="flex justify-center items-center h-[10%] md:h-full md:w-[10%] w-full">
            <Button
              type="primary"
              onClick={translate}
              loading={callTranslateRequest.loading}
            >
              翻译
            </Button>
          </div>
          <textarea
            className="h-[45%] md:h-full w-full md:w-[45%] p-2 mt-0 text-base bg-gray-100 border border-gray-300 rounded-md resize-none readonly focus:ring-0 focus:border-gray-300"
            placeholder="翻译后的文本将显示在这里"
            readOnly
            value={translateResult}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
