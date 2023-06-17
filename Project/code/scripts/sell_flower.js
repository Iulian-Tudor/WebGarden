window.onload = () => {
    const formElement = document.querySelector('form');

    formElement.addEventListener('submit', async e => {
        e.preventDefault();

        const data = getFormData(formElement);

        const product = {
            category_name: data.get('category_name'),
            name: data.get('name'),
            price: parseFloat(data.get('price')),
            user_description: data.get('user_description'),
            image_url: data.get('image_url'),
            quantity: parseInt(data.get('quantity')),
            flower_data: {
                season: data.get('season'),
                optimal_parameters: {
                    soil: data.get('soil'),
                    humidity: parseFloat(data.get('humidity')),
                    temperature: parseFloat(data.get('temperature')),
                    water: parseFloat(data.get('water')),
                }
            }
        };

        try {
            const response = await fetch('/products', {
                method: 'POST',
                body: JSON.stringify(product),
                headers: {
                    'content-type': 'application/json'
                }
            });

            const { flower_id } = await response.json();

            window.location.href = `/html/product.html?flower_id=${flower_id}`;
        } catch(e) {
            console.log(e);
        }
    });
}

function getFormData(formElement) {
    const formData = new FormData();

    const props = [
        'category_name',
        'name',
        'price',
        'user_description',
        'image_url',
        'season',
        'soil',
        'humidity',
        'temperature',
        'water',
        'quantity'
    ];

    for(const prop of props) {
        formData.set(prop, formElement.querySelector(`[name="${prop}"]`).value);
    }

    return formData;
}