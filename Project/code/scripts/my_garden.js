window.onload = function(){
    const popupElement = document.querySelector(".flower-details-container");
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener('click', closePopup);
    document.querySelector('.flower-details-container').addEventListener('click', closePopup);

    const actionButtons = document.querySelectorAll(".notification-button");
    actionButtons.forEach(button => {
        button.addEventListener("click", openPopup);
    })
}

function closePopup(e) {
    if(e.target !== document.querySelector('.flower-details-container') && 
       e.target !== document.querySelector('.close-button')) {
        return;
    }
    const popupElement = document.querySelector(".flower-details-container");
    if(popupElement.classList.contains("popup-open")){
        popupElement.classList.remove("popup-open");
        popupElement.classList.add("popup-closed");
    }
}

function openPopup() {
    const popupElement = document.querySelector(".flower-details-container");
    popupElement.classList.remove("popup-closed");
    popupElement.classList.add("popup-open");
}

function createNotification(img, desc)
{
    const notif = document.createElement('div');
    const image = document.createElement('img');
    const paragraph = document.createElement('p');
    const button = document.createElement('button');

    image.src = '../images/'+img;
    paragraph.textContent = desc;
    button.textContent = 'Verifica';

    notif.classList.add('notification');
    image.classList.add('notification-image');
    button.classList.add('notification-button');


    notif.append(image, paragraph, button);

    return notif;
}

//example JSON object
var plantedFlowersData = [
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

const growing_flowers_div = document.getElementById('growing-flowers');

for (var i = 0; i < plantedFlowersData.length; i++) {
    const notif = createNotification(plantedFlowersData[i]['img'], plantedFlowersData[i]['desc']);
    growing_flowers_div.append(notif);
}


var readyFlowersData = [
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

const ready_flowers_div = document.getElementById('ready-flowers');

for (var i = 0; i < readyFlowersData.length; i++) {
    const notif = createNotification(readyFlowersData[i]['img'], readyFlowersData[i]['desc'], '');
    ready_flowers_div.append(notif);
}