import { combineReducers } from "redux";
import settings from "./settings/Reducer";
import bot from "./bot/Reducer";

const Reducers = combineReducers({
  settings,
  bot
  // chatReducer,
  // contactReducer,
  // emailReducer,
  // notesReducer,
  // todoReducer,
  // maintodoReducer,
  // maincontactReducer
});

export default Reducers;
