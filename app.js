const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Script } = require ("vm");
const app = express();
require('dotenv').config();


const stripe = require("stripe")(process.env.secKey);


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views')) 
app.set("view engine", "ejs");
app.use( express.static( "public" ) );


app.get("/", (req, res) => {
    res.render('home', {
        key:process.env.pubKey
    })
});

app.post('/payment', (req, res) => {
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:"Vaibhav Varunkar",
        address:{
            line1:"223/500 LOL House",
            postal_code:"411026",
            city:"Pune",
            state:"Maharashtra",
            country:"India"
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount:99900,
            description:"A Novel Book",
            currency:"inr",
            customer:customer.id
        })
    })
        .then((charge) => {
            console.log(charge);
            res.render("success");
        })
        .catch((err)=> {
            
            res.send(err);
        })
    })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
});