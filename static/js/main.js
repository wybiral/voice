function main(settings) {
    const voice = new Voice();
    loadSources(voice, settings.plugins).then(() => {
        createUpdate('Click to begin.', {type: 'info'});
        document.body.onclick = () => {
            document.querySelector('main').innerHTML = '';
            document.body.onclick = null;
            voice.listen();
        };
    });
}

window.onload = () => {
    fetch('settings.json').then(json => {
        return json.json();
    }).then(obj => {
        main(obj);
    }).catch(err => {
        createUpdate('Error loading /settings.json', {type: 'info'});
    });
};
