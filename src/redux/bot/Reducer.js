import {
  BOT_LMENU_CLICK_NONE,
  BOT_LMENU_CLICK_OPTIMIZE,
  BOT_LMENU_CLICK_CLEAR,
  BOT_LMENU_CLICK_DOWNLOAD,
  BOT_LMENU_CLICK_DOWNLOAD_JPEG,
  BOT_LMENU_CLICK_PRINT,
  BOT_LMENU_CLICK_SHOW_OPTIMIZED_BLANK,
  BOT_LMENU_CLICK_SHOW_ALL,
  BOT_LMENU_CLICK_HIDE_CONSTRAINTS,
  BOT_LMENU_CLICK_SHOW_CONSTRAINTS,
  BOT_LMENU_CLICK_REMOVE_CONSTRAINTS,

  BOT_LMENU_STATE,
  BOT_LMENU_STATE_OPTIMIZE,
  BOT_LMENU_STATE_CLEAR,
  BOT_LMENU_STATE_DOWNLOAD,
  BOT_LMENU_STATE_DOWNLOAD_JPEG,
  BOT_LMENU_STATE_PRINT,
  BOT_LMENU_STATE_SHOW_OPTIMIZED_BLANK,
  BOT_LMENU_STATE_SHOW_ALL,
  BOT_LMENU_STATE_HIDE_CONSTRAINTS,
  BOT_LMENU_STATE_SHOW_CONSTRAINTS,
  BOT_LMENU_STATE_REMOVE_CONSTRAINTS
} from "../constants/";

const INIT_STATE = {
  lmenuClick: BOT_LMENU_CLICK_NONE,

  lmenuItemStateOptimize: false,
  lmenuItemStateClear: false,
  lmenuItemStateDownload: false,
  lmenuItemStateDownloadJPEG: false,
  lmenuItemStatePrint: false,
  lmenuItemStateShowOptimizedBlank: false,
  lmenuItemStateShowAll: false,
  lmenuItemStateHideConstraints: false,
  lmenuItemStateShowConstraints: false,
  lmenuItemStateRemoveConstraints: false,
};

const BOTReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case BOT_LMENU_CLICK_NONE:
    case BOT_LMENU_CLICK_OPTIMIZE:
    case BOT_LMENU_CLICK_CLEAR:
    case BOT_LMENU_CLICK_DOWNLOAD:
    case BOT_LMENU_CLICK_DOWNLOAD_JPEG:
    case BOT_LMENU_CLICK_PRINT:
    case BOT_LMENU_CLICK_SHOW_OPTIMIZED_BLANK:
    case BOT_LMENU_CLICK_SHOW_ALL:
    case BOT_LMENU_CLICK_HIDE_CONSTRAINTS:
    case BOT_LMENU_CLICK_SHOW_CONSTRAINTS:
    case BOT_LMENU_CLICK_REMOVE_CONSTRAINTS:
      return {
        ...state,
        lmenuClick: action.type,
      };
    case BOT_LMENU_STATE:
      return {
        ...state,
        lmenuItemState: action.payload,
      }; 
    case BOT_LMENU_STATE_OPTIMIZE:
      return {
        ...state,
        lmenuItemStateOptimize: action.payload,
      }; 
    case BOT_LMENU_STATE_CLEAR:
      return {
        ...state,
        lmenuItemStateClear: action.payload,
      }; 
    case BOT_LMENU_STATE_DOWNLOAD:
      return {
        ...state,
        lmenuItemStateDownload: action.payload,
      }; 
    case BOT_LMENU_STATE_DOWNLOAD_JPEG:
      return {
        ...state,
        lmenuItemStateDownloadJPEG: action.payload,
      }; 
    case BOT_LMENU_STATE_PRINT:
      return {
        ...state,
        lmenuItemStatePrint: action.payload,
      }; 
    case BOT_LMENU_STATE_SHOW_OPTIMIZED_BLANK:
      return {
        ...state,
        lmenuItemStateShowOptimizedBlank: action.payload,
      }; 
    case BOT_LMENU_STATE_SHOW_ALL:
      return {
        ...state,
        lmenuItemStateShowAll: action.payload,
      }; 
    case BOT_LMENU_STATE_HIDE_CONSTRAINTS:
      return {
        ...state,
        lmenuItemStateHideConstraints: action.payload,
      }; 
    case BOT_LMENU_STATE_SHOW_CONSTRAINTS:
      return {
        ...state,
        lmenuItemStateShowConstraints: action.payload,
      }; 
    case BOT_LMENU_STATE_REMOVE_CONSTRAINTS:
      return {
        ...state,
        lmenuItemStateRemoveConstraints: action.payload,
      }; 
    default:
      return state;
  }
};

export default BOTReducer;
