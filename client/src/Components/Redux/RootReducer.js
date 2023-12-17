import { combineReducers } from '@reduxjs/toolkit';
import MenuObjectReducer from './MenuObject';
import RouterObjectReducer from './RouterObject';
import UserObjectReducer from './UserObject';

const RootReducer = combineReducers({
  objectMenus: MenuObjectReducer,
  objectRouters: RouterObjectReducer,
  objectUser: UserObjectReducer,
});

export default RootReducer;