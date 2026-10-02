import type { NavigatorScreenParams } from '@react-navigation/native';

export type TimerStackParamList = {
  TimerHome: undefined;
};

export type PresetsStackParamList = {
  PresetsHome: undefined;
};

export type HistoryStackParamList = {
  HistoryHome: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: undefined;
};

export type RootTabParamList = {
  Timer: NavigatorScreenParams<TimerStackParamList> | undefined;
  Presets: undefined;
  History: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
