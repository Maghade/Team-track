const express = require("express");

const router = express.Router();




const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");




const {

  createTask,

  getTasks,

  updateTaskStatus,

} = require("../controllers/task.controller");




router.post(

  "/create",

  authMiddleware,

  roleMiddleware("ADMIN", "MANAGER"),

  createTask

);





router.get(

  "/",

  authMiddleware,

  getTasks

);




router.put(

  "/update-status/:taskId",

  authMiddleware,

  roleMiddleware("MEMBER"),

  updateTaskStatus

);




module.exports = router;