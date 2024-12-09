var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var dbUrl = 'mongodb+srv://admin:admin@nodeproject.c2npo.mongodb.net/?retryWrites=true&w=majority&appName=NodeProject';

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Product = mongoose.model('product', {
    id: Number,
    product: {
        productid: Number,
        category: String,
        price: Number,
        name: String,
        instock: Boolean,
    },
});

app.get('/product/get/', (req, res) => {
    Product.find({})
        .then((products) => {
            res.send(products);
        });
});

app.post('/product/create/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    var product = new Product(req.body);

    product.save()
        .then(() => {
            io.emit('product', req.body);
            res.sendStatus(200);
            console.log("Data created or updated");
        })
        .catch((err) => {
            sendStatus(500);
        });
});

app.post('/product/update/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    var product = new Product(req.body);

    Product.findOneAndReplace({ id: req.params.id }, product)
        .then(() => {
            io.emit('product', req.body);
            res.sendStatus(200);
            console.log("Data updated");
        })
        .catch((err) => {
            sendStatus(500);
        });
});

app.post('/product/delete/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params.id);

    Product.deleteOne({ id: req.params.id })
        .then(() => {
            io.emit('product', req.body);
            res.sendStatus(200);
            console.log("Data deleted?");
        })
        .catch((err) => {
            res.sendStatus(500);s
        });
});

io.on('connection', (socket) => {
    console.log('a user is connected');
});

mongoose.connect(dbUrl)
    .then(() => {
        console.log('MongoDB database connection');
    })
    .catch((err) => {
        console.error('MongoDB error', err);
    });

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port);
});