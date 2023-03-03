export interface ChatBoxProps {
  owner: ChatRole;
  content: string;
  timeStamp: number;
  failed?: boolean | undefined;
  onRetry?: (() => void) | undefined;
}

export enum ChatRole {
  User,
  Bot,
  System,
}

export interface ChatInfo {
  Message: string;
  Role: ChatRole;
  Timestamp: number;
  Failed?: boolean;
  Streaming?: boolean;
}

export interface SendMsgArg {
  ChatInfos: ChatInfo[];
}
