import {CALL_API} from '@lotto-nz/saturate'
import * as Constants from '../constants'
import * as actions from '../actions'

//import * as MyTicketConstants from '../../my-tickets/constants'
//import {addDay, addWeek, getISOTime, getTicketsFromWagers} from '../../my-tickets/helpers'

const MAX_RETRIES = 3
const DEFAULT_TIMEOUT = 15000

const retryFn = (dispatch, maxRetries = MAX_RETRIES) => {
    let retries = 0

    return (action, state, e) => {
        if (e.name === 'TimeoutError' && retries < maxRetries) {
            retries += 1
            dispatch(action)
        }
        return e
    }
}

function EncodeQueryData(data) {
   var ret = []
   for (var d in data) {
       ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]))
   }
   return ret.join("&")
}

/* istanbul ignore next */
export const getLatestLottoResults = () => ((dispatch) => {
    var endpoint = `${apigw}/api/results/v1/results/lotto`

    async function bailout (f) {
        return false
    }

    return dispatch({
        [CALL_API]: {
            endpoint,
            method: 'GET',
            timeout: DEFAULT_TIMEOUT,
            types: [
                {
                    type: Constants.GET_LATEST_LOTTO_RESULTS_REQUEST,
                    payload: (req) => req
                },
                Constants.GET_LATEST_LOTTO_RESULTS_SUCCESS,
                {
                    type: Constants.GET_LATEST_LOTTO_RESULTS_FAILURE,
                    payload: retryFn(dispatch)
                }
            ],
            bailout
        }
    })
})

/* istanbul ignore next */
export const getLottoResultsByDrawNumber = (drawNumber) => {
    async function bailout (f) {
        return false
    }

    var endpoint = `${apigw}/api/results/v1/results/lotto/${drawNumber}`

    return {
        [CALL_API]: {
            endpoint,
            method: 'GET',
            types: [
                Constants.GET_LOTTO_RESULTS_REQUEST,
                Constants.GET_LOTTO_RESULTS_SUCCESS,
                Constants.GET_LOTTO_RESULTS_FAILURE
            ],
            bailout
        }
    }
}

export const loadWagersForResults = (user, draw, dispatch) => {

    let maxDate = new Date(getServerTime()), y = maxDate.getFullYear(), m = maxDate.getMonth(), d = maxDate.getDate(), h = maxDate.getHours(), min = maxDate.getMinutes(), s = maxDate.getSeconds()
    let minDate = new Date(y-1, m, d + 1)

    // Need to search previous 11 weeks to cater for multi-draw tickets since wager api relies on purchase date
    let endDate = new Date(draw.drawDate)
    let startDate = addWeek(endDate, MyTicketConstants.WAGER_DATE_WEEK_RANGE * -1)

    endDate = addDay(endDate, 1)
    startDate = addDay(startDate, -1)

    if (endDate.getTime() > maxDate.getTime()) {
        endDate = maxDate
    }
    if (startDate.getTime() < minDate.getTime()) {
        startDate = minDate
    }

    let payload = {
        startdate: getISOTime(startDate),
        enddate: getISOTime(endDate),
        bullseye: false,
        keno: false,
        lotto: true,
        play3: false,
        strikeCategory: true
    }

    var endpoint = `${apigw}/api/core/v1/wagers/${user.userId}`
    endpoint += '?' + EncodeQueryData(payload)

    return {
        [CALL_API]: {
            endpoint,
            method: 'GET',
            timeout: DEFAULT_TIMEOUT,
            types: [
                Constants.LOAD_RESULTS_WAGERS_REQUEST,
                {
                    type: Constants.LOAD_RESULTS_WAGERS_SUCCESS,
                    payload: (action, state, res) => {

                        var gameHistory = res.data.gameHistory

                        // dispatch an action for each ticket

                        loadedTickets = getTicketsFromWagers(gameHistory)
                        let toBeLoadedTicketCount = 0
                        let loadedTicketNumbers = []
                        for (var ticketNumber of loadedTickets) {
                            if (state.results.loadedTicketNumbers.indexOf(ticketNumber) === -1) {
                                dispatch(loadResultTicketDetails(user, ticketNumber, dispatch))
                                toBeLoadedTicketCount++
                                loadedTicketNumbers.push(ticketNumber)
                            }
                        }

                        res.toBeLoadedTicketCount = toBeLoadedTicketCount
                        res.loadedTicketNumbers = loadedTicketNumbers
                        return res
                    }
                },
                Constants.LOAD_RESULTS_WAGERS_FAILURE
            ],
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
    }
}

export const loadResultTicketDetails = (user, ticketNumber, dispatch) => {

    var endpoint = `${apigw}/api/core/v1/wagers/${user.userId}/tickets/${ticketNumber}`
    return {
        [CALL_API]: {
            endpoint,
            method: 'GET',
            timeout: DEFAULT_TIMEOUT,
            types: [
                Constants.GET_RESULT_TICKET_DETAILS_REQUEST,
                {
                    type: Constants.GET_RESULT_TICKET_DETAILS_SUCCESS,
                    payload: (action, state, res) => {
                        return res
                    }
                },
                Constants.GET_RESULT_TICKET_DETAILS_FAILURE,
            ],
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
    }

}

/* istanbul ignore next */
export const selectGame = (game) => {
  return {
    type: Constants.SELECT_GAME,
    selectedGame: game
  }
}

/* istanbul ignore next */
export const toggleShowWinners = (game) => {
  return {
    type: Constants.TOGGLE_SHOW_WINNERS,
  }
}

export const resetLottoResults = () => ({
    type: Constants.RESET_LOTTO_RESULTS
})
