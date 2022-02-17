const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const UserModel = require("../models/user/User");

//create user
router.post("/", async (req, res) => {
  const userInstance = new UserModel(req.body);
  try {
    await userInstance.save();
    const token = await userInstance.generateAuthToken();
    res.status(201).json({ userInstance, token });
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
});
//Login user
router.post(`/login`, async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get user - We get the user from auth middleware
router.get("/myprofile", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
