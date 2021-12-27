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
} from '../constants/';

export const lmenuClickNone = (payload) => {
    return {
        type: BOT_LMENU_CLICK_NONE,
        payload
    }
}

export const lmenuClickOptimize = (payload) => {
    return {
        type: BOT_LMENU_CLICK_OPTIMIZE,
        payload
    }
}

export const lmenuClickClear = (payload) => {
    return {
        type: BOT_LMENU_CLICK_CLEAR,
        payload
    }
}

export const lmenuClickDownload = (payload) => {
    return {
        type: BOT_LMENU_CLICK_DOWNLOAD,
        payload
    }
}

export const lmenuClickDownloadJPEG = (payload) => {
    return {
        type: BOT_LMENU_CLICK_DOWNLOAD_JPEG,
        payload
    }
}

export const lmenuClickPrint = (payload) => {
    return {
        type: BOT_LMENU_CLICK_PRINT,
        payload
    }
}

export const lmenuClickShowOptimizedBlank = (payload) => {
    return {
        type: BOT_LMENU_CLICK_SHOW_OPTIMIZED_BLANK,
        payload
    }
}

export const lmenuClickShowAll = (payload) => {
    return {
        type: BOT_LMENU_CLICK_SHOW_ALL,
        payload
    }
}

export const lmenuClickHideConstraints = (payload) => {
    return {
        type: BOT_LMENU_CLICK_HIDE_CONSTRAINTS,
        payload
    }
}

export const lmenuClickShowConstraints = (payload) => {
    return {
        type: BOT_LMENU_CLICK_SHOW_CONSTRAINTS,
        payload
    }
}

export const lmenuClickRemoveConstraints = (payload) => {
    return {
        type: BOT_LMENU_CLICK_REMOVE_CONSTRAINTS,
        payload
    }
}

export const lmenuStateOptimize = (payload) => {
    return {
        type: BOT_LMENU_STATE_OPTIMIZE,
        payload
    }
}

export const lmenuStateClear = (payload) => {
    return {
        type: BOT_LMENU_STATE_CLEAR,
        payload
    }
}

export const lmenuStateDownload = (payload) => {
    return {
        type: BOT_LMENU_STATE_DOWNLOAD,
        payload
    }
}

export const lmenuStateDownloadJPEG = (payload) => {
    return {
        type: BOT_LMENU_STATE_DOWNLOAD_JPEG,
        payload
    }
}

export const lmenuStatePrint = (payload) => {
    return {
        type: BOT_LMENU_STATE_PRINT,
        payload
    }
}

export const lmenuStateShowOptimizedBlank = (payload) => {
    return {
        type: BOT_LMENU_STATE_SHOW_OPTIMIZED_BLANK,
        payload
    }
}

export const lmenuStateShowAll = (payload) => {
    return {
        type: BOT_LMENU_STATE_SHOW_ALL,
        payload
    }
}

export const lmenuStateHideConstraints = (payload) => {
    return {
        type: BOT_LMENU_STATE_HIDE_CONSTRAINTS,
        payload
    }
}

export const lmenuStateShowConstraints = (payload) => {
    return {
        type: BOT_LMENU_STATE_SHOW_CONSTRAINTS,
        payload
    }
}

export const lmenuStateRemoveConstraints = (payload) => {
    return {
        type: BOT_LMENU_STATE_REMOVE_CONSTRAINTS,
        payload
    }
}