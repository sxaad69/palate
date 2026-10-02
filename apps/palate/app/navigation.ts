import type { NavigatorScreenParams } from '@react-navigation/native';
import type { LoggedMeal } from './store/app';

// A not-yet-logged meal, shown on DishDetail as a confirm-before-logging
// preview (used by the AI scan result).
export type DishPreview = Omit<LoggedMeal, 'id' | 'loggedDate'>;

export type TodayStackParamList = {
  TodayHome: undefined;
  DishDetail: { mealId: string } | { preview: DishPreview };
};

export type ScanStackParamList = {
  ScanHome: undefined;
};

export type ProgressStackParamList = {
  ProgressHome: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: undefined;
};

export type RootTabParamList = {
  Today: NavigatorScreenParams<TodayStackParamList> | undefined;
  Scan: undefined;
  Progress: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
