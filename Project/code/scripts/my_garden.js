window.onload = function(){
    const popupElement = document.querySelector(".flower-details-container");
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener('click', e => {
        if(popupElement.classList.contains("popup-open")){
            popupElement.classList.remove("popup-open");
            popupElement.classList.add("popup-closed");
        }
        else{
            popupElement.classList.remove("popup-closed");
            popupElement.classList.add("popup-open");
        }
    });

    const actionButtons = document.querySelectorAll(".notification-button");
    actionButtons.forEach(button => {
        button.addEventListener("click", e =>{
            popupElement.classList.remove("popup-closed");
            popupElement.classList.add("popup-open");
        })
    })
}