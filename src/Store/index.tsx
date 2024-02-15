// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const rootReducer = combineReducers({
    Auth: authSlice,
});

export default rootReducer;
