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
        <div class="selling-item">
            <div class="img-wrapper">
                <img src="" alt="">
            </div>
            <div class="right-wrapper">

                <div class="item-info">
                    <div class="item-content">
                        <a class="title-link" href="">
                            <h3 class="title"></h3>
                        </a>

                        <p class="description"></p>
                    </div>
                    <div class="item-price"></div>
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

    const productHandle = getProductHandle(product);
    
    element.querySelector('.title-link').href = '/html/product.html?' + urlEncode(productHandle);

    element.querySelector('.cart').onclick = async () => {
        await fetch('/cart_products', {
            method: 'POST',
            body: JSON.stringify(productHandle),
            headers: {
                'content-type': 'application/json'
            }
        });
        window.location.href = '/html/shopping_cart.html';
    }
    
    return element;
}

async function retrieveCategories() {
    const res = await fetch('/products');
    return await res.json();
}

function getProductHandle(product) {
    const productHandle = {
        category_name: product.category_name,
        name: product.name,
        seller_id: product.seller_id,
        price: product.price,
    };
    return productHandle;
}

function urlEncode(payload) {
    const components = [];
    for(const key in payload) {
        const component = encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
        components.push(component); 
    }
    return components.join('&');
}