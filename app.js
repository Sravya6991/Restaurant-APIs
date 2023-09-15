const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoURL = "mongodb://127.0.0.1:27017";

// const data = require("./Data");

let db
const app = express()

// middlewares
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'Get, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// get city-loction of restaurant
app.get("/locations", (req, res) => {
    db.collection("locations").find().toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
});

// get quicksearch of mealtypes
app.get("/quicksearch", (req, res) => {
    db.collection("mealtypes").find().toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

// get list of restaurants
app.get("/restaurantsList", (req, res) => {
    db.collection("restaurants").find().toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})

// get restaurants wrt city
app.get("/restaurants", (req, res) => {
    let query = {}
    let stateId = Number(req.query.state_id)
    let mealId = Number(req.query.meal_id)

    if(stateId) {
        query = {state_id: stateId}
    } else if(mealId) {
        query = {"mealTypes.mealtype_id": mealId}
    }

    db.collection("restaurants").find(query).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})

// filter

app.get("/restaurants/:mealId", (req, res) => {
    const mealId = Number(req.params.mealId)
    const cuisineId = Number(req.query.cuisineId)

    const lcost = Number(req.query.lcost)
    const hcost = Number(req.query.hcost)
    let sort = 1
    let page = Number(req.query.page)

    if(Number(req.query.sort)) {
        sort = Number(req.query.sort)
    }

    page = page ? page : 1;
    let itemsPerPage = 2;
    let startIndex = itemsPerPage*page - itemsPerPage;
    let lastIndex = itemsPerPage*page;
    
    // if(req.query.sort) {
    //     sort = {cost: req.query.sort}
    // }

    let query;

    if(mealId) {
        query = {
            "mealTypes.mealtype_id": mealId
        }
    }
    if(mealId && sort<1) {
        query = {
            "mealTypes.mealtype_id": mealId
        }
        sort = sort
    }

    if(mealId && page>1) {
        query = {
            "mealTypes.mealtype_id": mealId
        }
    }

    if(mealId && cuisineId) {
        query = {
            "mealTypes.mealtype_id": mealId,
            "cuisines.cuisine_id": cuisineId
        }
    } else if(mealId && lcost && hcost) {
        query = {
            "mealTypes.mealtype_id": mealId,
            $and: [{cost: {$gte: lcost, $lt: hcost} }]
        }
    } else if(mealId && cuisineId && lcost && hcost) {
        query = {
            "cusines.cuisine_id": cuisineId,
            "mealTypes.mealtype_id": mealId,
            $and: [{cost: {$gt: lcost, $lt: hcost}}]
        }
    }

    // 1 => asc
    // -1 => desc
    
    db.collection("restaurants")
      .find(query)
      .sort({"cost": sort})
      .toArray((err,result) => {
        if(err) throw err
        res.send(result)
        // const filterResponse = result.slice(startIndex, lastIndex)
        // res.send(filterResponse)
        // if(page>1) {
        //     const filterResponse = result.slice(startIndex, lastIndex)
        //     res.send(filterResponse)
        // } else {
        //     res.send(result)
        // }
    })
})


// get details of restaurant
app.get("/details/:id", (req, res)=> {
    const restId = Number(req.params.id)
    db.collection("restaurants")
      .find({restaurant_id: restId})
      .toArray((err, result) => {
        if(err) throw err
        res.send(result)
      })
})


// menu of restaurants
app.get("/menu/:restId", (req, res) => {
    const restId = Number(req.params.restId)

    db.collection("menu")
      .find({restaurant_id: restId})
      .toArray((err, result) => {
        if(err) throw err
        res.send(result)
      })
})


// post menu item details - selection of menu items
app.post("/menuitems", (req, res) => {
    if(Array.isArray(req.body)) {
        db.collection("menu")
          .find({menu_id: {$in: req.body} })
          .toArray((err, result) => {
            if(err) throw err
            res.send(result)
          })
    } else {
        res.send("Invalid input")
    }
})

// place orders - post
app.post("/placeorders", (req, res) => {
    console.log(req.body)
    const query = req.body
    db.collection("orders").insertOne(query, (err, result) => {
        if(err) throw err
        res.send("Order is placed")
    })
})

// orders 
app.get("/orders", (req, res) => {
    db.collection("orders")
      .find()
      .toArray((err, result) => {
        if(err) throw err
        res.send(result)
      })
})

// get orders wrt email
app.get("/order", (req, res) => {
    let query 
    const emailId = req.query.email
    if(emailId) {
        query = {email: emailId}
        db.collection("orders")
          .find(query)
          .toArray((err, result) => {
            if(err) throw err
            res.send(result)
        })
    } else {
        console.log("Invalid email")
    }
})

// update payments
app.put("/updateorders/:id", (req, res) => {
    let oid = Number(req.params.id)
    db.collection("orders")
      .updateOne({orderId: oid}, {$set: {
        status: req.body.status,
        bank_name: req.body.bank,
        date: req.body.date
      },
        },
        (err, result) => {
            if(err) throw err
            res.send("order updated")
        }
    )
})

// delete order
app.delete("/deleteorders/:id", (req, res) => {
    const oid = Number(req.params.id)
    db.collection("orders").deleteOne({orderId: oid}, (err,result) => {
        if(err) throw err
        res.send("Order deleted!!")
    }) 
})

MongoClient.connect(mongoURL, (err, client) => {
    console.log("Mongodb is connected")
    if(err) console.log("Error while connectiong")
    db = client.db("zomato-api");
    app.listen(8000, ()=>{
        console.log("server is running at port: 8000");
    });
})
