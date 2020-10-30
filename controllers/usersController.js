const express = require('express');
const router = express.Router();
//const users = require('../users');

const User = require('../models').User;
const Fruit = require('../models').Fruit;

//User Login Homepage
// router.get("/", (req, res) => {
//       res.render("users/index.ejs", {
//     });
//   });

//Get SignUp Form
// router.get('/signup', (req, res) => {
//     res.render('users/signup.ejs');
// });

//Takes user to log in page => GET
// router.get('/login', (req, res) => {
//     res.render('users/login.ejs');
// });



// router.post("/login", (req, res) => {
//     User.findOne({
//       where: {
//         username: req.body.username,
//         password: req.body.password,
//       },
//     }).then((foundUser) => {
//       res.redirect(`profile/${foundUser.id}`);
//     });
//   });

//Create new User from Sign Up => POST
// router.post('/', (req, res) => {
//     User.create(req.body).then((newUser) => {
//         res.redirect(`/users/profile/${newUser.id}`);
//     });
// });


//Take to Users Profile Page, GET USERS PROFILE
router.get("/profile/:id", (req, res) => {
  // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
  if (req.user.id == req.params.id) {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Fruit,
          attributes: ["id", "name"],
        },
      ],
    }).then((userProfile) => {
      res.render("users/profile.ejs", {
        user: userProfile,
      });
    });
  } else {
    // res.json("unauthorized");
    res.redirect("/");
  }
});



  router.put("/profile/:id", (req, res) => {
    User.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    }).then((updatedUser) => {
      res.redirect(`/users/profile/${req.params.id}`);
    });
  });
  


  // Delete a user
  router.delete("/:id", (req, res) => {
    User.destroy({ where: { id: req.params.id } }).then(() => {
      res.redirect("/");
    });
  });
  
module.exports = router;