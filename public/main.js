const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

let main = new Vue({
    el: '.main',
    data: {
        catalogUrl: 'catalogData.json',
        cartUrl: 'getBasket.json',
        products: [],
        catalogImg: 'image/block_img_3.jpg',
        userSearch: '',
        show: false,
        filtered: [],
        goods: [],
        checkProducts: true
    },
    methods: {
        getJson(url) {
            return fetch(url)
                    .then(result => result.json())
                    .catch(err => {
                        this.checkProducts = false;
                        console.log(err);
                    });
        },
        addProduct(prod) {
            this.getJson(`${API}addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = +prod.id_product;
                        let find = this.goods.find(prod => prod.id_product == productId);
                        if (find) {
                            find.quantity++;
                        } else {
                            let cartProduct = {
                                id_product: productId,
                                price: prod.price,
                                product_name: prod.product_name,
                                quantity: 1
                            };
                            this.goods.push(cartProduct);
                        }
                    } else {
                        console.error('Error');
                    }
                })
        }, 
        removeProduct(el) {
            this.getJson(`${API}addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = +el.id_product;
                        console.log(productId);
                        let find = this.goods.find(prod => prod.id_product == productId);
    
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.goods.splice(this.goods.indexOf(find), 1);
                        }
                    } else {
                        console.error('Error');
                    }
                })
        },
        filter() {
            const regExp = new RegExp(this.userSearch, 'ig');
            this.filtered = this.products.filter(prod => {
                return regExp.test(prod.product_name);
            });
        }
    },
    mounted() {
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
 
                for (const el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
            });
        this.getJson(`getProduct.json`)
            .then(data => {
                for (const el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
            }); 
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (const el of data.contents) {
                    this.goods.push(el);
                }
            });   
    },
})