import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

//const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk];

const persistConfig = {
  key: 'root',
  storage: storage,

  //This will ensure any "new" keys added to the redux initial state
  //will not be overwritten by the persisted stuff found in storage
  stateReconciler: autoMergeLevel1,
  whitelist: ['session'],
  blacklist: ['sdk', 'connection'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Set trace = true to follow action calls more in depth inside Redux DevTools
const composeEnhancers = composeWithDevTools({ trace: false, traceLimit: 25 });

export const store = createStore(
  persistedReducer,
  process.env.NODE_ENV === 'development'
    ? composeEnhancers(applyMiddleware(...middleware))
    : applyMiddleware(...middleware)
);

export const persistor = persistStore(store);
