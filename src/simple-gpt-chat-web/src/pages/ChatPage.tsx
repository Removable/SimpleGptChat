import {
  AudioOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useLocalStorageState, useRequest, useTitle, useToggle } from 'ahooks';
import { Button, message, Modal, Spin } from 'antd';
import { useSetAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

import ChatBox from '../components/ChatBox';
import { ChatInfo, ChatRole, SendMsgArg } from '../components/ChatBox/ChatBox.types';
import useChatSignalR from '../hooks/ChatSignalR/useChatSignalR';
import { leftSiderElementAtom } from '../jotai-state';
import { myAxios } from '../my-axios';

const defaultChatInfos: ChatInfo[] = [];

const ChatPage = () => {
  useTitle('简易版ChatGPT');
  const [useAudio, setUseAudio] = useToggle(false);
  const [thinking, setThinking] = useState(false);
  const { chatHub } = useChatSignalR();
  const [inputMsg, setInputMsg] = useState('');
  const [storedChatInfos, setStoredChatInfos] = useLocalStorageState('storedChatInfos', {
    defaultValue: defaultChatInfos,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setLeftSiderElement = useSetAtom(leftSiderElementAtom);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, style } = event.target;
    style.height = 'inherit';
    style.height = `${event.target.scrollHeight}px`;
    setInputMsg(value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { ctrlKey, key } = event;
    if (ctrlKey && key === 'Enter') {
      event.preventDefault();
      await sendMsg();
    }
  };

  const commonSendFunc = async (newChatInfo: ChatInfo, existChatInfos: ChatInfo[]) => {
    setThinking(true);
    let tempStoredChatInfos = [...existChatInfos, newChatInfo];
    const arg: SendMsgArg = {
      ChatInfos: tempStoredChatInfos.slice(-6),
    };

    const emptyBotReply: ChatInfo = {
      Message: '',
      Role: ChatRole.Bot,
      Timestamp: 0,
      Streaming: true,
    };
    setStoredChatInfos([...tempStoredChatInfos, emptyBotReply]);
    if (scrollRef !== null && scrollRef.current !== null) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    const res = await callSendMsgRequest.runAsync(arg);
    if (res.status !== 200) {
      newChatInfo.Failed = true;
      tempStoredChatInfos = [...existChatInfos, newChatInfo];
      setStoredChatInfos(tempStoredChatInfos);
    }
  };

  const sendMsg = async () => {
    if (inputMsg.trim() === '') {
      message.warning('请输入有效内容');
      return;
    }

    setInputMsg('');
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = '24px';
    }
    const newChatInfo: ChatInfo = {
      Message: inputMsg.trim(),
      Role: ChatRole.User,
      Timestamp: Date.now(),
    };
    const tempStoredChatInfos = [...storedChatInfos, newChatInfo];
    setStoredChatInfos(tempStoredChatInfos);
    await commonSendFunc(newChatInfo, storedChatInfos);
  };

  const reSendMsg = async () => {
    const lastChat = storedChatInfos[storedChatInfos.length - 1];
    if (lastChat.Failed) {
      const tempStoredChatInfos = [...storedChatInfos];
      lastChat.Failed = false;
      setStoredChatInfos(tempStoredChatInfos);
      await commonSendFunc(
        lastChat,
        tempStoredChatInfos.slice(0, tempStoredChatInfos.length - 1),
      );
    }
  };

  const callSendMsg = (param: SendMsgArg) =>
    myAxios.post('/api/Chat/SendMessage', param, 'fromBody');
  const callSendMsgRequest = useRequest(callSendMsg, {
    manual: true,
    debounceWait: 300,
    loadingDelay: 100,
  });

  const clearChatHistory = () => {
    setStoredChatInfos(defaultChatInfos);
  };

  const tip = (
    <div className="font-bold w-full h-full flex justify-center items-center">
      <span className="text-center">
        不知道如何更好地使用ChatGPT？查看☞
        <a
          target="_blank"
          href="https://gitee.com/PlexPt/awesome-chatgpt-prompts-zh"
          className="text-[#53b4ef]"
          rel="noreferrer"
        >
          ChatGPT 中文调教指南
        </a>
      </span>
    </div>
  );

  const streamReceiveMsg = (msg: string, timestamp: number, streaming: string) => {
    if (streaming === '2') {
      setThinking(false);
    } else {
      const tempStoredChatInfos = [...storedChatInfos];
      const lastChat = tempStoredChatInfos[storedChatInfos.length - 1];
      if (!lastChat) return;
      if (lastChat && lastChat.Timestamp === timestamp) {
        lastChat.Message += msg;
        if (streaming === '0') {
          lastChat.Streaming = false;
        }
      } else {
        lastChat.Message = msg;
        lastChat.Streaming = true;
        lastChat.Role = ChatRole.Bot;
        lastChat.Timestamp = timestamp;
      }
      setStoredChatInfos(tempStoredChatInfos);
      if (scrollRef !== null && scrollRef.current !== null) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  };

  const leftSiderButtons = [
    <Button
      key={0}
      className="w-full"
      type="dashed"
      ghost
      onClick={() => {
        window.open('https://gitee.com/PlexPt/awesome-chatgpt-prompts-zh');
      }}
    >
      ChatGPT 中文调教指南
    </Button>,
    <Button
      key={1}
      className="w-full"
      ghost
      type={'default'}
      onClick={() => {
        setUseAudio.toggle();
      }}
    >
      切换文字/语音模式<span className="text-rose-500">*NEW</span>
    </Button>,
    <Button
      key={2}
      className="w-full"
      type="default"
      ghost
      onClick={() => {
        Modal.confirm({
          title: '清空聊天记录',
          content: '确定要清空聊天记录吗？',
          okText: '确定',
          cancelText: '取消',
          centered: true,
          okButtonProps: {
            danger: true,
          },
          onOk: () => {
            clearChatHistory();
          },
        });
      }}
    >
      清空聊天记录
    </Button>,
  ];

  useEffect(() => {
    if (chatHub.state === 'Connected') {
      chatHub.on('StreamChatMsg', (msg: string, timestamp: number, streaming: string) => {
        streamReceiveMsg(msg, timestamp, streaming);
      });
    }

    return () => {
      if (chatHub.state === 'Connected') {
        chatHub.off('StreamChatMsg');
      }
    };
  }, [chatHub.state, storedChatInfos]);

  useEffect(() => {
    setLeftSiderElement(leftSiderButtons);
    return () => {
      setLeftSiderElement([]);
    };
  }, []);

  return (
    <div className={'w-full overflow-auto h-[calc(100vh-100px)]'} ref={scrollRef}>
      <div>
        {storedChatInfos.length === 0 ? tip : <></>}
        {storedChatInfos.map((chatInfo) => {
          return (
            <ChatBox
              key={chatInfo.Timestamp}
              owner={chatInfo.Role}
              content={chatInfo.Message}
              timeStamp={chatInfo.Timestamp}
              onRetry={reSendMsg}
              failed={chatInfo.Failed}
            />
          );
        })}
        <div className="h-[100px]" />
        <div style={{ display: `${thinking ? '' : 'none'}` }}>
          <Spin tip={'ChatGPT思考中...'}>
            <div className="h-[70px] w-full" />
          </Spin>
        </div>
        <div className="fixed bottom-0 left-0 w-full border-t md:pl-[260px] md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
          {useAudio ? (
            <AudioRecorder
              storedChatInfos={() => {
                return storedChatInfos;
              }}
              setStoredChatInfos={(infos: ChatInfo[]) => {
                setStoredChatInfos(infos);
              }}
              commonSendFunc={commonSendFunc}
            />
          ) : (
            <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
              <div className="relative flex h-full flex-1 md:flex-col">
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    value={inputMsg}
                    disabled={callSendMsgRequest.loading}
                    tabIndex={0}
                    rows={1}
                    wrap={'soft'}
                    onInput={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={'按Enter换行，按Ctrl+Enter发送'}
                    className="overflow-auto max-h-[200px] m-0 w-full resize-none border-0 focus:outline-none bg-transparent p-0 pl-2 pr-[2.6rem] focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
                    ref={textareaRef}
                  ></textarea>
                  <div className="absolute p-1 bottom-0 right-1 md:bottom-1 md:right-2">
                    <Button
                      icon={<SendOutlined />}
                      type={'text'}
                      onClick={sendMsg}
                      loading={callSendMsgRequest.loading}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const AudioRecorder = (props: AudioRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: {
      type: 'audio/mp3',
    },
    onStop: (blobUrl, blob) => {
      console.log(blob);
      setAudioBlob(blob);
    },
  });
  const [recordedTime, setRecordedTime] = useState(0);
  const [clear, setClear] = useState<number>(0);

  const start = () => {
    setRecordedTime(0);
    startRecording();
    const c = window.setInterval(() => {
      setRecordedTime((recordedTime) => recordedTime + 10);
    }, 10);
    setClear(c);
  };

  const stop = () => {
    stopRecording();
    if (clear) window.clearInterval(clear);
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setRecordedTime(0);
  };

  const send = async () => {
    if (!audioBlob) {
      message.error('尚未录音！');
      return;
    }

    setLoading(true);

    const res = await myAxios.post<string>(
      '/api/Chat/SendAudio',
      { file: audioBlob },
      'fromForm',
    );
    const newChatInfo: ChatInfo = {
      Message: res.data.trim(),
      Role: ChatRole.User,
      Timestamp: Date.now(),
    };
    let storedChatInfos = props.storedChatInfos();

    const tempStoredChatInfos = [...storedChatInfos, newChatInfo];
    props.setStoredChatInfos(tempStoredChatInfos);
    await props.commonSendFunc(newChatInfo, storedChatInfos);
    setLoading(false);
    setAudioBlob(null);

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();

    storedChatInfos = props.storedChatInfos();
    const lastChat = storedChatInfos[storedChatInfos.length - 1];

    utterance.text = lastChat?.Message ?? '';
    utterance.lang = 'en-US';
    utterance.volume = 5;
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  };

  return (
    <>
      <div className="stretch items-center justify-center mx-2 flex flex-row gap-3 md:h-[98px] h-[50px]">
        {/* <audio*/}
        {/*  className="w-[250px] h-[40px]"*/}
        {/*  src={mediaBlobUrl}*/}
        {/*  controls*/}
        {/*  autoPlay={false}*/}
        {/* />*/}
        {status === 'recording' ? (
          <Button
            type="default"
            shape="circle"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={stop}
          />
        ) : (
          <Button
            type="default"
            shape="circle"
            size="large"
            icon={<AudioOutlined />}
            disabled={loading}
            onClick={start}
          />
        )}
        <span className="w-[50px] text-center">{`${(recordedTime / 1000).toFixed(
          2,
        )} s`}</span>
        <Button
          type="default"
          size="large"
          shape="circle"
          disabled={!audioBlob || loading}
          icon={<DeleteOutlined />}
          onClick={clearAudio}
        />
        <div className="pl-[40px]">
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={<SendOutlined />}
            loading={loading}
            onClick={send}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;

interface AudioRecorderProps {
  storedChatInfos: () => ChatInfo[];
  setStoredChatInfos: (value: ChatInfo[]) => void;
  commonSendFunc: (newChatInfo: ChatInfo, storedChatInfos: ChatInfo[]) => Promise<void>;
}
