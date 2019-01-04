const settings = {
    "command_sources": [
        "/static/js/demo.js",
    ]
};

window.onload = () => {
    // Called ahead of time to load voice list
    speechSynthesis.getVoices();
    const voice = new Voice();
    loadSources(voice, settings.command_sources).then(() => {
        createUpdate('Click to begin.', {type: 'info'});
        document.body.onclick = () => {
            document.querySelector('main').innerHTML = '';
            document.body.onclick = null;
            voice.listen();
        };
    });
};
