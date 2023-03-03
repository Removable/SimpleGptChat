import { OidcConfiguration, OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthChecker from './components/AuthChecker';
import ChatSignalRProvider from './hooks/ChatSignalR/chatSignalRProvider';
import ChatPage from './pages/ChatPage';
import Root from './Root';

function App() {
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

  return (
    <>
      <OidcProvider configuration={oidcConfig}>
        <AuthChecker>
          <OidcSecure>
            <ChatSignalRProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<Root />}>
                    <Route path={'/'} element={<ChatPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ChatSignalRProvider>
          </OidcSecure>
        </AuthChecker>
      </OidcProvider>
    </>
  );
}

export default App;
