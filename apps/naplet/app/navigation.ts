import type { NavigatorScreenParams } from '@react-navigation/native';

export type LogStackParamList = {
  LogHome: undefined;
  FeedEditor: undefined;
  DiaperEditor: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: undefined;
};

export type RootTabParamList = {
  Today: undefined;
  Log: NavigatorScreenParams<LogStackParamList> | undefined;
  Stats: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
