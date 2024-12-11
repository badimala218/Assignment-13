import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'
import $ from 'jquery';

let PRODUCTS = {
    '1': {id: 1, category: 'Music', price: '$459.99', name: 'Clarinet', instock: true},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello', instock: true},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba', instock: false},
    '4': {id: 4, category: 'Furniture', price: '$799', name: 'Chaise Lounge', instock: true},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Dining Table', instock: true},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bean Bag', instock: true}
};

// document.addEventListener("DOMContentLoaded", () => {
//     //var socket = io();
//     getProducts();
//     //socket.on('product', addProduct);
// });

// function addProduct(product) {
//     PRODUCTS[product.id] = product;
//     console.log(PRODUCTS);
// }

// function getProducts() {
//     // var httpRequest = new XMLHttpRequest();
//     // httpRequest.onreadystatechange = function (data) {
//     //     console.log(data);
//     //     data.forEach(addProduct);
//     // }
//     // httpRequest.open('GET', 'http://localhost:3000/product/get/');
//     // httpRequest.send();
//     console.log('get products');
//     $.get('http://localhost:3001/product/get/', (data) => {
//         console.log(data);
//         data.forEach(addProduct);
//     });
// }

// function postProduct(product, location) {
//     // var httpRequest = new XMLHttpRequest();
//     // httpRequest.open('POST', 'http://localhost:3000/products/' + location + '/' + product.id);
//     // console.log('after open');
//     // httpRequest.setRequestHeader('Content-Type', 'application/json');
//     // httpRequest.send(JSON.stringify(product));
//     $.post('http://localhost:3000/product/' + location + '/' + product.id, product);
// }

function addProduct(product) {
    console.log(product);
    PRODUCTS[product.id] = product.product;
}

function getProducts() {
    // var httpRequest = new XMLHttpRequest();
    // httpRequest.onreadystatechange = function (data) {
    //     data.forEach(addProduct);
    // }
    // httpRequest.open('GET', 'http://localhost:3000/products/get/');
    // httpRequest.send();
    PRODUCTS = {};
    $.get('http://localhost:3000/product/get/', (data) => {
        console.log(data);
        data.forEach(addProduct);
    });
}

  function postProduct(product, location) {
      // var httpRequest = new XMLHttpRequest();
      // httpRequest.open('POST', 'http://localhost:3000/products/' + location + '/' + product.id);
      // console.log('after open');
      // httpRequest.setRequestHeader('Content-Type', 'application/json');
      // httpRequest.send(JSON.stringify(product));
      const path = 'http://localhost:3000/product/' + location + '/' + product.id;
      console.log(path);
      console.log(product);
      $.post(path, product);
  }

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: PRODUCTS
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
        if (!product.id) {
            product.id = new Date().getTime()
        }
        // Add to products
        console.log(product);
        //addProduct(product);
        postProduct(product, 'create');
        console.log(product);
        console.log(PRODUCTS);
        getProducts();
        console.log(PRODUCTS);
        //postProduct(product, 'create');

        this.setState((prevState) => {
            let products = prevState.products
            products = PRODUCTS;
            //products[product.id] = product
            return { products }
        })
    }

    handleDestroy(productId) {
        this.setState((prevState) => {
            let products = prevState.products
            delete products[productId]
            return { products }
        });
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}></ProductTable>
                <ProductForm
                    onSave={this.handleSave}></ProductForm>
            </div>
        )
    }
}

export default Products