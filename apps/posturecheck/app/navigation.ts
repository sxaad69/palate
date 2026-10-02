export type MainTabParamList = {
  Home: undefined;
  Exercises: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Capture: undefined;
  Landmarks: { photoUri: string };
  Results: { checkId: string };
  Paywall: undefined;
};
