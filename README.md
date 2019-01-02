# voice

Demo: https://wybiral.github.io/voice/ (currently only works in Chrome, FireFox is waiting on [this issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1248897))

This is a project to build an open source voice assistant, along the lines of Alexa or Google Assistant, except this one actually respects your privacy.

Currently this is only in a proof of concept stage with the demo commands implemented in [demo.js](https://github.com/wybiral/voice/blob/master/static/js/demo.js). Additional commands can be added to that file for now but the plan is to allow for the installation of commands through a local golang server instead of having everything in one file.

The demo wake-up phrase is `"Okay computer"` and the available commands are: `"what time is it?"`, `"what day is it?"`, `"knock knock"`, `"change phrase"`.
