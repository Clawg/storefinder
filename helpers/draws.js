import moment from 'moment-timezone'

const getTimeNow = () => {
    return moment(getServerTime()).tz('Pacific/Auckland')
}

export const getPreviousDrawDate = (drawDate, drawDays) => {
    return getNextDrawDate(drawDate, drawDays, true)
}

export const getNextDrawDate = (drawDate, drawDays, previous = false) => {
    if (moment(drawDate).isBefore('2015-10-07')) {
        drawDays = [6]
    }

    for (var drawDay = 0;
        drawDays.indexOf(drawDay) === - 1;
        drawDay = parseInt(moment(drawDate).day(), 10)) {
        drawDate = moment(drawDate).add(previous ? - 1 : 1, 'days').format('YYYY-MM-DD')
    }
    return drawDate
}

const getPreviousDraws = (drawNumber, drawDate, drawDays) => {
    var draws = []
    while (moment(getServerTime()).add(- 1, 'years').isBefore(drawDate)) {
        draws.unshift({
            drawNumber,
            drawDate
        })
        drawNumber --
        drawDate = getPreviousDrawDate(drawDate, drawDays)
    }
    return draws
}

const getFollowingDraws = (drawNumber, drawDate, drawDays) => {
    var draws = []
    var afterToday = false

    while (! afterToday) {
        drawNumber ++
        drawDate = getNextDrawDate(drawDate, drawDays)
        draws.push({
            drawNumber,
            drawDate
        })
        afterToday = moment(drawDate).isAfter(getTimeNow())
    }
    return draws
}

export const getDrawsList = (drawNumber, drawDate, drawDays = [3,6]) => {
    return getPreviousDraws(drawNumber, drawDate, drawDays)
        .concat(getFollowingDraws(drawNumber, drawDate, drawDays)).reverse()
}

export const getDrawDateFromNumber = (draws, drawNumber) => {
    var selectedDraw = draws.find( (draw) => {
        return parseInt(draw.drawNumber, 10) === parseInt(drawNumber, 10)
    })
    return selectedDraw ? selectedDraw.drawDate : null
}

export const isDrawTodayOrAfter = (draws, drawNumber) => {
    var drawDate = getDrawDateFromNumber(draws, drawNumber)
    return ! getTimeNow().isAfter(drawDate, 'day')
}

const isDrawToday = (drawDate) => {
    return getTimeNow().isSame(drawDate, 'day')
}

const hasDrawBeen = (drawDate, drawTime) => {
    var nowString = getTimeNow().format('YYYY-MM-DD HH:MM')
    var drawTimeString = drawDate + ' ' + drawTime
    return moment(nowString).isAfter(drawTimeString)
}

export const getDrawPendingToday = (draws, drawTime = '20:00') => {
    return draws.find( (draw) => {
        return isDrawToday(draw.drawDate) &&
            hasDrawBeen(draw.drawDate, drawTime)
    })
}

/* */

const getDrawTodayOrDay = (drawDate) => {
    return isDrawToday(drawDate) ? 'today' : moment(drawDate).format('dddd')
}

export const getPendingMessage = (draws, drawNumber) => {
    var drawDate = getDrawDateFromNumber(draws, drawNumber)
    var day = getDrawTodayOrDay(drawDate)
    return `Check back soon for ${day}'s results!`
}

export const hasPreviousDraw = (draws, drawNumber) => {
    return draws[draws.length - 1].drawNumber !== drawNumber
}

export const hasNextDraw = (draws, drawNumber) => {
    return draws[0].drawNumber !== drawNumber
}
