"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("models", require("./models")); // this creates a single instance of the models and nothing gets messed up
const models = app.get("./models");
const { User, Show, Director } = require("./models");

// middleware stack
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(__dirname + "/public"))

// get all shows
app.get("/shows", (req, res, next) => {
  Show.findAll({ include: [{ model: Director }] })
    .then(shows => {
      res.status(200).json(shows);
    })
    .catch(err => {
      console.log("ooooh", err);
      res.status(500).json({ error: err });
    });
});

// get one show
app.get("/shows/:id", (req, res, next) => {
  Show.findOne({
    raw: true,
    where: { id: req.params.id },
    include: [{ model: Director, attributes: ["name"] }]
  })
    .then(show => {
      res.status(200).json(show);
    })
    .catch(err => {
      console.log("error", err);
      res.status(500).json({ error: err });
    });
});



// add fav for user
app.post("/favorites", ({ body: { UserId, ShowId } }, res, next) => {
  User.findById(UserId).then(foundUser => {
    foundUser.addFavorite(ShowId).then(newRecord => {
      res.status(201).json(newRecord);
    });
  });
});

// update user with fav
app.put("/users/:id", (req, res, next) => {
  User.findById(req.params.id).then(foundUser => {
    const func = req.body.ShowId ? "addFavorite" : "update";
    foundUser[func](req.body.ShowId || req.body).then(item => {
      res.status(201).json(item);
    });
  });
});

// get favorites for a user
app.get("/users/:id/favorites", ({ params: { id } }, res, next) => {
  User.findById(id).then(foundUser => {
    foundUser.getFavorites().then(faves => {
      let userName = foundUser.getFullName();
      const faveObj = { userName, faves };
      res.status(200).send(faves);
    });
  });
});

// director routes
app.post("/directors", (req, res, next) => {
  console.log("req.body", req.body);
  Director.create(req.body).then(data => {
    console.log("New director", data);
    res.json(data);
  });
});


// error handler
app.use((err, req, res, next) => {
    // TODO: write error handler after writing catches for everything
    res.status(err.status || 500)
    res.send(<h1>No routes here - try again!</h1>');
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
