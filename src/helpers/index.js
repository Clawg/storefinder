// src/modules/store-finder/helpers/index.js


// convert degrees to radians
const toRad = (num) => {
  return num * Math.PI / 180
}


// comparator function for sorting by a key
const sortByKey = (key) => {
    return (a, b) => {
        if (a[key] > b[key]) return 1
        if (a[key] < b[key]) return -1
        return 0
    }
}

// calculate the distance between two lat/lng points
const haversineDistance = (start, end) => {
    const radius = 6371

    const latDiff = toRad(end.latitude - start.latitude)
    const lonDiff = toRad(end.longitude - start.longitude)
    const startLat = toRad(start.latitude)
    const endLat = toRad(end.latitude)

    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2) * Math.cos(startLat) * Math.cos(endLat)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return parseFloat((radius * c).toFixed(1))
}


// pad a post code to at elast 4 digits
const padPostCode = (code) => {
    if (code.length === 4) return code
    return '0'.repeat(4 - code.length) + code
}


// get a filtered list of stores based on a search term
const getFilteredData = (data, searchTerm, position) => {
    const term = searchTerm.toLowerCase().trim()

    if (searchTerm.length < 3) return []

    const cityMatch = data.cities.find(e => e.name.toLowerCase().trim() === term)
    const suburbMatch = data.suburbs.find(e => e.name.toLowerCase().trim() === term) ||
        data.suburbs.find(e => e.name.toLowerCase().trim() === term.split('(').shift().trim())


    if (cityMatch) {
        return data.result.filter(e => e.cityId === cityMatch.id)
    } else if (suburbMatch) {
        return data.result.filter(e => e.suburbId === suburbMatch.id)
    }

    let filteredData = data.result.filter(r => (
        r.city.toLowerCase().includes(term) ||
        r.suburb.toLowerCase().includes(term) ||
        r.address.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term)
    ))

    if (position) {
        filteredData = filteredData
            .map(r => {
                if (!position) return r
                return Object.assign({}, r, {
                    distance: haversineDistance(r, position.coords)
                })
            })
            .sort((a, b) => {
                if (a.distance > b.distance) return 1
                if (a.distance < b.distance) return -1
                return 0
            })
    }

    return filteredData
}


// get a list of cities/suburbs/addresses to manually choose from when in offline mode
const getOfflineResults = (data, searchOption) => {
    let result = null
    let filterSuburb = true

    // show cities
    if (searchOption === null) return data.cities.sort((a, b) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
    })

    // show suburbs
    if (searchOption.id && !searchOption.cityId) result = data.suburbs
        .filter(e => e.cityId === searchOption.id)
        .sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
        })

    // skip straight to individual addresses if there aren't any suburbs
    if (result && result.length !== 0) return result
    else if (result) {
        return data.result
            .filter(e => e.cityId === searchOption.id)
            .sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
    }

    // show individual addresses
    return data.result
        .filter(e => e.cityId === searchOption.cityId && e.suburbId === searchOption.id)
        .sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
        })
}

// get a list of suggested results based on a search term
const getSuggestedResults = (data, searchTerm, position) => {
    const term = searchTerm.toLowerCase().trim()

    if (searchTerm.length === 0) return []

    const suggestedResults = [].concat.apply([], [
        // cities
        data.cities
            .filter(e => e.name.toLowerCase().includes(term))
            .sort(sortByKey('name')),
        // suburbs
        data.suburbs
            .filter(e => e.name.toLowerCase().includes(term))
            .map(e => {
                // place the city name in brackets if a suburb's name matches a city
                if (data.cities.find(c => c.name === e.name)) return Object.assign({}, e, {
                    name: `${e.name} (${e.city})`
                })
                return e
            })
            .sort(sortByKey('name')),
        // addresses
        data.result
            .filter(e => e.address.toLowerCase().includes(term))
            .sort(sortByKey('address')),
        // store names
        data.result
            .filter(e => e.name.toLowerCase().includes(term))
            .map(e => Object.assign({}, e, { address: undefined }))
            .sort(sortByKey('name'))
    ])

    return suggestedResults.slice(0, 20)
}

// get the top 20 nearest stores to the current location
const getNearestStores = (data, position) => {
    if (!position || !position.coords) return []

    return data.result
        .map(r => {
            return Object.assign({}, r, {
                distance: haversineDistance(r, position.coords)
            })
        })
        .sort((a, b) => {
            if (a.distance > b.distance) return 1
            if (a.distance < b.distance) return -1
            return 0
        })
        .slice(0, 20)
}


// get the lat/lng bounds that covers all the stores in a list of results
const getBoundsForResults = (data, position) => {
    let minLat = null
    let minLon = null
    let maxLat = null
    let maxLon = null

    if (!data || data.length === 0) {
        if (position && position.coords) return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
        }
        else return null
    }

    data.forEach(d => {
        if (d.latitude < minLat || !minLat) minLat = d.latitude
        if (d.longitude < minLon || !minLon) minLon = d.longitude
        if (d.latitude > maxLat || !maxLat) maxLat = d.latitude
        if (d.longitude > maxLon || !maxLon) maxLon = d.longitude
    })

    return {
        latitude: maxLat - (maxLat - minLat) / 2,
        longitude: maxLon - (maxLon - minLon) / 2,
        latitudeDelta: Math.abs((maxLat - minLat)) * 1.2 || 0.01,
        longitudeDelta: Math.abs((maxLon - minLon)) * 1.2 || 0.01
    }
}



// get a url to open the native phone app
const getPhoneUrl = (phone) => {
    return `tel:${phone.replace(/\s/g, '')}`
}

const Helpers = {
    toRad,
    sortByKey,
    haversineDistance,
    padPostCode,
    getFilteredData,
    getOfflineResults,
    getSuggestedResults,
    getNearestStores,
    getBoundsForResults,
    getPhoneUrl
}

export default Helpers