import type { NavigatorScreenParams } from '@react-navigation/native';

export type RecipesStackParamList = {
  RecipesHome: undefined;
  RecipeEditor: { recipeId?: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: undefined;
};

export type RootTabParamList = {
  Today: undefined;
  Recipes: NavigatorScreenParams<RecipesStackParamList> | undefined;
  Progress: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
