import './GrammarPage.css';

import { useRequest } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent } from 'antd';
import * as diff from 'diff';
import { useSetAtom } from 'jotai';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { leftSiderElementAtom } from '../../jotai-state';
import { myAxios } from '../../my-axios';

export const GrammarPage = () => {
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);
  const [charCount, setCharCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [improveResult, setImproveResult] = useState<JSX.Element[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('standard');

  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedStyle(e.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputLength = event.target.value.length;
    setCharCount(inputLength);
    setUserInput(event.target.value);
  };

  const callImprove = (originContent: string, style: string) => {
    const param: FormData = new FormData();
    param.append('originContent', originContent);
    param.append('improveStyle', style);
    return myAxios.post<string>('/api/Grammar/Improve', param, 'fromForm');
  };
  const callImproveRequest = useRequest(callImprove, {
    manual: true,
  });

  const improve = async () => {
    if (userInput.trim().length <= 0) {
      message.warning('请输入内容!');
      return;
    }

    setImproveResult([]);
    const res = await callImproveRequest.runAsync(userInput, selectedStyle);
    if (res.status !== 200) {
      message.error('优化失败');
    } else {
      const changes = diff.diffWords(userInput, res.data);
      console.log(changes);
      const result = changes.map((change, idx) => {
        if (change.added) {
          return (
            <span key={idx} className="text-green-500 underline">
              {change.value}
            </span>
          );
        }
        if (change.removed) {
          return <></>;
        }
        return <span key={idx}>{change.value}</span>;
      });

      setImproveResult(result);
    }
  };

  const leftSiderButtons = [<div key={'0'}></div>];

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
            <div className="h-12 border-b-[1px] bg-white max-w-7xl md:rounded-t-md flex items-center justify-center px-4">
              <Radio.Group
                defaultValue={selectedStyle}
                buttonStyle="solid"
                onChange={onRadioChange}
              >
                <Radio.Button value="standard">标准</Radio.Button>
                <Radio.Button value="fluent">流畅</Radio.Button>
                <Radio.Button value="formal">正式</Radio.Button>
                <Radio.Button value="simple">简洁</Radio.Button>
                <Radio.Button value="creative">创造力</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-between bg-white p-5 max-h-5xl grow">
          <div className="relative md:w-[45%] w-full h-[45%] md:h-full">
            <textarea
              className="w-full h-full p-2 text-base border border-gray-300 rounded-md resize-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="Input your text here..."
              maxLength={1500}
              onChange={handleInputChange}
              disabled={callImproveRequest.loading}
            ></textarea>
            <p className="absolute bottom-1 right-1 text-xs text-[#9ca3af]">
              {charCount}/1500
            </p>
          </div>
          <div className="flex justify-center items-center h-[10%] md:h-full md:w-[10%] w-full">
            <Button type="primary" onClick={improve} loading={callImproveRequest.loading}>
              检查
            </Button>
          </div>
          <div className="h-[45%] md:h-full w-full md:w-[45%] p-2 mt-0 border border-gray-300 rounded-md">
            {improveResult}
          </div>
        </div>
      </div>
    </div>
  );
};
