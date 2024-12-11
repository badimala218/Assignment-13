var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
var mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");

var dbUrl = 'mongodb+srv://admin:admin@nodeproject.c2npo.mongodb.net/?retryWrites=true&w=majority&appName=NodeProject';

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var products = {
    '1': {id: 1, category: 'Music', price: '$459.99', name: 'Clarinet', instock: true},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello', instock: true},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba', instock: false},
    '4': {id: 4, category: 'Furniture', price: '$799', name: 'Chaise Lounge', instock: true},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Dining Table', instock: true},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bean Bag', instock: true}
};

var corsOptions = {
    origin: "http://localhost:3001"
};

var ProductInfo = mongoose.Schema({
    productid: Number,
    category: String,
    price: String,
    name: String,
    instock: Boolean,
});
var ProductSchema = mongoose.Schema({
    id: Number,
    product: ProductInfo,
});
var Product = mongoose.model("product", ProductSchema);

ProductSchema.pre('save', () => {
    console.log('save', this.name);
});

app.get('/product/get/', (req, res) => {
    Product.find({})
        .then((products) => {
            res.send(products);
        });
});

app.post('/product/create/:id', (req, res) => {
    var newProduct = {
        id: req.body.id,
        product: {
            productid: req.body.id,
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            instock: (req.body.instock === "true")
        }
    };
    var product = new Product(newProduct);
    
    product.save()
        .then(() => {           
            io.emit('message', newProduct);
            res.sendStatus(200);
            console.log("Data created or updated");
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

app.post('/product/update/:id', (req, res) => {
    console.log('update', req);
    Product.findOneAndUpdate({ id: req.params.id }, {
        product: {
            category: req.body.category,
            price: req.body.price,
            name: req.body.name,
            instock: (req.body.instock === "true")
        }
    })
        .then(() => {
            io.emit('message');
            res.sendStatus(200);
            console.log("Data updated");
        })
        .catch((err) => {
            console.log('Error', err);
            res.sendStatus(500);
        });
});

app.post('/product/delete/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params.id);

    Product.deleteOne({ id: req.params.id })
        .then(() => {
            io.emit('message');
            res.sendStatus(200);
            console.log("Data deleted?");
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

io.on('connection', (socket) => {
    console.log('a user is connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

mongoose.set('debug',true);

mongoose.connect(dbUrl)
    .then(() => {
        console.log('MongoDB database connection');
    })
    .catch((err) => {
        console.error('MongoDB error', err);
    });

var server = http.listen(3001, () => {
    console.log('server is listening on port', server.address().port);
});