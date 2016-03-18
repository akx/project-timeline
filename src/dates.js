/* eslint-disable no-cond-assign */
import moment from "moment";

function mangle(mom) {
    return mom.clone().utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    });
}

export function parseWeek(text) {
    const match = /^(\d*)w(\d+)$/i.exec(text);
    if (match) {
        const [, year, weekStr] = match;
        const week = 0 | weekStr;
        if (week < 0 || week > 53) {
            return null;
        }
        const monday = mangle(moment.utc()).day("Monday").year(year || moment().year()).week(week);
        if (monday.isValid()) {
            return [
                monday.toDate(),
                monday.clone().add(7, "days").toDate(),
            ];
        }
    }
    return null;
}

function parseEndDate(expr, startDate) {
    let match;
    if (!/^\d/.test(expr)) {
        return null;
    }
    if ((match = (/^(\d+)-(\d+)$/).exec(expr))) {  // month and day
        const [, month, day] = match;
        return startDate.clone().set({month: (0 | month) - 1, date: 0 | day});
    } else if ((match = (/^(\d+)$/).exec(expr))) {  // day
        const [, day] = match;
        return startDate.clone().set({date: 0 | day});
    }
    const possibleEndDate = mangle(moment.utc(expr));
    if (possibleEndDate.isValid() && possibleEndDate.isAfter(startDate)) {
        return possibleEndDate;
    }
    return null;
}

export function parseAsRange(rangeText) {
    if (!/^\d/.test(rangeText)) {
        return null;
    }
    const [start, end] = rangeText.split("..", 2);
    const week = parseWeek(start);

    if (week) {
        if (end) {
            let endWeek = null;
            if (/^(\d+)$/.test(end)) {
                endWeek = parseWeek(`${week[0].getFullYear()}w${end}`);
            } else {
                endWeek = parseWeek(end);
            }
            if (endWeek) {
                return [week[0], endWeek[1]];
            }
            const possibleEnd = parseEndDate(end, week[0]);
            if (possibleEnd) {
                week[1] = possibleEnd;
            }
        }
        return week;
    }
    const startDate = mangle(moment.utc(start));
    if (!startDate.isValid()) {
        return null;
    }
    let endDate = startDate.clone().add(24, "hours");
    if (end) {
        endDate = parseEndDate(end, startDate) || endDate;
    }
    return [
        startDate.toDate(),
        endDate.toDate(),
    ];
}
