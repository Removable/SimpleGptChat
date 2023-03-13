import { Button } from 'antd';
import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useNavigate } from 'react-router-dom';

import { leftSiderElementAtom } from '../jotai-state';

const TalkWithAI = () => {
  const navigate = useNavigate();
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: {
      type: 'audio/mp3',
    },
    onStop: (blobUrl, blob) => {
      console.log(blob);
    },
  });

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
    <div>
      {/* <Button type="primary" onClick={test}>*/}
      {/*  测试*/}
      {/* </Button>*/}
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio src={mediaBlobUrl} controls autoPlay={false} loop />
    </div>
  );
};

export default TalkWithAI;
