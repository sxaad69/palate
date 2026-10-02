import type { Session } from './data/sessions';

export type RootTabParamList = {
  Library: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type PlayerParams = { session: Session };
