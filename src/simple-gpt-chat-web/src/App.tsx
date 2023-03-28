import { OidcConfiguration, OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthChecker from './components/AuthChecker';
import ChatSignalRProvider from './hooks/ChatSignalR/chatSignalRProvider';
import ChatPage from './pages/ChatPage';
import CodePlayground from './pages/CodePlayground';
import Cookbook from './pages/Cookbook/Cookbook';
import GrammarPage from './pages/GrammarPage';
import ToolsIndex from './pages/ToolsIndex';
import TranslatePage from './pages/TranslatePage';
import Root from './Root';

const oidcConfig: OidcConfiguration = {
  authority: 'https://auth-sts.imguan.com',
  // eslint-disable-next-line camelcase
  client_id: 'simple-gpt-chat',
  // eslint-disable-next-line camelcase
  redirect_uri: window.location.origin + '/signin-oidc',
  // eslint-disable-next-line camelcase
  silent_redirect_uri: window.location.origin + '/silent-signin-oidc',
  scope: 'openid email profile simple-gpt-chat-scope roles',
  // eslint-disable-next-line camelcase
  refresh_time_before_tokens_expiration_in_second: 60,
};

function App() {
  return (
    <>
      <OidcProvider configuration={oidcConfig}>
        <BrowserRouter>
          <Routes>
            <Route path={'/'} element={<ToolsIndex />} />
            <Route element={<RootWithAuth />}>
              <Route path={'/chat'} element={<ChatPage />} />
              <Route path={'/translate'} element={<TranslatePage />} />
              <Route path={'/grammar'} element={<GrammarPage />} />
              <Route path={'/playground'} element={<CodePlayground />} />
            </Route>
            <Route path={'/cookbook'} element={<Cookbook />} />
          </Routes>
        </BrowserRouter>
      </OidcProvider>
    </>
  );
}

const RootWithAuth = () => {
  return (
    <AuthChecker>
      <OidcSecure>
        <ChatSignalRProvider>
          <Root />
        </ChatSignalRProvider>
      </OidcSecure>
    </AuthChecker>
  );
};

export default App;
