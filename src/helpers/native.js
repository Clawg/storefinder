import {Platform} from 'react-native'

//get a url to open the native mapping app for navigation
export function getDirectionsUrl(latitude, longitude) {
    return Platform.OS === 'ios'
        ? `maps:daddr=${latitude},${longitude}`
        : `google.navigation:q=${latitude},${longitude}`
}