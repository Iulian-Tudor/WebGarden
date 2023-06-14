export default function parseURL(url) {
    if(url.indexOf('?') === -1) {
        // the url is already normalized
        return [url, {}];
    }

    const [normalizedURL, itemsRaw] = url.split('?', 2);

    const data = {};
    for(const pair of itemsRaw.split('&')) {
        const [key, value] = pair.split('=', 2).map(decodeURIComponent);
        data[key] = value;
    }
    return [normalizedURL, data];
}
