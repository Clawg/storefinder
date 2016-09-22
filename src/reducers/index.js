// src/modules/store-finder/reducers/index.js
import * as ConstantsNpm from '../constants'

const Constants = ConstantsNpm.default
const initialState = {
    fullscreenMap: false,
    showNearestStores: true,
    searchTerm: '',
    searchOption: null,
    selectedStore: null,
    showOfflineModal: false,
    showSuggestedResults: false
}

const Reducers = (state = initialState, action) => {
    switch (action.type) {
        case Constants.TOGGLE_SHOW_NEAREST_STORES:
            return Object.assign({}, state, {
                showNearestStores: !state.showNearestStores,
                searchTerm: state.showNearestStores ? state.searchTerm : ''
            })
        case Constants.TOGGLE_FULLSCREEN_MAP:
            return Object.assign({}, state, {
                fullscreenMap: !state.fullscreenMap,
                selectedStore: state.fullscreenMap ? null : state.selectedStore
            })
        case Constants.CHANGE_SEARCH_TERM:
            return Object.assign({}, state, {
                searchTerm: action.searchTerm,
                searchOption: null
            })
        case Constants.CHANGE_MANUAL_SEARCH_OPTION:
            return Object.assign({}, state, {
                searchOption: action.searchOption
            })
        case Constants.SHOW_SUGGESTED_RESULTS:
            return Object.assign({}, state, {
                showSuggestedResults: true
            })
        case Constants.HIDE_SUGGESTED_RESULTS:
            return Object.assign({}, state, {
                showSuggestedResults: false
            })
        case Constants.SET_SELECTED_STORE:
            return Object.assign({}, state, {
                selectedStore: action.selectedStore
            })
        case Constants.SHOW_OFFLINE_MODAL:
            return Object.assign({}, state, {
                showOfflineModal: true
            })
        case Constants.DISMISS_OFFLINE_MODAL:
            return Object.assign({}, state, {
                showOfflineModal: false
            })
        default:
            return state
    }
}

export default Reducers

