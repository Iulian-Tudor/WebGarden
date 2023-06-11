window.onload = async function() {
    await updateProducts();
}

const productsMap = new Map();

async function updateProducts() {
    const itemsContainer = document.querySelector('.items');

    const products = await retrieveCartProducts();

    for(const product of products) {
        const key = JSON.stringify(getProductHandle(product));

        if(productsMap.has(key)) {
            const element = productsMap.get(key)[1];
            element.querySelector('.quantity').value = product.quantity;
            productsMap.set(key, [product, element]);
        } else {
            const element = constructCartProductElement(product);
            itemsContainer.append(element);
            productsMap.set(key, [product, element]);
        }
    }
    calculateTotal();
}

function constructCartProductElement(product) {
    const template = `
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
                <div class="control-item">
                    <label for="quantity">Quantity</label>
                    <input type="number"  name="quantity" class="quantity" value="1" min="1"/>
                </div>
            </div>

            <button class="delete">
                <div class="img-wrapper">
                    <img src="../icons/x_sign.png" alt="">
                </div>
            </button>

        </div>
    `;

    const element = document.createElement('div');
    element.classList.add('selling-item');
    element.innerHTML = template;

    element.querySelector('.img-wrapper img').src = product.image_url;
    element.querySelector('.title').textContent = product.name;
    element.querySelector('.description').textContent = product.user_description;
    element.querySelector('.item-price').textContent = product.price + '$';

    const quantityInput = element.querySelector('.quantity');
    quantityInput.value = product.quantity;
    const key = JSON.stringify(getProductHandle(product));

    let t = null;

    quantityInput.addEventListener('change', () => {
        // TODO: fix glitch
        if(t) {
            clearTimeout(t);
        }

        t = setTimeout(() => {
            const product = productsMap.get(key)[0];
            updateCartProduct(product, parseInt(quantityInput.value));
            t = null;
        }, 300);
        
    });

    const deleteButton = element.querySelector('button.delete');
    deleteButton.addEventListener('click', async () => {
        const product = productsMap.get(key)[0];
        await removeItem(product);
    });

    return element;
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

async function updateCartProduct(product, quantity) {
    const delta = quantity - product.quantity;
    const productHandle = getProductHandle(product);
    productHandle['quantity'] = delta;

    await fetch('/cart_products', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(productHandle)
    });

    await updateProducts();
}

async function retrieveCartProducts() {
    const res = await fetch('/cart_products');
    return await res.json();
}

async function removeItem(product) {
    const key = JSON.stringify(getProductHandle(product));
    const element = productsMap.get(key)[1];
    const itemsContainer = document.querySelector('.items');
    itemsContainer.removeChild(element);
    calculateTotal();

    await fetch('/cart_products', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: key
    })
}

function priceToNumber(price) {
    return parseFloat(price.replace('$', '').trim())
}

function numberToPrice(number) {
    return '$' + number.toFixed(2);
}

function calculateTotal() {
    const itemsContainer = document.querySelector('.items');
    const sellingItems = itemsContainer.querySelectorAll('.selling-item');

    const subtotalValueElement = document.querySelector('.subtotal .value');
    const taxValueElement = document.querySelector('.tax .value');
    const totalValueElement = document.querySelector('.total .value');

    const taxPercent = 0.19;

    let subtotal = 0;

    sellingItems.forEach(sellingItem => {
        const priceElement = sellingItem.querySelector('.item-price');
        const price = priceToNumber(priceElement.textContent);
        const count = parseInt(sellingItem.querySelector('input.quantity').value);
        subtotal += price * count;
    });

    const tax = taxPercent * subtotal;
    const total = subtotal + tax;

    subtotalValueElement.textContent = numberToPrice(subtotal);
    taxValueElement.textContent = numberToPrice(tax);
    totalValueElement.textContent = numberToPrice(total);
}
