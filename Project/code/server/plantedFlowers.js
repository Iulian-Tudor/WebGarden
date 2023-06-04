function handlePlantedFlowers(req, res) {
    var data = [
        {
            'img' : 'rose.jpg',
            'title' : 'Trandafiri',
            'water' : 10,
            'temperature' : 22.5,
            'humidity' : 54
        },
        {
            'img' : 'narcise.webp',
            'title' : 'Narcise',
            'water' : 10,
            'temperature' : 22.5,
            'humidity' : 54
        }
    ];
    res.end(JSON.stringify(data));
}

function handleReadyFlowers(req, res) {
    var data = [
        {
            'img' : 'rose.jpg',
            'title' : 'Trandafiri',
            'water' : 10,
            'temperature' : 22.5,
            'humidity' : 54
        },
        {
            'img' : 'narcise.webp',
            'title' : 'Narcise',
            'water' : 10,
            'temperature' : 22.5,
            'humidity' : 54
        }
    ];
    res.end(JSON.stringify(data));
}

export {handlePlantedFlowers, handleReadyFlowers};