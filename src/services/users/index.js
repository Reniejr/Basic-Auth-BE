const userRoute = require("express").Router();
const UserModel = require("./model");
const { basicAuth, adminOnly } = require("../../utilites/authTools");

//ENDPOINTS
userRoute.route("/").post(async (req, res, next) => {
  try {
    const newUser = await UserModel(req.body),
      { _id } = await newUser.save();
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

//GET
userRoute.route("/").get(basicAuth, adminOnly, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//GET BY ID
userRoute.route("/profile").get(basicAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

//EDIT BY USER
userRoute.route("/profile").put(basicAuth, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
    res.send(updates);
  } catch (error) {
    next(error);
  }
});

//EDIT BY ADMIN
userRoute
  .route("/admin/:userId")
  .put(basicAuth, adminOnly, async (req, res, next) => {
    try {
      const userId = req.params.userId;
      let body = req.body;
      const editUser = await UserModel.findByIdAndUpdate(userId, body, {
        runValidators: true,
        new: true,
      });
      await editUser.save();
      res.send(editUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

//DELETE BY USER
userRoute.route("/profile").delete(basicAuth, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.send("User Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = userRoute;
