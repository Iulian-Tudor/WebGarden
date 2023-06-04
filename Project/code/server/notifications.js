function handleNotifications(req, res) {
    var notifList = [
        {
            'img' : 'narcise.webp',
            'desc' : 'Narcisele tale nu au apa'
        },
        {
            'img' : 'rose.jpg',
            'desc' : 'Trandifirilor tai le e sete'
        }
    ];

    res.end(JSON.stringify(notifList));
}

export {handleNotifications};