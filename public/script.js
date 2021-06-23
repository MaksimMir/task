const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';


class List{
    constructor(url, container, flag = list) {
        this.container = document.querySelector(container);
        this.flag = flag;
        this.url = url;
        this.goods = [];
        this.allProduct = [];
        this._init();
    }

    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(err => {
                throw new Error(`Ошибка ${err.name}`
            )});
    }

    handleData(data) {
        this.goods = [...data];
        this.render();
    }

    calkSum() {
        return this.allProduct.reduce((sum, item) => sum += item.price, 0);
    }

    render() {
        for (const prod of this.goods) {
            const prodObj = new this.flag[this.constructor.name](prod);
            this.allProduct.push(prodObj);
            this.container.insertAdjacentHTML('beforeend', prodObj.render());
        }
    }

    _init() {
        return false;
    }
}

class Item{
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
                    <button class="buy-btn"
                        data-id="${this.id}"
                        data-price="${this.price}"
                        data-name="${this.title}">Купить</button>
                </div>
            </div>
        `
    }
}

class ProductList extends List{
    constructor(cart, container = '.product', url = 'catalogData.json') {
        super(url, container);
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));
    }

    _init() {
        this.container.addEventListener('click', evt => {           
            if (evt.target.classList.contains('buy-btn')) {
                this.cart.addProduct(evt.target);
            }
        })
    }
}

class ProductItem extends Item{}

class Cart extends List{
    constructor(container = '.cart-content', url = 'getBasket.json') {
        super(url, container);
        this.getJson()
            .then(data => this.handleData(data.contents));
        
    }

    addProduct(el) {
        this.getJson(`${API}addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +el.dataset['id'];
                    let find = this.allProduct.find(prod => prod.id == productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let cartProduct = {
                            id_product: productId,
                            price: +el.dataset('price'),
                            product_name: el.dataset('name'),
                            quantity: 1
                        };
                        this.goods = [cartProduct];
                        this.render();
                    }
                } else {
                    console.error('Error');
                }
            })
    }

    removeProduct(el) {
        this.getJson(`${API}addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +el.dataset['id'];
                    let find = this.allProduct.find(prod => prod.id == productId);

                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProduct.splice(this.allProduct.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    console.error('Error');
                }
            })
    }

    _updateCart(prod) {
        const block = document.querySelector(`.cart-item[data-id="${prod.id}"]`);
        block.querySelector('.product-quantity').textContent = `Quantity: ${prod.quantity}`;
        block.querySelector('.product-price').textContent = `Price: $${prod.price * prod.quantity}`;
    }
    
    _init() {
        document.querySelector('.btn').addEventListener('click', evt => {
            document.querySelector('.cart').classList.add('show');
        });

        document.querySelector('.cart').addEventListener('click', evt => {
            document.querySelector('.cart').classList.remove('show');
        })

        this.container.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('del-btn')) {
                this.removeProduct(evt.target);
            }
        })
    }
}


class CartItem extends Item{
    constructor(el, img = '') {
        super(el, img);
        this.quantity = el.quantity;
    }

    render() {
        return `
            <div class="cart-item" data-id="${this.id}">
                <div class="dexc">
                    <h3>${this.title}</h3>
                    <p class="product-price">${this.price}</p>
                    <p class="product-quantity">${this.quantity}</p>
                </div>
                <div class="cart-block">
                    <p class="sum-price">$${this.quantity * this.price}</p>
                    <button class="del-btn" data-id="${this.id}">&times;</button>
                </div>
            </div>
        `
    }
}


const list = {
    ProductList: ProductItem,
    Cart: CartItem
};


let cart = new Cart();
let product = new ProductList(cart); 


console.log()