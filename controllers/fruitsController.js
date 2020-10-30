const express = require('express');
const router = express.Router();

// const fruits = require('../fruits.js');
const Fruit = require('../models').Fruit;
const User = require('../models').User;
const Season = require('../models').Season;

// Get ==> This is our home page
//and user can click on the url to create a new fruit
router.get("/", (req, res) => {
  console.log("index")
    Fruit.findAll().then((fruits) => {
      res.render("index.ejs", {
        fruits: fruits,
      });
    });
  });

//GET ==> show form to the user
router.get('/new', (req, res) => {
    res.render('new.ejs');
});


//Get ==> Show
router.get("/:id", (req, res) => {
    Fruit.findByPk(req.params.id, {
      include : [
        {
          model: User,
          attributes:["name"],
        }, {
          model: Season,
        }
      ],
      attributes: ["name", "color", "readyToEat"],
    })
    .then((fruit) => {
      res.render("show.ejs", {
        fruit: fruit,
      });
    });
  });


//POST ==> Create a new fruit
router.post("/", (req, res) => {
    if (req.body.readyToEat === "on") {
      req.body.readyToEat = true;
    } else {
      req.body.readyToEat = false;
    }
  
    Fruit.create(req.body).then((newFruit) => {
      res.redirect("/fruits");
    });
  });




  // Delete ==> single object
  router.delete("/:id", (req, res) => {
    Fruit.destroy({ where: { id: req.params.id } }).then(() => {
      res.redirect("/fruits");
    });
  });


  router.get("/:id/edit", function (req, res) {
    Fruit.findByPk(req.params.id).then((foundfruit) => {
      Season.findAll().then((allSeasons) => {
        res.render("edit.ejs", {
          fruit: foundfruit,
          seasons: allSeasons,
        })
      })
    });
  });    

//Put ==> Update the data
router.put("/:id", (req, res) => {
    if (req.body.readyToEat === "on") {
      req.body.readyToEat = true;
    } else {
      req.body.readyToEat = false;
    }
    Fruit.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    }).then((updatedFruit) => {
      Season.findByPk(req.body.season).then((foundSeason) => {
        Fruit.findByPk(req.params.id).then((foundFruit) => {
          foundFruit.addSeason(foundSeason);
          res.redirect("/fruits");
        });
      });
    });
  });



module.exports = router;