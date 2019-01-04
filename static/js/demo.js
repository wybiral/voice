/*
This file is a set of demo commands and is meant to only be a proof of concept.

Commands are objects with the following methods:
    - match(text, voice) returns true/false if the text matches the command.
    - action(text, voice) performs the command action and returns a promise.
*/
export function init(voice) {

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
            let who, punchline;
            while (text === 'knock knock') {
                await voice.say("Who's there?");
                update = createUpdate('...', {type: 'human'});
                who = await voice.query();
                update.innerText = who;
                await voice.say('"' + who + '" who?');
                update = createUpdate('...', {type: 'human'});
                text = await voice.query();
                update.innerText = who;
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

}
