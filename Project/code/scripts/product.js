window.onload = async () => {
    const searchParams = new URLSearchParams(window.location.search);

    const res = await fetch('/product?flower_id=' + searchParams.get('flower_id'));
    const product = await res.json();

    document.querySelector('.title').textContent = product.name;
    document.querySelector('.price').textContent = product.price + '$';
    document.querySelector('.description').textContent = product.user_description;
    document.querySelector('.flower-img').src = product.image_url;

    const productHandle = getHandle(product);

    document.querySelector('.cart-btn').onclick = async () => {
        await fetch('/cart_products', {
            method: 'POST',
            body: JSON.stringify(productHandle),
            headers: {
                'content-type': 'application/json'
            }
        });
        window.location.href = '/html/shopping_cart.html';
    }
}

function getHandle(product) {
    return {
        category_name: product['category_name'],
        name: product['name'],
        price: product['price'],
        seller_id: product['seller_id']
    };
}
