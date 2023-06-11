window.onload = async function() {
    const categories = await retrieveCategories();

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

    for(const category of categories) {
        for(const product of category.products) {
            const element = constructProductElement(product);
            itemsElement.append(element);
        }
    }
}

function constructProductElement(product) {
    const template = `
        <div class="selling-item" onclick="window.location.href='product.html'">
            <div class="img-wrapper">
                <img src="" alt="">
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
                            <img src="../icons/eye.png" alt="">
                        </div>
                    </button>
                    <button class="cart">
                        <div class="img-wrapper">
                            <img src="../icons/shopping.png" alt="">
                        </div>
                    </button>
                </div>

            </div>
        </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = template;

    element.querySelector('.img-wrapper img').src = product.image_url;
    element.querySelector('.title').textContent = product.name;
    element.querySelector('.description').textContent = product.user_description;
    element.querySelector('.item-price').textContent = product.price + '$';
    
    return element;
}

async function retrieveCategories() {
    const res = await fetch('/products');
    return await res.json();
}
