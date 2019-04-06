window.onload = () => {
    const voice = new Voice();
    installCommands(voice);
    createUpdate('Click to begin.', {type: 'info'});
    document.body.onclick = () => {
        document.querySelector('main').innerHTML = '';
        document.body.onclick = null;
        voice.listen();
    };
};

/*
Commands are objects with the following methods:
    - match(text, voice) returns true/false if the text matches the command.
    - action(text, voice) performs the command action and returns a promise.
*/
function installCommands(voice) {

    // NOP command.
    voice.addCommand({
        match: text => text === 'nevermind',
        action: async text => null
    });

    // Change the wake-up phrase.
    voice.addCommand({
        match: text => text == 'change phrase',
        action: async (text, voice) => {
            await voice.say("Okay. What should the new phrase be?");
            let update = createUpdate('...', {type: 'human'});
            let phrase = await voice.query();
            update.innerText = phrase;
            voice.phrase = phrase;
            return voice.say('Phrase changed to "' + phrase + '".');
        }
    });

    // Return the current time.
    voice.addCommand({
        match: text => text === 'what time is it',
        action: async (text, voice) => {
            const d = new Date();
            let h = d.getHours();
            let m = d.getMinutes();
            let ap = 'AM';
            if (h >= 12) {
                h -= 12;
                ap = 'PM';
            }
            if (h == 0) {
                h = 12;
            }
            if (m < 10) {
                m = '0' + m;
            }
            const time = h + ':' + m + ' ' + ap;
            return voice.say('The time is ' + time + '.');
        }
    });

    // Return today's date.
    voice.addCommand({
        match: text => {
            if (text == "what's today's date") {
                return true;
            }
            if (text == "what's the date") {
                return true;
            }
            if (text == "what day is it") {
                return true;
            }
            if (text == "what's today") {
                return true;
            }
            return false;
        },
        action: async (text, voice) => {
            const d = new Date();
            const weekday = WEEKDAYS[d.getDay()];
            const month = MONTHS[d.getMonth()];
            let day = d.getDate();
            if (day > 3 && day < 21) {
                day = day + 'th';
            } else {
                switch (day % 10) {
                    case 1:
                        day = day + 'st';
                        break;
                    case 2:
                        day = day + 'nd';
                        break;
                    case 3:
                        day = day + 'rd';
                        break;
                    default:
                        day = day + 'th';
                }
            }
            const today = weekday + ', ' + month + ' the ' + day;
            return voice.say('Today is ' + today + '.');
        }
    });

    // Listen to a knock-knock joke.
    voice.addCommand({
        match: text => text == 'knock knock',
        action: async (text, voice) => {
            let update;
            while (text === 'knock knock') {
                await voice.say("Who's there?");
                update = createUpdate('...', {type: 'human'});
                text = await voice.query();
                update.innerText = text;
                await voice.say('"' + text + '" who?');
                update = createUpdate('...', {type: 'human'});
                text = await voice.query();
                update.innerText = text;
            }
            if (text === "orange you glad I didn't say banana") {
                return voice.say('Wow! How original.');
            }
            return voice.say(choice([
                "Ha ha ha. That is funny. No seriously, I'm very amused.",
                "Oh... You really need to work on that.",
                "I mean... I get it. It's not making me laugh, but I get it.",
                "Good one! Too bad I can't detect humor.",
                "Okay... Is that supposed to be funny or something?",
            ]));
        }
    });

    voice.addCommand({
        match: text => text.includes('weather') || text.includes('forecast'),
        action: weatherAction
    });

}


async function weatherAction(text, voice) {
    const r = await fetch('/weather');
    let d;
    try {
        d = await r.json();
    } catch(err) {
        d = {'error': 'unable to parse JSON'};
    }
    if ('error' in d) {
        if (d.error === 'missing key') {
            await voice.say("Weather commands require a valid API key in settings.json file.");
        } else if (d.error === 'missing location') {
            await voice.say("Weather commands require a valid location in settings.json file.");
        } else {
            console.log(d.error);
            await voice.say("Weather service unavailable.");
        }
        return;
    }
    const today = new Date().getDay();
    const weekday = guessWeekday(text);
    if (text.includes('today')) {
        return weather(voice, d, today);
    }
    if (text.includes('tomorrow')) {
        return weather(voice, d, (today + 1) % 7);
    }
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
