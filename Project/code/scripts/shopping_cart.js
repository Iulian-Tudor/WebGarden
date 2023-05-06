window.onload = main;

function main() {
    const itemsContainer = document.querySelector('.items');

    const imageUrls = [
        'https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg?w=2000',
        'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'
    ];

    for(let i = 0; i < 4; ++i) {
        const url = imageUrls[i % imageUrls.length];
        const template = `<div class="selling-item">
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
        </div>`;

        itemsContainer.innerHTML += template;
    }

    setupEvents();
    calculateTotal();
}

function removeItem(item) {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.removeChild(item);
    calculateTotal();
}

function setupEvents() {
    const sellingItems = document.querySelectorAll('.selling-item');

    sellingItems.forEach(sellingItem => {
        const deleteButton = sellingItem.querySelector('button.delete');
        deleteButton.addEventListener('click', () => removeItem(sellingItem));
        sellingItem.querySelector('input.quantity').addEventListener('change', calculateTotal);
    });
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