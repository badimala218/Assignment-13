import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'
// import client from './client.js'
import $ from 'jquery';
import { io } from 'socket.io-client'

export let PRODUCTS = {
    '1': {id: 1, category: 'Music', price: '$459.99', name: 'Clarinet', instock: true},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello', instock: true},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba', instock: false},
    '4': {id: 4, category: 'Furniture', price: '$799', name: 'Chaise Lounge', instock: true},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Dining Table', instock: true},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bean Bag', instock: true}
};

document.addEventListener("DOMContentLoaded", () => {
    var socket = io();
    console.log(socket);
    getProducts();
    socket.on('message', addProduct);
});

function addProduct(product) {
    console.trace();
    console.log('add ', product);
    console.log('add products', PRODUCTS);
    if (typeof product !== 'undefined') {   //When delete
        PRODUCTS[product.id] = {      
            id: product.id,
            category: product["product"].category,
            name: product['product'].name,
            price: product['product'].price,
            instock: (product['product'].instock === true)
        };
    }
}

function getProducts() {
    console.log('before get ', PRODUCTS);
    PRODUCTS = {};
    $.get('http://localhost:3000/product/get/', (data) => {
        data.forEach(addProduct);
        console.log('after get ', PRODUCTS);
    });
}

function postProduct(product, location) {
    const path = 'http://localhost:3000/product/' + location + '/' + product.id;
    console.log(path);
    console.log(product);
    $.post(path, product);
}

class Products extends Component {
    constructor(props) {
        super(props)   
        getProducts();   
        this.state = {
            filterText: '',
            products: PRODUCTS
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        console.log('before get ', PRODUCTS);
        PRODUCTS = {};
        $.get('http://localhost:3000/product/get/', (data) => {
            data.forEach(addProduct);
            console.log('after get ', PRODUCTS);
            this.setState((prevState) => {
                let products = PRODUCTS
                return { products }
            })
        });
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
        if (!product.id) {
            product.id = new Date().getTime()
        }
        // Add to products
        postProduct(product, 'create');

        this.setState((prevState) => {
            let products = prevState.products
            products[product.id] = product
            return { products }
        })
    }

    handleUpdate(product) {
        console.log('update',product);
        // Update to database
        postProduct(product, 'update');

        this.setState((prevState) => {
            let products = prevState.products
            products[product.id] = product
            return { products }
        })
    }

    handleDestroy(productId) {
        // Remove from database
        postProduct({ id: productId }, 'delete');
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
                    onSave={this.handleSave}
                    onUpdate={this.handleUpdate}></ProductForm>
            </div>
        )
    }
}

export default Products;