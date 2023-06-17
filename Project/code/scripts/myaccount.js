function createNotification(img, desc, emoji) {
    const notif = document.createElement('div');
    const image = document.createElement('img');
    const paragraph = document.createElement('p');
    const anchor = document.createElement('a');
    const button = document.createElement('button');

    image.src = img;
    paragraph.textContent = emoji + ' ' + desc;
    anchor.href = '/html/mygarden.html';
    button.textContent = 'Vezi problema';
    anchor.append(button);


    notif.classList.add('notification');
    image.classList.add('notification-image');
    button.classList.add('notification-button');


    notif.append(image, paragraph, anchor);

    return notif;
}

async function receiveNotifications() {
    const response = await fetch("/notifs");
    const data = await response.json();
    return data;
}


async function updateNotifications() {

    const notifList = await receiveNotifications();


    const my_flowers_div = document.getElementById('my-flowers');

    for (var i = 0; i < notifList.length; i++) {
        const notif = createNotification(notifList[i]['img'], notifList[i]['desc'], String.fromCodePoint(0x2757));
        my_flowers_div.append(notif);
    }
}

async function receiveWatchlist() {
    const response = await fetch("/watchlist");
    const data = await response.json();
    return data;
}

async function updateWatchlist() {

    const watchList = await receiveWatchlist();
    const other_flowers_div = document.getElementById('other-flowers');

    for (var i = 0; i < watchList.length; i++) {
        const notif = createNotification(watchList[i]['img'], watchList[i]['desc'], '');
        other_flowers_div.append(notif);
    }
}

updateNotifications();
updateWatchlist();