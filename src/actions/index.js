// src/modules/store-finder/actions/index.js
import * as Constants from '../constants'
//import {hideNavBar, showNavBar} from '../../core/actions'

const toggleShowNearestStores = () => {
    return {
        type: Constants.TOGGLE_SHOW_NEAREST_STORES
    }
}

const setFullscreenMap = () => {
    return {
        type: Constants.TOGGLE_FULLSCREEN_MAP
    }
}

const changeSearchTerm = (searchTerm) => {
    return {
        type: Constants.CHANGE_SEARCH_TERM,
        searchTerm
    }
}

const changeManualSearchOption = (searchOption) => {
    return {
        type: Constants.CHANGE_MANUAL_SEARCH_OPTION,
        searchOption
    }
}

const showSuggestedResults = () => {
    return {
        type: Constants.SHOW_SUGGESTED_RESULTS
    }
}

const hideSuggestedResults = () => {
    return {
        type: Constants.HIDE_SUGGESTED_RESULTS
    }
}

const setSelectedStore = (selectedStore) => {
    return {
        type: Constants.SET_SELECTED_STORE,
        selectedStore
    }
}

const showOfflineModal = () => {
    return {
        type: Constants.SHOW_OFFLINE_MODAL
    }
}

const dismissOfflineModal = () => {
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

const Actions = {
    toggleShowNearestStores,
    setFullscreenMap,
    changeSearchTerm,
    changeManualSearchOption,
    showSuggestedResults,
    hideSuggestedResults,
    setSelectedStore,
    showOfflineModal,
    dismissOfflineModal
}

export default Actions