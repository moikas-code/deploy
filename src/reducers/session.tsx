import {IRaribleSdk} from '@rarible/sdk/build/domain';
import types from '../actions/types';

const {
  SET_COLOR_MODE,
  COLLAPSED_TOGGLE,
  SET_PLUGINS,
  SET_CURRENT_PLUGIN,
  SET_CURRENT_TAB,
  SET_CURRENT_STATE,
  ADD_NOTIFICATIONS,
  REMOVE_NOTIFICATIONS,
  SET_SETTING,
  RESET,
} = types;

export interface sessionState {
  address: string;
  sdk: any;
  walletAddress: any;
  connection: any;
  tab: string;
  portal_continuation: string;
}

const INITIAL_STATE: sessionState = {
  address: '',
  walletAddress: null,
  sdk: null,
  connection: null,
  tab: 'explore',
  portal_continuation: '',
  showOptions: false,
  blockchain: null,
};
export {INITIAL_STATE};

export default function session(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'SET_SDK':
      return {...state, ...action.payload};
    case 'SET_TAB':
      return {...state, tab: action.payload};
    case 'SET_PORTAL_CONTINUATION':
      return {...state, portal_continuation: action.payload};
    case 'SET_SHOW_OPTIONS':
      return {...state, showOptions: action.payload};
    default:
      return state;
  }
}
