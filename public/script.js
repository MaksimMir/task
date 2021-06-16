const catalogAPI = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json';
const cartAPI = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json';


class GetProducts{
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
    }
    _getProducts(api) {
        return fetch(api)
                    .then(result => result.json())
                    .catch(error => {
                        console.log(error);
                    })
    }
}

class ProductList extends GetProducts{
    constructor(container) {
        super(container);
        this._getProducts(catalogAPI)
            .then(data => {
                this.goods = [...data];
                this.render();
            });
    }

    render() {
        for (const prod of this.goods) {
            const prodObj = new ProductItem(prod);

            this.container.insertAdjacentHTML('beforeend', prodObj.render());
        }
    }
}

class CartList extends GetProducts{
    constructor(container) {
        super(container);
        this._getProducts(cartAPI)
            .then(data => {
                this.goods = [...data.contents];
                this.render();
            });
        
    }
    
    render() {
        for (const prod of this.goods) {
            const prodObj = new CartPopUp(prod);

            this.container.insertAdjacentHTML('beforeend', prodObj.render());
        }
    }

    init() {
        console.log(this.goods);
    }
}

class CartPopUp{
    constructor(product) {
        this.title = product.product_name;
        this.price = product.price;
        this.count = product.quantity;
    }

    render() {
        return `
            <div class="cart-item">
                <div class="dexc">
                    <h3>${this.title}</h3>
                    <p>${this.price}</p>
                    <p>${this.count}</p>
                </div>
            </div>
        `
    }
}

class ProductItem{
    constructor(product, img = 'image/block_img_3.jpg') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }

    render() {
        return `
            <div class="product-item" data-card-id="${this.id}">
                <img src="${this.img}" alt="some img">
                <div class="dexc">
                    <h3>${this.title}</h3>
                    <p>${this.price}</p>
                    <button class="buy-btn" data-id="${this.id}">Купить</button>
                </div>
            </div>
        `
    }
}

let list = new ProductList('.product'); 

const cart = document.querySelector('.cart');
const btn = document.querySelector('.btn');
const content = document.querySelector('.cart-content');

btn.addEventListener('click', () => {
    cart.classList.add('show');
    let cartList = new CartList('.cart-content');
})

cart.addEventListener('click', () => {
    cart.classList.remove('show');
    content.innerHTML = '';
})

