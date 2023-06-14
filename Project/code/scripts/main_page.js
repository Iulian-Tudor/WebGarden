window.onload = main;

async function main() {
    await updateProducts();

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

    const filters = await getFilters();

    const sidebarEl = document.querySelector('.sidebar');

    for(const {name, options} of filters) {
        const filterItemEl = constructFilterItem(name, options);
        sidebarEl.appendChild(filterItemEl);
    }

    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', updateProducts);
}

async function updateProducts() {
    const queryData = getQueryData();
    const query = urlEncode(queryData);

    const products = await retrieveProducts(query);
    const itemsElement = document.querySelector(".items");
    itemsElement.innerHTML = '';
    for(const product of products) {
        const element = constructProductElement(product);
        itemsElement.append(element);
    }
}

function getQueryData() {
    const filterItems = document.querySelectorAll('.sidebar .filter-item');

    const queryData = {};

    for(const filterItem of filterItems) {
        const selectEl = filterItem.querySelector('select');
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        if(selectedOption.value === 'default') {
            continue;
        }

        const name = selectEl.name;
        const value = selectedOption.text;
        queryData[name] = value;
    }

    const searchInput = document.querySelector('.searchbar input');
    queryData['name'] = searchInput.value.trim();
    return queryData;
}

async function getFilters() {
    const res = await fetch('/filters');
    return await res.json();
}

function beautifyProperty(property) {
    property = property.replace('_', ' ');
    return property;
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

function constructFilterItem(name, options) {
    const filterItem = document.createElement('div');
    filterItem.classList.add('filter-item');

    const labelEL = document.createElement('label');
    labelEL.htmlFor = name;

    const beautifulName = beautifyProperty(name);
    labelEL.textContent = beautifulName[0].toUpperCase() + beautifulName.slice(1) + ':';
    filterItem.appendChild(labelEL);

    const selectEl = document.createElement('select');
    selectEl.name = name;
    selectEl.id = name;
    filterItem.appendChild(selectEl);

    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 'default';
    defaultOptionEl.text = 'Select ' + beautifyProperty(name);
    selectEl.appendChild(defaultOptionEl);

    for(const option of options) {
        const optionEl = document.createElement('option');
        optionEl.value = option;
        optionEl.text = beautifyProperty(option);
        selectEl.appendChild(optionEl);
    }
    return filterItem;
}

async function retrieveProducts(query) {
    const res = await fetch('/products?' + query);
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