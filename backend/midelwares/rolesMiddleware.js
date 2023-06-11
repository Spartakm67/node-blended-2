const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    try {
      const [type, token] = req.headers.authorization.split(" ");
      if (type !== "Bearer") {
        res.status(401);
        throw new Error("Not Bearer token");
      }
      if (!token) {
        res.status(401);
        throw new Error("No token provided");
      }

      const decodedToken = jwt.verify(token, "pizza");

      const userRoles = decodedToken.roles;

      let hasRole = false;
      userRoles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        res.status(403);
        throw new Error("Forbidden");
      }

      next();
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};
