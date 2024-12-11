import React, { Component } from 'react'

const RESET_VALUES = {id: '', category: '', price: '', name: '', instock: ''}

class ProductForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.state = {
            product: Object.assign({}, RESET_VALUES),
            errors: {}
        }
    }
        
    handleChange(e) {
        const target = e.target
        var value = target.value
        const name = target.name
        if (target.type === "checkbox") {
            value = target.checked;
        }
        console.log(value);
    
        this.setState((prevState) => {
            prevState.product[name] = value
            console.log('form set state ', prevState.product);
            return { product: prevState.product }
        })
    }

    handleSave(e) {
        console.log(this.state.product);
        this.props.onSave(this.state.product);
        // reset the form values to blank after submitting
        this.setState({
            product: Object.assign({}, RESET_VALUES), 
            errors: {}
        })
        // prevent the form submit event from triggering an HTTP Post
        e.preventDefault()
    }

    render () {
        return (
            <form>
                <h4>Add a new product</h4>
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
                    <input type="checkbox" className="form-control" name="instock" onChange={this.handleChange} /></label>
                </p>
                <input type="submit" className="btn btn-info" value="Save" onClick={this.handleSave} id="save"></input>
            </form>
        )
    }
}

export default ProductForm