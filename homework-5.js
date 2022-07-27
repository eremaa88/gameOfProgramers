/*

Домашние Задание №5
0. Изучить файл и сравнить с своей реализацией прошлого домашнего задания
0.1. Обратить внимание на обновленную структуру продукта в productList

1. В каждый продукт в .js-product-list > li добавить button
1.1. На кнопку добавить обработчик события на click
1.2. По вызову обработчика события добавить продукты в productCart
1.2.1. Для добавления использовать метод .push(item) - пример: productCart.push(product)
1.3. После того как вы добавили продукт в корзину, нужно отобразить актуальный список продуктов в корзине на странице
1.4. После добавления товаров в productCart нужно обновить значение переменных cartTotal, deliveryTerm

2. Переменная productCart должна всегда быть синхронизирована с localStorage
2.1. При инициализации переменной productCart, ее базовое состояние берем с localStorage
2.2. В случае если localStorage не содержит данных по корзине - инициализируем как пустой массив

(по желанию)
* 3. Сделать как можно меньше манипуляций с DOM
* 3.1. При добавлении в корзину новых товаров не трогать существующие DOM узлы

*/

const exchangeRate = 35.5;
const accessories = {
    case: {
        name: 'case',
        usdPrice: 35,
    },
    quickCharger: {
        name: 'quick-charger',
        usdPrice: 20,
    },
    cable: {
        name: 'cable',
        usdPrice: 15,
    },
    protectionGlass: {
        name: 'protection-glass',
        usdPrice: 20,
    },
};

const productList = [
    {
        id: 'iphone-13',
        name: 'iPhone 13',
        usdPrice: 749,
        stockStatus: 'in-stock',
        specialOffer: null,
    },
    {
        id: 'iphone-13-pro',
        name: 'iPhone 13 Pro',
        usdPrice: 999,
        stockStatus: 'in-stock',
        specialOffer: null,
    },
    {
        id: 'iphone-13-pro-max',
        name: 'iPhone 13 Pro Max',
        usdPrice: 1099,
        stockStatus: 'out-of-stock',
        specialOffer: null,
    },
    {
        id: 'iphone-14',
        name: 'iPhone 14',
        usdPrice: 1299,
        stockStatus: 'pre-order',
        specialOffer: null,
    },
    {
        id: 'iphone-14-pro',
        name: 'iPhone 14 Pro',
        usdPrice: 1599,
        stockStatus: 'pre-order',
        specialOffer: null,
    },
    {
        id: 'iphone-14-pro-max',
        name: 'iPhone 14 Pro Max',
        usdPrice: 1699,
        stockStatus: 'pre-order',
        specialOffer: null,
    },
];

function calculateUahPrice(usdPrice) {
    return exchangeRate * usdPrice;
}

function createSpecialOffer(product) {
    let accessoryList = [];
    let accessoriesDiscount = 0;

    if (product.name.includes('Pro Max')) {
        accessoriesDiscount = 0.1;
        accessoryList = [accessories.case, accessories.quickCharger];
    } else if (product.name.includes('Pro')) {
        accessoriesDiscount = 0.15;
        accessoryList = [accessories.case];
    }

    const accessoriesPrice = calculateAccessoriesPrice(accessoryList);
    const specialOfferUsdPrice = product.usdPrice + accessoriesPrice;
    const specialOfferDiscountUsdPrice = product.usdPrice + accessoriesPrice * (1 - accessoriesDiscount);
    return {
        accessories: accessoryList,
        usdPrice: specialOfferUsdPrice,
        uahPrice: calculateUahPrice(specialOfferUsdPrice),
        discountUsdPrice: specialOfferDiscountUsdPrice,
        discountUahPrice: calculateUahPrice(specialOfferDiscountUsdPrice),
    };
}

function calculateAccessoriesPrice(accessories) {
    let accessoriesPrice = 0;
    for (let accessory of accessories) {
        accessoriesPrice = accessoriesPrice + accessory.usdPrice;
    }

    return accessoriesPrice
}

function calculateCartTotal(productCart) {
    const deliveryPrice = 8;

    let cartTotal = 0;
    for (let product of productCart) {
        cartTotal = product.usdPrice;
    }

    cartTotal = cartTotal < 1000 ? cartTotal : cartTotal + deliveryPrice;
    return cartTotal;
}

const deliveryTerms = {
    'stock': 0,
    'pre-order': 2,
    'out-of-stock': 14,
};

function calculateDeliveryTerm(productCard) {
    let deliveryTerm = 0;
    for (let product of productCard) {
        const productDeliveryTerm = deliveryTerms[product.stockStatus];
        if (deliveryTerm < productDeliveryTerm) {
            deliveryTerm = productDeliveryTerm;
        }

        if (deliveryTerm === deliveryTerms['out-of-stock']) {
            break;
        }
    }

    return deliveryTerm;
}

for (let product of productList) {
    product.uahPrice = calculateUahPrice(product.usdPrice);
    product.specialOffer = createSpecialOffer(product);
}

const productCart = JSON.parse(localStorage.getItem('productCart')) || [];

let cartTotal = calculateCartTotal(productCart);
let deliveryTerm = calculateDeliveryTerm(productCart);



function createProductListEls(productList) {
    const productEls = [];

    for (const product of productList) {
        const productEl = document.createElement('li');
        const productNameEl = document.createElement('h3');
        const productPriceEl = document.createElement('div');
        const productStockStatusEl = document.createElement('div');
        const addToCartButtonEl = document.createElement('button');

        productNameEl.textContent = product.name;
        productPriceEl.textContent = 'Usd Price: ' + product.usdPrice;
        productStockStatusEl.textContent = 'Stock Status: ' + product.stockStatus;
        addToCartButtonEl.textContent = 'Add to cart';

        productEl.append(productNameEl, productPriceEl, productStockStatusEl, addToCartButtonEl);
        productEls.push(productEl);

        addToCartButtonEl.addEventListener('click', function () {
            const jsProductCartEl = document.querySelector('.js-product-cart');
            const newProductCartEl = createProductCartEl(product);

            jsProductCartEl.appendChild(newProductCartEl);
            productCart.push(product);

            localStorage.setItem('productCart', JSON.stringify(productCart));



        })

    }

    return productEls;
}

function createProductCartEls(productCart) {
    const productCartEls = [];

    for (const product of productCart) {
        const productCartEl = createProductCartEl(product);
        productCartEls.push(productCartEl);
    }

    return productCartEls;
}

function createProductCartEl(product) {
    const productEl = document.createElement('li');
    const productNameEl = document.createElement('h3');
    const productUsdPriceEl = document.createElement('div');
    const productUahPriceEl = document.createElement('div');

    productNameEl.textContent = product.name;
    productUsdPriceEl.textContent = 'USD Price: ' + product.usdPrice;
    productUahPriceEl.textContent = 'UAH Price: ' + product.uahPrice;
    productEl.append(productNameEl, productUsdPriceEl, productUahPriceEl);

    return productEl;

}

(function render() {
    const productListEl = document.querySelector('.js-product-list');
    const productCardEl = document.querySelector('.js-product-cart');
    const productCartTotalEl = document.querySelector('.js-product-cart-total');
    const deliveryTermEl = document.querySelector('.js-delivery-term');
    const productListEls = createProductListEls(productList);
    const productCartEls = createProductCartEls(productCart);

    productCartTotalEl.textContent = `${cartTotal} USD`;
    deliveryTermEl.textContent = `${deliveryTerm} day(s)`;

    productListEl.append(...productListEls);
    productCardEl.append(...productCartEls);


})();







