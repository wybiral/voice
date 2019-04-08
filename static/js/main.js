window.onload = async () => {
    const voice = new Voice();
    await loadCommands(voice, [
        {file: './cmd/basic.js', options: {}}
    ])
    createUpdate('Click to begin.', {type: 'info'});
    document.body.onclick = () => {
        document.querySelector('main').innerHTML = '';
        document.body.onclick = null;
        voice.listen();
    };
};
