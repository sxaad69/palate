export type RootTabParamList = {
  Wardrobe: undefined;
  Outfits: undefined;
  Planner: undefined;
  Suggest: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Paywall: undefined;
  AddPiece: undefined;
  CreateOutfit: { suggestionBaseIds?: string[]; suggestionHijabId?: string } | undefined;
  AssignDay: { date: string };
  Insights: undefined;
};
