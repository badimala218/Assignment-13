import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'
import $ from 'jquery';
import { io } from 'socket.io-client'

let PRODUCTS = {
    '1': {id: 1, category: 'Music', price: '$459.99', name: 'Clarinet', instock: true},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello', instock: true},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba', instock: false},
    '4': {id: 4, category: 'Furniture', price: '$799', name: 'Chaise Lounge', instock: true},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Dining Table', instock: true},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bean Bag', instock: true}
};

document.addEventListener("DOMContentLoaded", () => {
    var socket = io();
    getProducts();
    socket.on('message', addProduct);
});

function addProduct(product) {
    // Ignore when callback from delete
    if (typeof product !== 'undefined') {   
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
    PRODUCTS = {};
    $.get('http://localhost:3000/product/get/', (data) => {
        data.forEach(addProduct);
    });
}

function postProduct(product, location) {
    const path = 'http://localhost:3000/product/' + location + '/' + product.id;
    $.post(path, product);
}

class Products extends Component {
    constructor(props) {
        super(props)   
        getProducts();   
        this.state = {
            filterText: '',
            autofill: {},
            products: PRODUCTS,
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleUpdateSelection = this.handleUpdateSelection.bind(this)
    }

    componentDidMount() {
        PRODUCTS = {};
        $.get('http://localhost:3000/product/get/', (data) => {
            data.forEach(addProduct);
            this.setState({ products : PRODUCTS })
        });
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
        // Add to database
        if (!product.id) {
            product.id = new Date().getTime();
            postProduct(product, 'create');
        }
        else {
            postProduct(product, 'update');
        }

        this.setState((prevState) => {
            let products = prevState.products
            products[product.id] = product
            return { products, autofill: {} }
        })
    }

    handleUpdateSelection(autofill) {
        this.setState({autofill})
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
                    onDestroy={this.handleDestroy}
                    onUpdate={this.handleUpdateSelection}></ProductTable>
                <ProductForm
                    autofill={this.state.autofill}
                    onSave={this.handleSave}></ProductForm>
            </div>
        )
    }
}

export default Products;