const { connect } = require("mongoose");

async function connectDb() {
  try {
    const db = await connect(process.env.DB_HOST);
    console.log(
      `DataBase is connected. Name: ${db.connection.name}. Host: ${db.connection.host}. Port: ${db.connection.port}`
        .blue.italic.bold
    );
  } catch (error) {
    console.log(error.message.red.bold);
    process.exit(1);
  }
}

module.exports = connectDb;
// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
