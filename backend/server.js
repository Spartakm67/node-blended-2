const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const connectDb = require("../config/connectDb");
require("colors");
const authMiddleware = require("./midelwares/authMiddleware");
const errorHandler = require("./midelwares/errorHandler");
const asyncHandler = require("express-async-handler");
const userModel = require("./models/userModel");
const roleModel = require("./models/roleModel");

const configPath = path.join(__dirname, "..", "config", ".env");

const dotenv = require("dotenv");
dotenv.config({ path: configPath });

const { PORT } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1", require("./routers/alcoRouts"));

//registration: saving new user in database
//аутотентифкація: перевірка даних користувача із тим що зберігається в базі даних
//авторизація: перевірка прав користувача
//логаут: вихід користувача із системи

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    //1.Отримуємо дані від користувача і валідуємо.
    //2.Шукаємо користувача в базі даних. Якщо знайшли: повідомляємо про наявність такого користувача.
    //3.Якщо не знайшли: хешуємо пароль.
    //4.Зберігаємо в базі із захешованим паролем.

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    const candidate = await userModel.findOne({ email });
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashPassword = bcrypt.hashSync(password, 5);
    const roles = await roleModel.findOne({ value: "ADMIN" });
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });

    return res
      .status(201)
      .json({ code: 201, message: "success", data: { email: user.email } });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    //1.Отримуємо дані від користувача і валідуємо.
    //2.Шукаємо користувача в базі даних. Якщо знайшли: розшифровуємо пароль.
    //3.Якщо не знайшли або не розшифрували пароль: видаємо "невірний логін або пароль".
    //4.Генеруємо токен.
    //5.Зберігаємо в базі даних.

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    const user = await userModel.findOne({ email });
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!user || !isValidPassword) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    const token = generateToken({
      friends: ["Spartak", "Ruslan", "Sergyi"],
      id: user._id,
      roles: user.roles,
    });

    user.token = token;

    await user.save();

    return res.status(200).json({
      code: 200,
      message: "success",
      data: {
        email: user.email,
        token: user.token,
      },
    });
  })
);

function generateToken(data) {
  const payload = {
    ...data,
  };
  return jwt.sign(payload, "pizza", { expiresIn: "8h" });
}

app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const id = req.user;
    const user = await userModel.findByIdAndUpdate(id, { token: null });

    return res.status(200).json({
      code: 200,
      message: "Logout success",
      data: {
        email: user.email,
        token: user.token,
      },
    });
  })
);

app.use(errorHandler);

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.blue.bold);
});
