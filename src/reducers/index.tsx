import { combineReducers } from 'redux';

import session from './session';
import errors from './errors';

//TODO Import plugin reducers

const rootReducer = combineReducers({
  errors,
  session,
});

export default rootReducer;
