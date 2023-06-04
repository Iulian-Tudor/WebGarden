function handleTest(req, res) {
    var data = {
        'something' : 1,
        'else' : 2
    };
    res.end(JSON.stringify(data));
}

export { handleTest };
