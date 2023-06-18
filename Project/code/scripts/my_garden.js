window.onload = async function () {
    const popupElement = document.querySelector(".flower-details-container");
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener('click', closePopup);
    document.querySelector('.flower-details-container').addEventListener('click', closePopup);

    const urlParams = new URLSearchParams(window.location.search);
    const flowerId = urlParams.get('flower_id');

    updateGrowingFlowers();
    updateReadyFlowers();

    if(flowerId) {
        const response = await fetch("/flower-params?flower_id="+flowerId);
        const data = await response.json();
        openPopup(data);
    }
}

function closePopup(e) {
    if (e.target !== document.querySelector('.flower-details-container') &&
        e.target !== document.querySelector('.close-button')) {
        return;
    }
    const popupElement = document.querySelector(".flower-details-container");
    if (popupElement.classList.contains("popup-open")) {
        popupElement.classList.remove("popup-open");
        popupElement.classList.add("popup-closed");
    }
}

function openPopup(flowerData) {
    const popupElement = document.querySelector(".flower-details-container");
    document.querySelector(".flower-img").src = flowerData["img"];
    document.querySelector(".flower-title").textContent = flowerData["title"];

    updateStatusFields('water', flowerData['water'], flowerData['water_ok']);
    updateStatusFields('soil', flowerData['soil'], flowerData['soil_ok']);
    updateStatusFields('temperature', flowerData['temperature'], flowerData['temperature_ok']);
    updateStatusFields('humidity', flowerData['humidity'], flowerData['humidity_ok']);

    popupElement.classList.remove("popup-closed");
    popupElement.classList.add("popup-open");
}

function updateStatusFields(key, value, status)
{
    keyDiv = document.querySelector('.'+key);
    valueLabel = keyDiv.querySelector('.item-value');
    statusImg = keyDiv.querySelector('.item-status');
    

    if(key === 'soil'){//soil has status true or false, so it must be treated separately
        valueLabel.textContent = value;
        statusImg.src = (status ? "../images/check.png" : "../images/close.png");
    } else {
        valueLabel.textContent = Number.parseFloat(value).toFixed(2);

        if(status === -1)
            statusImg.src = "../images/down.png";
        else if(status === 0)
            statusImg.src = "../images/check.png";
        else if(status === 1)
            statusImg.src = "../images/up-arrow.png";
    }
}

function createNotification(flowerData) {
    const notif = document.createElement('div');
    const image = document.createElement('img');
    const paragraph = document.createElement('p');
    const button = document.createElement('button');

    image.src = flowerData['img'];
    paragraph.textContent = flowerData['title'];
    button.textContent = 'Verifica';

    notif.classList.add('notification');
    image.classList.add('notification-image');
    button.classList.add('notification-button');

    button.addEventListener('click', () => {
        openPopup(flowerData)
    })

    notif.append(image, paragraph, button);

    return notif;
}

async function receiveGrowingFlowers() {
    const response = await fetch("/growing-flowers");
    const data = await response.json();
    return data;
}

async function updateGrowingFlowers() {

    plantedFlowersData = await receiveGrowingFlowers();

    const growing_flowers_div = document.getElementById('growing-flowers');

    for (var i = 0; i < plantedFlowersData.length; i++) {
        const notif = createNotification(plantedFlowersData[i]);
        growing_flowers_div.append(notif);
    }
}


async function receiveReadyFlowers() {
    const response = await fetch("/ready-flowers");
    const data = await response.json();
    return data;
}

async function updateReadyFlowers() {

    const ready_flowers_div = document.getElementById('ready-flowers');

    readyFlowersData = await receiveReadyFlowers();

    for (var i = 0; i < readyFlowersData.length; i++) {
        const notif = createNotification(readyFlowersData[i]);
        ready_flowers_div.append(notif);
    }
}