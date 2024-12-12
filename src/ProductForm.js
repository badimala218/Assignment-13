import React, { Component } from 'react'

const RESET_VALUES = {id: '', category: '', price: '', name: '', instock: false}

class ProductForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.state = {
            product: Object.assign({}, RESET_VALUES),
            errors: {},
            changed: false,
        }
    }
        
    static getDerivedStateFromProps(props, state) {
        // To prevent collisions with user typing
        if (state.changed === false) {
            // If autofill set, set product state to autofill 
            if (typeof props.autofill !== 'undefined' && 
                typeof props.autofill.id !== "undefined") {
                let returnProduct = { product: {
                    id: props.autofill.id,
                    name: props.autofill.name,
                    category: props.autofill.category,
                    price: props.autofill.price,
                    instock: props.autofill.instock,
                }};
                return returnProduct;
            }
        }
        return null;
    }

    handleChange(e) {
        const target = e.target
        var value = target.value
        const name = target.name
        if (target.type === "checkbox") {
            value = target.checked;
        }
    
        this.setState((prevState) => {
            prevState.product[name] = value
            return { product: prevState.product, changed: true } 
            // To prevent collisions with autofill
        })
    }

    handleSave(e) {
        this.props.onSave(this.state.product);
        // reset the form values to blank after submitting
        this.setState({
            product: Object.assign({}, RESET_VALUES), 
            errors: {},
            changed: false, // reset 
        })
        // prevent the form submit event from triggering an HTTP Post
        e.preventDefault()
    }

    render () {
        return (
            <form>
                <h4>Add/Update a product</h4>
                <p>
                    <label>Name <br /> 
                    <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.product.name} /></label>
                </p>
                <p>
                    <label>Category <br /> 
                    <input type="text" className="form-control" name="category" onChange={this.handleChange} value={this.state.product.category} /></label>
                </p>
                <p>
                    <label>Price <br /> 
                    <input type="text" className="form-control" name="price" onChange={this.handleChange} value={this.state.product.price} /></label>
                </p>
                <p>
                    <label>In Stock <br /> 
                    <input type="checkbox" className="form-control" name="instock" onChange={this.handleChange} checked={this.state.product.instock}/></label>
                </p>
                <p className="d-none">
                    <label>ID (For Updates Only) <br /> 
                    <input type="text" className="form-control" name="id" onChange={this.handleChange} value={this.state.product.id} /></label>
                </p>
                <div className="btn-group">
                    <input type="submit" className="btn btn-info" value="Save" onClick={this.handleSave} id="save"></input>
                </div>
            </form>
        )
    }
}

export default ProductForm