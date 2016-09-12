// src/client/modules/results/reducers/index.js

import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as DrawHelpers from '../helpers/draws'
import * as CoreHelpers from '../../core/helpers'
import * as UserConstants from '../../user/constants'
import {getTicketType} from '../../my-tickets/helpers'
import {getResultMatch} from '../../draw-experience/reducers'
import {filter, map, union} from 'lodash'

export const initialState = {
    currentLottoDraw: null,
    loadedTicketCount: 0,
    loadedTicketNumbers: [],
    resultsTickets: {},
    selectedGame: "lotto",
    showWinners: false,
    submitting: false,
    submittingFailed: false,
    submittingError: null,
    toBeLoadedTicketCount: 0,
}

const DRAW_TIME = '20:00' //20:00 = 8pm
const DRAW_DAYS = [3,6] // 3 = Wednesday, 6 = Saturday

export const getLottoResultsSuccess = (state, action) => {
    var {drawNumber, drawDate} = action.payload.lotto
    let {resultsTickets} = state
    let loadedTicketCount = -1
    if (resultsTickets.hasOwnProperty(drawNumber)) {
        loadedTicketCount = Object.keys(resultsTickets[drawNumber]).length
    }

    return {
        results: action.payload,
        currentLottoDraw: {
            drawNumber: drawNumber,
            drawDate: drawDate
        },
        futureDraw: false,
        drawPending: false,
        loadingResults: false,
        failedResults: false,
        failedMessage: null,
        loadedTicketCount,
        toBeLoadedTicketCount: 0
    }
}

