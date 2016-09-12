import React from 'react'
import {expect} from 'code'
import {describe, before, it} from 'mocha'

import * as helpers from '../../helpers/draws'

import moment from 'moment-timezone'

const getDate = (offsetDays = 0) => {
    return moment(getServerTime()).tz('Pacific/Auckland').add(offsetDays, 'days').format('YYYY-MM-DD')
}

const getTime = (offsetHours = 0) => {
    return moment(getServerTime()).tz('Pacific/Auckland').add(offsetHours, 'hours').format('HH:mm')
}

const DRAW_DAYS = [3,6]
const DRAW_TIME = '20:00'

describe('Result Draws helpers', () => {

    beforeEach((done) => {
        global.getServerTime = () => new Date()
        done()
    })

    /*it('getDrawsList', (done) => {
        var today = getDate()
        var latestDrawDate = helpers.getPreviousDrawDate(today, DRAW_DAYS)
        var nextDrawDate = helpers.getNextDrawDate(latestDrawDate, DRAW_DAYS)

        var drawsList = helpers.getDrawsList(1500, latestDrawDate)

        expect(drawsList[0].drawNumber).equal(1501)
        expect(drawsList[0].drawDate).equal(nextDrawDate)
        expect(drawsList[1].drawNumber).equal(1500)
        expect(drawsList[1].drawDate).equal(latestDrawDate)

        var lastDrawDate = drawsList[drawsList.length-1].drawDate

        expect(moment(lastDrawDate).isAfter(getDate(-365))).to.be.true()

        done()
    })*/

    it('isDrawTodayOrAfter tomorrow true', (done) => {
        var draws = [{drawNumber: 7, drawDate: getDate(- 1)}, {drawNumber: 8, drawDate: getDate(1)}]
        var isDrawTodayOrAfter = helpers.isDrawTodayOrAfter(draws, 8)
        expect(isDrawTodayOrAfter).to.equal(true)
        done()
    })

    it('isDrawTodayOrAfter today true', (done) => {
        var draws = [{drawNumber: 7, drawDate: getDate(- 4)}, {drawNumber: 8, drawDate: getDate()}]
        var isDrawTodayOrAfter = helpers.isDrawTodayOrAfter(draws, 8)
        expect(isDrawTodayOrAfter).to.equal(true)
        done()
    })

    it('isDrawTodayOrAfter yesterday false', (done) => {
        var draws = [{drawNumber: 7, drawDate: getDate(- 4)}, {drawNumber: 8, drawDate: getDate(- 1)}]
        var isDrawTodayOrAfter = helpers.isDrawTodayOrAfter(draws, 8)
        expect(isDrawTodayOrAfter).to.equal(false)
        done()
    })


    it('getDrawPendingToday - yesterday after draw time is false', (done) => {
        var timeOneHourAgo = getTime(- 1)
        var draws = [{drawNumber: 7,drawDate: getDate(- 3)}, {drawNumber: 8, drawDate: getDate(- 1)}]
        var drawPendingToday = helpers.getDrawPendingToday(draws, timeOneHourAgo)
        expect(drawPendingToday).to.not.exist()
        done()
    })

    it('getDrawPendingToday - today after draw time is true', (done) => {
        var timeOneHourAgo = getTime(- 1)
        var draws = [{drawNumber: 7, drawDate: getDate(- 2)}, {drawNumber: 8, drawDate: getDate()}]
        var drawPendingToday = helpers.getDrawPendingToday(draws, timeOneHourAgo)
        expect(drawPendingToday).to.exist()
        expect(drawPendingToday.drawNumber).to.equal(8)
        expect(drawPendingToday.drawDate).to.equal(getDate())

        done()
    })

    it('getDrawPendingToday - today before draw time is false', (done) => {
        var inOneHour = getTime(1)
        var draws = [{drawNumber: 7,drawDate: getDate(- 2)}, {drawNumber: 8,drawDate: getDate()}]
        var drawPendingToday = helpers.getDrawPendingToday(draws, inOneHour)

        expect(drawPendingToday).to.not.exist()
        done()
    })

    it('getPendingMessage today', (done) => {
        var oneHourAgo = getTime(- 1)

        var draws = [{drawNumber: 7,drawDate: getDate(- 2)}, {drawNumber: 8,drawDate: getDate()}, {drawNumber: 9, drawDate: helpers.getNextDrawDate(getDate(), DRAW_DAYS)}]

        var mesage = helpers.getPendingMessage(draws, 8, oneHourAgo)
        expect(mesage).to.be.equal('Check back soon for today\'s results!')

        done()
    })

    it('getPendingMessage future', (done) => {
        var oneHourAgo = getTime(- 1)

        var draws = [{drawNumber: 7, drawDate: getDate(- 2)}, {drawNumber: 8, drawDate: getDate()},
            {drawNumber: 9, drawDate: helpers.getNextDrawDate(getDate(), [6])}]  //Draws are only Saturday

        var mesage = helpers.getPendingMessage(draws, 9, oneHourAgo)

        expect(mesage).to.equal('Check back soon for Saturday\'s results!')

        done()
    })

})
