// src/modules/store-finder/actions/index.js

import * as Constants from '../constants'
//import {hideNavBar, showNavBar} from '../../core/actions'


export const toggleShowNearestStores = () => {
    return {
        type: Constants.TOGGLE_SHOW_NEAREST_STORES
    }
}

export const setFullscreenMap = () => {
    return {
        type: Constants.TOGGLE_FULLSCREEN_MAP
    }
}

export const changeSearchTerm = (searchTerm) => {
    return {
        type: Constants.CHANGE_SEARCH_TERM,
        searchTerm
    }
}

export const changeManualSearchOption = (searchOption) => {
    return {
        type: Constants.CHANGE_MANUAL_SEARCH_OPTION,
        searchOption
    }
}

export const showSuggestedResults = () => {
    return {
        type: Constants.SHOW_SUGGESTED_RESULTS
    }
}

export const hideSuggestedResults = () => {
    return {
        type: Constants.HIDE_SUGGESTED_RESULTS
    }
}

export const setSelectedStore = (selectedStore) => {
    return {
        type: Constants.SET_SELECTED_STORE,
        selectedStore
    }
}

export const showOfflineModal = () => {
    return {
        type: Constants.SHOW_OFFLINE_MODAL
    }
}

export const dismissOfflineModal = () => {
    return {
        type: Constants.DISMISS_OFFLINE_MODAL
    }
}

// export const toggleFullscreenMap = () => {
//     return (dispatch, getState) => {
//         if (getState().storeFinder.fullscreenMap) dispatch(showNavBar())
//         else dispatch(hideNavBar())

//         dispatch(setFullscreenMap())
//     }
// }
