function handleTest(req, res) {
    res.end('Test');
}

function handleData(req, res) {
    const data = {
        'name': 'ceva',
        'age': 421
    };
    res.end(JSON.stringify(data));
}

export { handleTest, handleData };
