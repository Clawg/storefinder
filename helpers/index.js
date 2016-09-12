import numeral from 'numeral'
import moment from 'moment'
import {sortBy} from 'lodash'

/* Ball Colours UI Helper */

export const getBallColor = (number, powerball = false) => {
    if (powerball) {
        return 'darkBlue'
    }
    switch (number[0]) {
        case '0':
            return 'blue'
        case '1':
            return 'orange'
        case '2':
            return 'green'
        case '3':
            return 'red'
        case '4':
            return 'purple'
        default:
            return 'white'
    }
}

/* String Helpers */

export const getMoneyString = (number, stringIfZero = null) => {
    if (parseInt(number) == 0 && stringIfZero) {
        return stringIfZero
    }
    return numeral(number).format('$0,0')
}

export const getNumberString = (number) => {
    return numeral(number).format('0,0')
}

export const getDateString = (date) => {
    return moment(date).format('ddd DD MMM YYYY')
}

/* Get Ball Numbers from Result */

const getNestedNumbers = (object, param1, param2, size) => {
    if (object && object[param1]) {
        if (param2 && object[param1][param2]) {
            return object[param1][param2]
        }
        return object[param1]
    }
    var emptyArray = []
    for (var i = 0; i < size; i++) {
        emptyArray.push(null)
    }
    return emptyArray
}

export const getBallNumbersFromResults = (results) => {
    var lotto = strike = powerBall = null
    if (results) {
        var {lotto, strike, powerBall} = results
    }

    return [{
        title: 'Lotto',
        image: require('../../../../assets/logos/lotto_lotto_240.png'),
        numbers: getNestedNumbers(lotto, 'lottoWinningNumbers', 'numbers', 6)
    }, {
        title: 'Bonus Ball',
        numbers: getNestedNumbers(lotto, 'lottoWinningNumbers', 'bonusBalls', 1)
    }, {
        title: 'Power Ball',
        align: 'logoRight',
        image: require('../../../../assets/logos/lotto_pwstacked_240.png'),
        numbers: getNestedNumbers(powerBall, 'powerballWinningNumber', null, 1)
    }, {
        title: 'Strike',
        align: 'center',
        image: require('../../../../assets/logos/lotto_strike_240.png'),
        numbers: getNestedNumbers(strike, 'strikeWinningNumbers', null, 4)
    }]
}


/* Get My Tickets for Draw */

export const getMyTicketsForDraw = ({lottoTickets = []}, drawNumber) => {
    var ticketsForDraw = lottoTickets.filter( (ticket) => {
        var ticketDrawNumber = ticket.startDraw
        var isEqual = parseInt(ticketDrawNumber) == parseInt(drawNumber)
        return isEqual
    })
    return ticketsForDraw
}

/* Match for Winners tables */

export const getMatchValue = (matchKey, i) => {
    if (match[matchKey] && match[matchKey].length > i) {
        return match[matchKey][i]
    }
    return null
}

const match = {
    lotto: ['6','5 + Bonus', '5', '4 + Bonus', '4', '3 + Bonus'],
    powerball: ['6 + Powerball', '5 + Bonus + Powerball', '5 + Powerball', '4 + Bonus + Powerball', '4 + Powerball', '3 + Bonus + Powerball', '3 + Powerball'],
    strike: ['Exact order all 4', 'Exact order any 3', 'Exact order any 2', 'Match 1 number']
}

const getStrikeNumberFromDivision = (division) => {
    switch (division) {
        case 1:
            return 4
        case 2:
            return 3
        case 3:
            return 2
        case 4:
            return 1
    }
    return 0
}

export const getDivisionString = (matchKey, division, shorten = true) => {
    if (matchKey.toLowerCase() === 'strike') {
        return 'Strike ' + getStrikeNumberFromDivision(division)
    }
    if (shorten) {
        return 'Div. ' + division
    }
    return 'Division ' + division
}


const isJackpotted = (matchKey, winner) => {
    return (parseInt(winner.division) === 1 &&
        parseInt(winner.prizeValue) === 0 &&
        parseInt(winner.numberOfWinners) === 0)
}

const hasBonusLine = (matchKey, winner) => {
    return (matchKey.toLowerCase() === 'strike'
        && parseInt(winner.division) === 4
        && parseInt(winner.prizeValue) === 1)
}

const isRolldown = (matchKey, winner) => {
    return (parseInt(winner.numberOfWinners) === 999999)
}

// SIT does not give string values such as "JACKPOTTED" or "ROLLOVER"
// but CAT does, only trust what comes from CAT
export const getPrizeValue = (matchKey, winner) => {
    let {prizeValue, combinedPrizeValue} = winner
    // powerball is supposed to use the combined prize value
    // which exists in CAT but not in SIT so handle both cases
    let prize = (matchKey === 'powerball') ? (combinedPrizeValue || prizeValue) : prizeValue
    let moneyValue = Number(prize)
    if (isFinite(moneyValue)) {
        return getMoneyString(moneyValue)
    } else {
        return titleCase(prize)
    }
}

export const getNumberOfWinners = (matchKey, winner) => {
    if (isRolldown(matchKey, winner)) {
        return '0'
    }
    return getNumberString(winner.numberOfWinners)
}

export const accessibility = (label, traits) => {
    if (traits) {
        return {
            accessible: true,
            accessibilityLabel: label,
            accessibilityTraits: traits,
            testID: label
        }
    }
    return {
        accessible: true,
        accessibilityLabel: label,
        testID: label

    }
}

export const capitalize = (str) => (
    `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`
)

export const titleCase = (str) => {
    return str.split(' ').map((sub) => capitalize(sub)).join(' ')
}
