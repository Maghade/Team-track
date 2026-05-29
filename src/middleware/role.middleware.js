module.exports = (...roles) => {

  return (req, res, next) => {

    // check role
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    next();

  };

};