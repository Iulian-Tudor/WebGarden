window.onload = function() {
    const menuButton = document.querySelector(".topbar .menu");
    menuButton.addEventListener('click', e => {
        const sidebar = document.querySelector('.sidebar');
        if(sidebar.classList.contains('sidebar-closed')) {
            sidebar.classList.remove('sidebar-closed');
            sidebar.classList.add('sidebar-open');
        } else {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
        }
    });

    const itemsElement = document.querySelector(".items");

    const imageUrls = [
        'https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg?w=2000',
        'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'
    ];
    

    for(let i = 0; i < 5; ++i) {
        const url = imageUrls[Math.random() * imageUrls.length | 0];

        const template = `
            <div class="selling-item">
                <div class="img-wrapper">
                    <img src="${url}" alt="">
                </div>
                <div class="right-wrapper">

                    <div class="item-info">
                        <div class="item-content">
                            <h3 class="title">
                                Flower title
                            </h3>
                            <p class="description">
                                Lorem ipsum dolor sit amet nesciunt illum magni nisi consectetur eveniet! Error, provident doloremque quos, deleniti corrupti explicabo officia, culpa hic sit totam debitis. Amet.
                            </p>
                        </div>
                        <div class="item-price">$299.99</div>
                    </div>

                    <div class="controls">
                        <button class="watch">
                            <div class="img-wrapper">
                                <img src="icons/eye.png" alt="">
                            </div>
                        </button>
                        <button class="cart">
                            <div class="img-wrapper">
                                <img src="icons/shopping.png" alt="">
                            </div>
                        </button>
                    </div>

                </div>
            </div>
    `;

        itemsElement.innerHTML += template;
    }
}
