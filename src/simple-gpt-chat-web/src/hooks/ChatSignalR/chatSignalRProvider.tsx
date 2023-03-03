import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { createContext, ReactNode, useState } from 'react';

import { BaseUrl } from '../../my-axios';

interface chatSignalRProviderProps {
  children: ReactNode;
}

export const ChatGlobalContext = createContext<HubConnection>({} as any);

const ChatSignalRProvider = (props: chatSignalRProviderProps) => {
  const [chatHub] = useState(
    new HubConnectionBuilder()
      .withUrl(BaseUrl + '/hubs/chat', {
        accessTokenFactory: () => window.sessionStorage.getItem('accessToken') ?? '',
      })
      .withAutomaticReconnect()
      .build(),
  );
  return (
    <>
      <ChatGlobalContext.Provider value={chatHub}>
        {props.children}
      </ChatGlobalContext.Provider>
    </>
  );
};

export default ChatSignalRProvider;
