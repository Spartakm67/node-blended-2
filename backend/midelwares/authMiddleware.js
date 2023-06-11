const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //1.Отримуємо токен.
  //2.Розшифровуємо токен.
  //3.Якщо токен валідний передаємо інформацію про користувача далі.

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

    req.user = decodedToken.id;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};
