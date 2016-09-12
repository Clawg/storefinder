import React from 'react'
import {expect} from 'code'
import {describe, before, it} from 'mocha'

import * as helpers from '../../helpers'

describe('Result helpers', () => {

    it('getBallColor dark blue', (done) => {
        var ballColor = helpers.getBallColor("04", true)
        expect(ballColor).to.equal('darkBlue')
        done()
    })

    it('getBallColor blue', (done) => {
        var ballColor = helpers.getBallColor("04")
        expect(ballColor).to.equal('blue')
        done()
    })

    it('getBallColor orange', (done) => {
        var ballColor = helpers.getBallColor("13")
        expect(ballColor).to.equal('orange')
        done()
    })

    it('getBallColor green', (done) => {
        var ballColor = helpers.getBallColor("24")
        expect(ballColor).to.equal('green')
        done()
    })

    it('getBallColor red', (done) => {
        var ballColor = helpers.getBallColor("34")
        expect(ballColor).to.equal('red')
        done()
    })

    it('getBallColor purple', (done) => {
        var ballColor = helpers.getBallColor("40")
        expect(ballColor).to.equal('purple')
        done()
    })

    it('getMoneyString', (done) => {
        var moneyString = helpers.getMoneyString("10000")
        expect(moneyString).to.equal('$10,000')
        done()
    })

    it('getNumberString', (done) => {
        var numberString = helpers.getNumberString("10000")
        expect(numberString).to.equal('10,000')
        done()
    })

    it('getMatchValue', (done) => {
        var matchValue = helpers.getMatchValue('lotto', 0)
        expect(matchValue).to.equal('6')
        done()
    })

    it('getDateString', (done) => {
        var dateString = helpers.getDateString('2016-06-08')
        expect(dateString).to.equal('Wed 08 Jun 2016')
        done()
    })

    // it('getBallNumbersFromResults no results', (done) => {
    //     var ballNumbers = helpers.getBallNumbersFromResults(null)
    //     expect(ballNumbers).to.have.length(4)
    //     expect(ballNumbers[0].title).to.equal('Lotto')
    //     expect(ballNumbers[0].numbers).to.have.length(6)
    //     expect(ballNumbers[0].numbers[0]).to.equal(null)
    //     done()
    // })

    // it('getBallNumbersFromResults results', (done) => {
    //     var ballNumbers = helpers.getBallNumbersFromResults({
    //         lotto: {
    //             lottoWinningNumbers: {
    //                 numbers: [1,2,3,4,5,6],
    //                 bonusBalls: 7
    //             },
    //         },
    //         powerBall: {
    //             powerballWinningNumber: 10
    //         },
    //         strike: {
    //             strikeWinningNumbers: [1,2,3,4]
    //         }
    //     })
    //     expect(ballNumbers).to.have.length(4)
    //     expect(ballNumbers[0].title).to.equal('Lotto')
    //     expect(ballNumbers[0].numbers).to.have.length(6)
    //     expect(ballNumbers[0].numbers[0]).to.equal(1)

    //     expect(ballNumbers[1].title).to.equal('Bonus')
    //     expect(ballNumbers[1].numbers).to.equal(7)

    //     expect(ballNumbers[2].title).to.equal('Powerball')
    //     expect(ballNumbers[2].numbers).to.equal(10)

    //     expect(ballNumbers).to.have.length(4)
    //     expect(ballNumbers[3].title).to.equal('Strike')
    //     expect(ballNumbers[3].numbers).to.have.length(4)
    //     expect(ballNumbers[3].numbers[0]).to.equal(1)

    //     done()
    // })

    it('getDivisionString', (done) => {
        expect(helpers.getDivisionString('lotto', 2)).to.equal('Div. 2')
        expect(helpers.getDivisionString('strike', 3)).to.equal('Strike 2')
        expect(helpers.getDivisionString('powerball', 1, false)).to.equal('Division 1')
        done()
    })

    it('getPrizeValue', (done) => {
        expect(helpers.getPrizeValue('lotto', {prizeValue: 0})).to.equal('$0')
        expect(helpers.getPrizeValue('strike', {prizeValue: 1})).to.equal('$1')
        expect(helpers.getPrizeValue('lotto', {prizeValue: 0})).to.equal('$0')
        expect(helpers.getPrizeValue('lotto', {prizeValue: 1000})).to.equal('$1,000')
        expect(helpers.getPrizeValue('lotto', {prizeValue: 'JACKPOTTED!'})).to.equal('Jackpotted!')
        expect(helpers.getPrizeValue('lotto', {prizeValue: '1.3363688E7'})).to.equal('$13,363,688')
        expect(helpers.getPrizeValue('powerball', {combinedPrizeValue: 1000000})).to.equal('$1,000,000')
        done()
    })

    it('titleCase', (done) => {
        expect(helpers.titleCase('test')).to.equal('Test')
        expect(helpers.titleCase('test text')).to.equal('Test Text')
        done()
    })

    it('getNumberOfWinners', (done) => {
        expect(helpers.getNumberOfWinners('lotto', {numberOfWinners: 999999, prizeValue: 0, division: 1})).to.equal('0')
        expect(helpers.getNumberOfWinners('lotto', {numberOfWinners: 234, prizeValue: 123, division: 1})).to.equal('234')
        done()
    })


})
