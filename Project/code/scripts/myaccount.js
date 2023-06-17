function createNotification(img, desc, emoji)
{
    const notif = document.createElement('div');
    const image = document.createElement('img');
    const paragraph = document.createElement('p');
    const button = document.createElement('button');

    image.src = '../images/'+img;
    paragraph.textContent = emoji+' '+desc;
    button.textContent = 'Vezi problema';

    notif.classList.add('notification');
    image.classList.add('notification-image');
    button.classList.add('notification-button');


    notif.append(image, paragraph, button);

    return notif;
}

//example JSON object
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

async function receiveNotifications()
{
    const response = await fetch("/notifs");
    const data = await response.json();
    return data;
}
 
const my_flowers_div = document.getElementById('my-flowers');

for (var i = 0; i < notifList.length; i++) {
    const notif = createNotification(notifList[i]['img'], notifList[i]['desc'], String.fromCodePoint(0x2757));
    my_flowers_div.append(notif);
}

receiveNotifications().then( notifications => {
    console.log(notifications);
})


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

const other_flowers_div = document.getElementById('other-flowers');

for (var i = 0; i < watchList.length; i++) {
    const notif = createNotification(watchList[i]['img'], watchList[i]['desc'], '');
    other_flowers_div.append(notif);
}