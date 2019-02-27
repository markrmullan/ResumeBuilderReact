import { Store as ReduxStore, applyMiddleware, compose, createStore } from 'redux';

import { middlewares } from 'middleware/redux';

const composeEnhancers = DEVELOPMENT && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const appliedMiddlewares = applyMiddleware(...middlewares);
const composedEnhancers = composeEnhancers(appliedMiddlewares);

export const sharedStore: ReduxStore = createStore(_ => {
  return {};
}, composedEnhancers);
