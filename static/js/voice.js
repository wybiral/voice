window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Storing the utterance globally seems to fix this "onend" bug.
// https://bugs.chromium.org/p/chromium/issues/detail?id=509488
let lastUtterance;

/*
This is the main instance of the voice application and it's responsible for
voice-related methods, listening for the wake-up phrase, and dispatching
commands.
*/
class Voice {

    constructor() {
        // Wake-up phrase
        this.phrase = 'Okay computer';
        // Array of commands
        this.commands = [];
        // Called ahead of time to load voice list
        speechSynthesis.getVoices();
    }

    // Have the computer say some text.
    say(msg) {
        const update = createUpdate(msg, {type: 'computer'});
        scroll();
        return new Promise((resolve, reject) => {
            // Transform for natural speech
            msg = msg.replace('.json', ' dot Jason');
            lastUtterance = new SpeechSynthesisUtterance(msg);
            const voices = speechSynthesis.getVoices();
            for (let i = 0; i < voices.length; i++) {
                if (voices[i].name === 'Google US') {
                    lastUtterance.voice = voices[i];
                    break;
                }
            }
            lastUtterance.onend = evt => {
                resolve(update);
            };
            // XXX: Removing this timeout seems to cause issues with the onend
            // event being triggered. Possibly related to "lastUtterance" bug.
            setTimeout(() => speechSynthesis.speak(lastUtterance), 100);
        });
    }

    // Query the user for text from speech.
    query() {
        return new Promise((resolve, reject) => {
            function inner() {
                const rec = new SpeechRecognition();
                let result = null;
                let timeout = null;
                rec.lang = 'en-US';
                rec.interimResults = false;
                rec.maxAlternatives = 1;
                rec.onresult = evt => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    result = evt.results[0][0].transcript;
                    rec.stop();
                };
                rec.onend = function() {
                    if (result === null) {
                        timeout = setTimeout(inner, 0);
                    } else {
                        resolve(result);
                    }
                };
                rec.onspeechend = function() {
                    rec.stop();
                };
                rec.start();
            }
            inner();
        });
    }

    // Listen for the wake-up phrase, dispatch the following command, repeat.
    async listen(update) {
        if (!(update instanceof HTMLElement)) {
            update = createUpdate('', {type: 'human'});
        }
        update.style.opacity = 0.5;
        update.innerText = 'say "' + this.phrase + '"';
        let text = await this.query();
        if (text === this.phrase) {
            beep();
            update.style.opacity = 1.0;
            await this.listenForCommand(update);
            update = undefined; // So the next listen has its own update.
        }
        setTimeout(() => this.listen(update), 0);
    }

    // Listen for a single command.
    async listenForCommand(update) {
        if (!(update instanceof HTMLElement)) {
            update = createUpdate('', {type: 'human'});
        }
        update.innerText = '...';
        scroll();
        let text = await this.query();
        update.innerText = text;
        scroll();
        return this.handleCommand(text, update);
    }

    // Dispatch a single command (if matched) or give default response.
    handleCommand(text, update) {
        for (let i = 0; i < this.commands.length; i++) {
            if (this.commands[i].match(text, this)) {
                return this.commands[i].action(text, this);
            }
        }
        return this.say(choice([
            "Does not compute.",
            "I didn't catch that.",
            "Please speak more clearly.",
            "Say that again. But, less like an idiot.",
            "I can't understand you when you mumble like that.",
        ]));
    }

    // Install a new command.
    addCommand(command) {
        this.commands.push(command)
    }
}
