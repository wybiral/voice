window.onload = () => {
    let update = createUpdate('Loading commands...', {type: 'info'});
    // Load demo commands
    loadScript('static/js/demo.js').then(() => {
        update.innerText = 'Click to begin.';
        const voice = new Voice();
        COMMANDS.forEach(command => voice.addCommand(command));
        document.body.onclick = () => {
            document.querySelector('main').innerHTML = '';
            document.body.onclick = null;
            voice.listen();
        };
    });
};
