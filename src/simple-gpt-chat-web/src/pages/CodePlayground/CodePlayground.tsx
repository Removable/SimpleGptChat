import './CodePlayground.css';

import { useRequest } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent } from 'antd';
import { useSetAtom } from 'jotai';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { leftSiderElementAtom } from '../../jotai-state';
import { myAxios } from '../../my-axios';

export const CodePlayground = () => {
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);
  const [charCount, setCharCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [playResult, setPlayResult] = useState<JSX.Element>(<></>);
  const [selectedStyle, setSelectedStyle] = useState('Javascript');

  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedStyle(e.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputLength = event.target.value.length;
    setCharCount(inputLength);
    setUserInput(event.target.value);
  };

  const callPlay = (originContent: string, lang: string) => {
    const param: FormData = new FormData();
    param.append('code', originContent);
    param.append('language', lang);
    return myAxios.post<string>('/api/CodePlayground/Play', param, 'fromForm');
  };
  const callPlayRequest = useRequest(callPlay, {
    manual: true,
  });

  const play = async () => {
    if (userInput.trim().length <= 0) {
      message.warning('请输入内容!');
      return;
    }

    setPlayResult(<></>);
    const res = await callPlayRequest.runAsync(userInput, selectedStyle);
    if (res.status !== 200) {
      message.error('优化失败');
    } else {
      setPlayResult(<code>{res.data}</code>);
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
                <Radio.Button value="Javascript">Javascript</Radio.Button>
                <Radio.Button value="C#">C#</Radio.Button>
                <Radio.Button value="Python">Python</Radio.Button>
                <Radio.Button value="PHP">PHP</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-between bg-white p-5 max-h-5xl grow">
          <div className="relative md:w-[45%] w-full h-[45%] md:h-full">
            <textarea
              className="w-full h-full p-2 text-base border border-gray-300 rounded-md resize-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="Input your code here..."
              maxLength={1500}
              onChange={handleInputChange}
              disabled={callPlayRequest.loading}
            ></textarea>
            <p className="absolute bottom-1 right-1 text-xs text-[#9ca3af]">
              {charCount}/1500
            </p>
          </div>
          <div className="flex justify-center items-center h-[10%] md:h-full md:w-[10%] w-full">
            <Button type="primary" onClick={play} loading={callPlayRequest.loading}>
              运行
            </Button>
          </div>
          <div className="h-[45%] md:h-full w-full md:w-[45%] p-2 mt-0 border border-gray-300 rounded-md">
            {playResult}
          </div>
        </div>
      </div>
    </div>
  );
};
