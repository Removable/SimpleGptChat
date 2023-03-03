import { OidcUserStatus, useOidc, useOidcUser } from '@axa-fr/react-oidc';
import { Loading } from '@axa-fr/react-oidc/dist/core/default-component';
import { OidcUserInfo } from '@axa-fr/react-oidc/dist/vanilla/vanillaOidc';
import React, { Fragment, ReactNode } from 'react';

import LoginPage from '../pages/LoginPage';

const AuthChecker = (props: AuthCheckerProps) => {
  const auth = useOidc();
  const oidcUser = useOidcUser<IdentityUserInfo>();

  if (!auth.isAuthenticated) return <LoginPage />;
  else if (oidcUser.oidcUserLoadingState !== OidcUserStatus.Loaded) return <Loading />;
  else return <Fragment>{props.children}</Fragment>;
};

export default AuthChecker;

interface AuthCheckerProps {
  children: ReactNode;
}

type User = {
  Username: string;
  Avatar: string;
  Nickname: string;
  Email: string;
  IsReconnecting: boolean;
  Points: number;
  IsBot: boolean;
};

interface IdentityUserInfo extends OidcUserInfo {
  avatar: string;
}

export type { IdentityUserInfo, User };
