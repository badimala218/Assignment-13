import React, { Component } from 'react'

class ProductRow extends Component {
    constructor(props) {
        super(props)
        this.destroy = this.destroy.bind(this)
        this.update = this.update.bind(this)
    }

    update() {
        this.props.onUpdate(this.props.product);
    }

    destroy() {
        this.props.onDestroy(this.props.product.id);
    }

    render () {
        return (
            <tr>
                <td>{this.props.product.name}</td>
                <td>{this.props.product.category}</td>
                <td>{this.props.product.price}</td>
                <td>{this.props.product.instock ? "Yes" : "No"}</td>
                <td className="text-right btn-group"><button onClick={this.update} className="btn btn-info pr-">Update</button><button onClick={this.destroy} className="btn btn-info">Delete</button></td>
            </tr>
        )
    }
}

export default ProductRow