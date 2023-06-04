function handleWatchlist(req, res) {
    var watchList = [
        {
            'img' : 'narcise.webp',
            'desc' : 'Narcisele lui Gigel'
        },
        {
            'img' : 'rose.jpg',
            'desc' : 'Trandifirii lui Ion Dolanescu'
        }
    ];

    res.end(JSON.stringify(watchList));
}

export {handleWatchlist};