import { CloseOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useOidc, useOidcAccessToken } from '@axa-fr/react-oidc';
import { HubConnectionState } from '@microsoft/signalr';
import { useRequest } from 'ahooks';
import { Button, Drawer, Space } from 'antd';
import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useChatSignalR from './hooks/ChatSignalR/useChatSignalR';
import useWindowSize from './hooks/useWindowSize';
import { leftSiderElementAtom } from './jotai-state';

const Root = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const auth = useOidc();
  const oidcAccessToken = useOidcAccessToken();
  const { chatHub, chatHubStart } = useChatSignalR();
  const chatHubRequest = useRequest(chatHubStart, { manual: true });
  const [windowWidth] = useWindowSize();

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.sessionStorage.setItem('accessToken', oidcAccessToken.accessToken);
    }
    if (auth.isAuthenticated && chatHub.state === HubConnectionState.Disconnected) {
      chatHubRequest.run();
    }
  }, [auth.isAuthenticated, oidcAccessToken.accessToken, chatHub.state]);

  useEffect(() => {
    if (windowWidth >= 768) setDrawerOpen(false);
  }, [windowWidth]);

  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <header className="md:hidden border-b border-white/20 bg-gray-800 text-gray-200 w-full flex-none">
          <div className="h-[50px] flex items-center">
            <MenuUnfoldOutlined
              className="text-white cursor-pointer pl-4 flex-none"
              onClick={() => {
                setDrawerOpen(true);
              }}
            />
            <div className="grow"></div>
          </div>
        </header>
        <div className="grow w-full h-full flex flex-row">
          <aside className="md:w-[260px] h-screen md:block hidden bg-gray-900">
            <LeftSider />
            <Drawer
              width={320}
              placement={'left'}
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              headerStyle={{ display: 'none' }}
              style={{ backgroundColor: '#202123', color: 'white' }}
            >
              <LeftSider />
            </Drawer>
          </aside>
          <main id="main" className="overflow-hidden grow">
            {<Outlet />}
          </main>
        </div>
      </div>
      <Button
        icon={<CloseOutlined style={{ color: 'white' }} />}
        type={'text'}
        onClick={() => {
          setDrawerOpen(false);
        }}
        style={{
          display: drawerOpen ? 'block' : 'none',
          position: 'absolute',
          top: '10px',
          left: '330px',
          zIndex: 1001,
        }}
      />
    </>
  );
};

const LeftSider = () => {
  const leftSiderElement = useAtomValue(leftSiderElementAtom);
  return (
    <div className="dark md:fixed md:inset-y-0 md:w-[260px] text-center p-5">
      <Space direction="vertical" size="middle" className="w-full">
        {/* <Button*/}
        {/*  className="w-full"*/}
        {/*  ghost*/}
        {/*  type={'dashed'}*/}
        {/*  onClick={() => {*/}
        {/*    navigate('audio-to-minutes');*/}
        {/*  }}*/}
        {/* >*/}
        {/*  用录音生成会议纪要<span className="text-rose-500">*NEW</span>*/}
        {/* </Button>*/}
        <Button
          className="w-full"
          type="dashed"
          ghost
          onClick={() => {
            window.open('https://gitee.com/PlexPt/awesome-chatgpt-prompts-zh');
          }}
        >
          ChatGPT 中文调教指南
        </Button>
        {leftSiderElement}
      </Space>
    </div>
  );
};

export default Root;
