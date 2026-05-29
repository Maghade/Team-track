const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");


// ONLY ADMIN
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),

  (req, res) => {

    res.status(200).json({
      message: "Welcome Admin",
    });

  }
);

module.exports = router;