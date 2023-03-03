import { HubConnectionState } from '@microsoft/signalr';
import { useContext, useState } from 'react';

import { ChatGlobalContext } from './chatSignalRProvider';

const useChatSignalR = () => {
  const chatHubContext = useContext(ChatGlobalContext);
  const [chatHub] = useState(chatHubContext);
  const chatHubStart = async () => {
    if (
      chatHub.state !== HubConnectionState.Connected &&
      chatHub.state !== HubConnectionState.Connecting
    )
      await chatHub.start().catch((err) => console.log(err));
  };
  const chatHubStop = async () => {
    if (
      chatHub.state !== HubConnectionState.Disconnecting &&
      chatHub.state !== HubConnectionState.Disconnected
    )
      await chatHub.stop().catch((err) => console.log(err));
  };

  return { chatHub: chatHub, chatHubStart: chatHubStart, chatHubStop: chatHubStop };
};

export default useChatSignalR;
