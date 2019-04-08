/*
This file contains an example command for the Dark Sky weather API.

To use it you need to provide an endpoint URL since the Dark Sky API doesn't
support CORS. This should be a server that proxy's the JSON response from:
api.darksky.net/forecast/API_KEY/LOCATION
*/

let DARK_SKY_ENDPOINT = "";

export function init(voice, options) {
    voice.addCommand({
        match: text => text.includes('weather') || text.includes('forecast'),
        action: weatherAction
    });
}

async function weatherAction(text, voice) {
    const r = await fetch(DARK_SKY_ENDPOINT);
    let d;
    try {
        d = await r.json();
    } catch(err) {
        d = {'error': 'unable to parse JSON'};
    }
    if ('error' in d) {
        console.log(d.error);
        await voice.say("Weather service unavailable.");
        return;
    }
    const today = new Date().getDay();
    if (text.includes('today')) {
        return weather(voice, d, today);
    }
    if (text.includes('tomorrow')) {
        return weather(voice, d, (today + 1) % 7);
    }
    const weekday = guessWeekday(text);
    if (weekday > -1) {
        return weather(voice, d, weekday);
    }
    if (!text.includes('weather')) {
        return forecast(voice, d);
    }
    return weather(voice, d, today);
}

// Give single-day forecast
function weather(voice, d, weekday) {
    const today = new Date().getDay();
    const days = d.daily.data;
    let i = 0;
    let j = today;
    while (j !== weekday) {
        i += 1;
        j = (j + 1) % 7;
    }
    let msg;
    if (j === today) {
        msg = "Today's forecast is";
    } else if (j === ((today + 1) % 7)) {
        msg = "Tomorrow's forecast is";
    } else {
        msg = 'The forecast for ' + WEEKDAYS[j] + ' is'
    }
    const day = days[i];
    msg += ' ' + removeCap(day.summary);
    msg += ' With a high of ' + Math.round(day.temperatureMax);
    msg += ' and a low of ' + Math.round(day.temperatureMin);
    msg += '.'
    return voice.say(msg);
}

// Give week-ahead forecast
function forecast(voice, d) {
    const summary = removeCap(d.daily.summary.replace('°F', '°'));
    return voice.say('The forecast for the week is ' + summary);
}

// Convert first character to lowercase
function removeCap(x) {
    return x[0].toLowerCase() + x.slice(1);
}
