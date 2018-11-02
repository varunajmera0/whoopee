import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import LoadingReducer from './LoadingReducer';
import WhoopeeDataReducer from './WhoopeeDataReducer';
import RandomLoaderReducer from './RandomLoaderReducer';
import ModalReducer from './ModalReducer';
import UserCreatedReducer from './UserCreatedReducer';

export default combineReducers({
    AuthReducer,
    LoadingReducer,
    WhoopeeDataReducer,
    RandomLoaderReducer,
    ModalReducer,
    UserCreatedReducer
});