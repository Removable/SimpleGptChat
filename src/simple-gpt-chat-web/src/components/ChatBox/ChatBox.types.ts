export interface ChatBoxProps {
  owner: ChatRole;
  content: string;
  timeStamp: number;
  failed?: boolean | undefined;
  onRetry?: (() => void) | undefined;
  isAudioMode?: boolean | undefined;
  readMessage: (message: string) => void;
  isReplying?: boolean | undefined;
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
