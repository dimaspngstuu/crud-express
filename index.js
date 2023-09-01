const express = require("express");;
const app = express();
const { v4: uuidv4 } = require('uuid');
const Joi = require("joi");


const products = [
    {
        id: "1",
        name: "banana",
        price: 200
    },
    {
        id: "2",
        name: "avocado",
        price: 350
    },
    {
        id: "3",
        name: "grape",
        price: 400
    },
    {
        id: "4",
        name: "orange",
        price: 250
    }
];


app.use(express.json());

//show home page
app.get("/", (req, res) => {
    res.send("<h1>Welcome back with me</h1>"); // send a response to the 
})
//Show list of products
app.get("/api/products", (req,res) =>{
    res.json(products);
})
//show specific product
app.get('/api/products/:id', (req,res) => {
    const {id} = req.params;
    const product = products.find((p) => p.id === id);
    
    if(!product){
        return res.status(404).json({
            message: "No Product Found with this ID"
        })
    } else {
        return res.json(product);
    }
})
//insert a new product
app.post('/api/products', (req,res) => {
    const {error} = validation(req.body);

    if(error){
        res.status(400).json({
            message: error.details[0].message
        })
    } 
    const product = {
        id: uuidv4(),
        name: req.body.name,
        price: req.body.price
    }

    products.push(product);

    res.send(product);
})

//update specific product (using PUT method)
app.put("/api/products/:id", (req, res) => {
    const {error} = validation(req.body);

    if(error){
        res.status(400).json({
            message: error.details[0].message
        })
    } ;


    const index = products.findIndex((k) => k.id === req.params.id);
    if(index === -1){
        return res.status(404).json({
            message: "Product is not found within this ID"
        })
    } 

    products[index].name = req.body.name;
    products[index].price = req.body.price;

    return res.json({
        message: "product was updated"
    });
    
})
//update specific product (using PATCH method)
//delete specific product
//delete All product data


app.listen(8000, (req,res) => {
    console.log("server running in port 8000");
});

const validation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        price: Joi.number().required()
    })

    return schema.validate(body);
}


module.exports = app;