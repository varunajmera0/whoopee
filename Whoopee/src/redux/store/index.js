import {createStore, applyMiddleware, compose} from 'redux';
import reducer from '../reducers';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {loginCheck} from '../middleware/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk, loginCheck)));
export const persistor = persistStore(store);
