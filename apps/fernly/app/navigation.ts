import type { NavigatorScreenParams } from '@react-navigation/native';

export type PlantsStackParamList = {
  PlantsHome: undefined;
  PlantDetail: { plantId: string };
  PlantAdd: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: undefined;
};

export type RootTabParamList = {
  Today: undefined;
  Plants: NavigatorScreenParams<PlantsStackParamList> | undefined;
  Doctor: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