const results = (state = initialState, action) => {
    switch (action.type) {

        case Constants.LOAD_RESULTS_WAGERS_REQUEST:
            return Object.assign({}, state, {
                submitting: true,
                submittingFailed: false,
                loadedTicketCount: -1,
                toBeLoadedTicketCount: 0
            })

        case Constants.LOAD_RESULTS_WAGERS_FAILURE:
            var submittingError = CoreHelpers.getUserMessage('general', 'general')

            if ( action.payload && action.payload.message ) {
                var data = action.payload

                if ( data.message.indexOf('InvalidDateException') !== -1) {
                    submittingError = CoreHelpers.getUserMessage('myticket', 'invalid_date_range')
                }
            }
            return Object.assign({}, state, {
                toBeLoadedTicketCount: 0,
                loadedTicketCount: 0,
                submittingError,
                submittingFailed: true,
                submitting: false
            })

        case Constants.LOAD_RESULTS_WAGERS_SUCCESS:
            return Object.assign({}, state, {
                toBeLoadedTicketCount: action.payload.toBeLoadedTicketCount,
                loadedTicketCount: 0,
                loadedTicketNumbers: union(state.loadedTicketNumbers, action.payload.loadedTicketNumbers),
                submittingFailed: false,
                submitting: false
            })

        case Constants.GET_RESULT_TICKET_DETAILS_REQUEST:
            return Object.assign({}, state, {
                submittingFailed: false
            })

        case Constants.GET_RESULT_TICKET_DETAILS_FAILURE:
            return Object.assign({}, state, {
                loadedTicketCount: state.loadedTicketCount + 1,
                submittingFailed: false
            })

        case Constants.GET_RESULT_TICKET_DETAILS_SUCCESS:
            let wager = action.payload.data
            const ticketType = getTicketType(wager)

            // Ignore Voucher until promoption feature comes in
            // Also ignore if lotto ticket doesn't have wagerDetails
            if (!wager.hasOwnProperty('gameName') ||
                wager.ticketType === 'Voucher' ||
                (ticketType === 'lotto' && !wager.hasOwnProperty('lottoWagerDetails')) ||
                 (ticketType === 'strike'  && !wager.hasOwnProperty('strikeWagerDetails'))) {
                return Object.assign({}, state, {
                    loadedTicketCount: state.loadedTicketCount + 1
                })
            }

            let newState = Object.assign({}, state)

            for (let i in wager.drawWinDetails) {

                let draw = wager.drawWinDetails[i]

                let defaultWagerObj = {
                    drawWinDetails: [draw],
                    drawDate: '',
                    gameName: '',
                    wagerAmount: 0,
                    numberOfBoards: 0,
                    numberOfDraws: 1,
                    numberStrikeBoards: 0,
                    numberPowerballBoards: 0,
                    tickets: []
                }

                if (newState.resultsTickets.hasOwnProperty(draw.drawNumber) ) {
                    if ( !newState.resultsTickets[draw.drawNumber].hasOwnProperty(wager.gameTransactionNumber) ) {
                        newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber] = Object.assign({}, defaultWagerObj)
                    }
                }
                else {
                    newState.resultsTickets[draw.drawNumber] = {}
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber] = Object.assign({}, defaultWagerObj)
                }

                if (wager.gameName.indexOf('Strike') === -1) {
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].gameName = wager.gameName
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketType = wager.ticketType
                }

                let ticket = {
                    drawWinDetails: [draw],
                    drawNumber: draw.drawNumber,
                    gameName: wager.gameName,
                    multiDraw: false,
                    numberOfBoards: wager.numberOfBoards,
                    numberPowerballBoards: 0,
                    numberStrikeBoards: 0,
                    numberOfDraws: 1,
                    ticketNumber: wager.ticketNumber,
                    ticketType: wager.ticketType,
                    wagerAmount: Number(wager.wagerAmount) / Number(wager.numberOfDraws),
                    drawStatus: draw.drawStatus,
                    ticketStatus: wager.ticketStatus
                }

                switch ( wager.gameName ) {

                    case "Lotto Powerball":
                        newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].gameName = wager.gameName
                        newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketType = wager.ticketType
                        ticket.lottoWagerDetails = wager.lottoWagerDetails
                        ticket.numberPowerballBoards = filter(wager.lottoWagerDetails[0].lottoBoard, (board) => { return board.hasOwnProperty('powerballNumber') && board.powerballNumber !== 0 }).length
                        break

                    case "Lotto Strike":
                        ticket.numberStrikeBoards = wager.numberOfBoards
                        ticket.strikeWagerDetails = wager.strikeWagerDetails
                        break

                    default:
                        ticket.numberOfBoards = wager.numberOfBoards
                        break

                }

                if ( !newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].gameName ||
                     newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].gameName === 'Lotto Strike' ) {
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].gameName = wager.gameName
                }
                if ( !newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketName ||
                     newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketName === 'Lotto Strike' ) {
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketName = wager.ticketName
                }

                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].drawNumber = ticket.drawNumber
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].numberOfBoards += ticket.numberOfBoards
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].numberPowerballBoards += ticket.numberPowerballBoards
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].numberStrikeBoards += ticket.numberStrikeBoards
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].drawNumber = draw.drawNumber
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].drawStatus = draw.drawStatus
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].drawDate = draw.drawDate
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].ticketStatus = wager.ticketStatus
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].resultMatch = getResultMatch(wager, draw.drawNumber)
                newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].wagerAmount += Number(wager.wagerAmount) / Number(wager.numberOfDraws)

                if (ticketType === 'lotto') {
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].tickets.unshift(ticket)
                }
                else {
                    newState.resultsTickets[draw.drawNumber][wager.gameTransactionNumber].tickets.push(ticket)
                }
            }

            newState.loadedTicketCount += 1
            newState.submittingFailed = false

            return newState

        case Constants.SELECT_GAME:
            return Object.assign({}, state, {
                selectedGame: action.selectedGame
            })

        case Constants.GET_LATEST_LOTTO_RESULTS_SUCCESS:
            var {lotto} = action.payload

            var latestLottoDraw = {
                drawNumber: lotto.drawNumber,
                drawDate: lotto.drawDate
            }

            var draws = DrawHelpers.getDrawsList(lotto.drawNumber, lotto.drawDate, DRAW_DAYS)

            var drawPendingToday = DrawHelpers.getDrawPendingToday(draws, DRAW_TIME)
            var isDrawPendingToday = drawPendingToday != null
            var currentLottoDraw = drawPendingToday || latestLottoDraw

            return Object.assign({}, state, {
                draws: draws,
                results: isDrawPendingToday ? null : action.payload,
                drawPending: isDrawPendingToday,
                futureDraw: false,
                currentLottoDraw: currentLottoDraw,
                latestLottoDraw: latestLottoDraw,
                loadingResults: false,
                failedResults: false,
                failedMessage: null
            })

        case Constants.GET_LOTTO_RESULTS_SUCCESS:
            return Object.assign({}, state, getLottoResultsSuccess(state, action))

        case Constants.GET_LOTTO_RESULTS_REQUEST:
            return Object.assign({}, state, {
                loadingResults: true
            })

        case Constants.GET_LOTTO_RESULTS_FAILURE:
            var {message} = action.payload.data

            var drawNumber = parseInt(message.match(/\d+/)[0])

            var drawPendingToday = DrawHelpers.getDrawPendingToday(state.draws, DRAW_TIME)
            var thisDrawIsPendingToday = (drawPendingToday && drawPendingToday.drawNumber == drawNumber)

            return Object.assign({}, state, {
                results: null,
                currentLottoDraw: {
                    drawNumber: drawNumber
                },
                futureDraw: !thisDrawIsPendingToday && DrawHelpers.isDrawTodayOrAfter(state.draws, drawNumber),
                drawPending: thisDrawIsPendingToday,
                loadingResults: false,
                failedResults: true,
                failedMessage: message
            })

        case Constants.TOGGLE_SHOW_WINNERS:
            return Object.assign({}, state, {
                showWinners: !state.showWinners
            })

        case UserConstants.USER_LOGGED_OUT:
                return Object.assign({}, initialState, {
                    resultsTickets: {},
                    loadedTicketNumbers: []
                })

        default:
            return state
    }

}

export default results
