const express = require("express");

const userRouter = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");

userRouter.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  //    check if name, email,password is empty
  if (!name || !email || !password) {
    return res.send({ error: "please add all the fields" });
  }
  // check name should be grater or eaual to 3 character
  if (name.length < 3) {
    return res.send({ error: "name should be at least 3 character" });
  }
  if (password.length < 8) {
    return res.send({
      error: "password should be grater or equal to 8 character",
    });
  }
  if (!email.includes("@")) {
    return res.send({ error: "please enter valid email" });
  }
  //   check if email is existor not
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser != null) {
        return res.send({ error: "user alredy exists" });
      } else if (savedUser == null) {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const storeuser = new User({
              name: name,
              email: email,
              password: hashedPassword,
            });
            storeuser
              .save()
              .then((user) => {
                console.log(user);
                res.send({ message: "user saved successfully" });
              })
              .catch((err) => {
                console.log("while save user to databse");
                console.log(err);
              }); //while saving user to database
          })
          .catch((err) => {
            console.log("while hashing password");
            console.log(err);
          });
      }
    }) //

    .catch((err) => {
      console.log("while searching email in databse");
      console.log(err);
    }); // request was not able to complete some reason // while checking email is present or not
});

userRouter.post("/login",(req,res)=>{
  const{email,password}=req.body
  if ( !email || !password) {
    return res.send({ error: "please add all the fields" });
  }
  if (!email.includes("@")) {
    return res.send({ error: "please enter valid email" });
  }
  User.findOne({email:email})
  .then(
    (savedUser)=>{
      if(savedUser==null){
        return res.send({error:"Email or password is incorrect"})
      }
      let hashedPassword=savedUser.password;
      bcrypt.compare(password,hashedPassword)
      .then(
        (passwordMatched)=>{
         if(passwordMatched==false){
          return res.send({error:"Email or password is incorrect"})
         }
        //  genrate token
        const token=jwt.sign({_id:savedUser._id},"cfjhfkhgl")
         console.log("user logged in sucessfully",savedUser)
         res.send({message:"user logged in sucessfully",token:token})
        }
      )
       .catch(
        (err)=>{
          console.log("while password is wrong in database")
           console.log(err)
        }
       )
    }
  )
  .catch(
    (err)=>{
      console.log("while searching in database")
       console.log(err)
    }
  )
})
module.exports = userRouter;
