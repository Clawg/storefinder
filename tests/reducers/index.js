import React from 'react'
import {expect} from 'code'
import {describe, before, it} from 'mocha'

import resultsReducer, {initialState} from '../../reducers'

describe('Results reducer', () => {

    it('SELECT_GAME', (done) => {  
        var newState = resultsReducer(initialState, { type: 'SELECT_GAME', selectedGame: 'lotto' })
        expect(newState.selectedGame).to.equal('lotto')
        done()
    })

    it('GET_LATEST_LOTTO_RESULTS_SUCCESS', (done) => {  
        var newState = resultsReducer(initialState, {
            type: 'GET_LATEST_LOTTO_RESULTS_SUCCESS',
            payload: {
                lotto: {
                    drawNumber: 123,
                    drawDate: '2016-06-06'
                }
            }
        })
        expect(newState.currentLottoDraw.drawNumber).to.equal(123)
        expect(newState.currentLottoDraw.drawDate).to.equal('2016-06-06')

        expect(newState.latestLottoDraw.drawNumber).to.equal(123)
        expect(newState.latestLottoDraw.drawDate).to.equal('2016-06-06')
        
        done()
    })

    it('GET_LOTTO_RESULTS_SUCCESS', (done) => {  
        var newState = resultsReducer(initialState, {
            type: 'GET_LOTTO_RESULTS_SUCCESS',
            payload: {
                lotto: {
                    drawNumber: 1223,
                    drawDate: '2016-04-06'
                }
            }
        })
        expect(newState.currentLottoDraw.drawNumber).to.equal(1223)
        expect(newState.currentLottoDraw.drawDate).to.equal('2016-04-06')
        done()
    })

    it('TOGGLE_SHOW_WINNERS', (done) => {  
        expect(initialState.showWinners).to.equal(false)

        var newState = resultsReducer(initialState, {
            type: 'TOGGLE_SHOW_WINNERS',
        })
        expect(newState.showWinners).to.equal(true)
        done()
    })

})
