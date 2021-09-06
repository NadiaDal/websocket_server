export enum Action {
  CHANGES = 'CHANGES',
  INIT = 'INIT',
}

export interface ChangeMessage {
  team: string;
  action: Action.CHANGES;
  payload: string;
}

export interface InitMessage {
  team: string;
  action: Action.INIT;
  payload: string;
}

export type Message = InitMessage | ChangeMessage;
