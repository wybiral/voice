# voice

Demo: https://wybiral.github.io/voice/

This is a project to build an open source voice assistant, along the lines of Alexa or Google Assistant, except this one actually respects your privacy. All of the speech recognition and command dispatching is done client-side so that no data is sent to any server unless an external service is required.

Currently this is only in a proof of concept stage with the demo commands implemented in [demo.js](https://github.com/wybiral/voice/blob/master/static/js/demo.js). Additional commands can be added to that file for now but the plan is to allow for the installation of commands through a local golang server instead of having everything in one file.

The demo wake-up phrase is `"Okay computer"` and the available commands are: `"what time is it?"`, `"what day is it?"`, `"knock knock"`, `"change phrase"`.
