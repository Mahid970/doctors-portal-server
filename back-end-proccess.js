//   \\ SetUp//
// 1.create a file
// 2.npm init -y
// 3. open vs code
// 4. npm i express cors dotenv mongodb jsonwebtoken
// 5. creat  a index.js file
// 6. put this two line in "scripts" of pakage.json---
// {"start": "node index.js",
// "start-dev": "nodemon index.js",}
// 7.create a .env and .ignore file
// 8. "git init" on cmd
// 9. on gitignore file ignore the 'node_modules' and '.env'

// overall index.js code sytex is

// ------------/------------------//
// const express = require("express");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
// --------------------/-----------------------------------//

// .env code sytex
// -------------/--------
// DB_USER=mongodb admin name
// DB_PASS=mongodb password
// ----------/------------

// .gitignore code syntex
// -----/------
// node_modules
// .env
// ---/--------
// pakage.json script syntex
// -----------/--------------------------
// "scripts": {
//     "start": "node index.js",
//     "start-dev": "nodemon index.js",
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
// ----------------------/----------------------------------//

// mongodb setup
// 1.create a new project
// 2.set a admin name and password
// 3. then set the pass and admin name on the .env file (example is in uper code)
// 4. then go network access and give the acces for everyone(practice purpose)
// 5. then go to database section and follow the instraction

//  example code with mongodb (but have to follow the won mongodb projects information)
// this just an example
// ----------------------------/--------------------------//
// const express = require("express");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const cors = require("cors");
// const app = express();
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9x1d7p.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

// async function run() {
//   try {
//     await client.connect();
//     const productcollection = client.db("gears-zone").collection("products");

//     app.get("/products", async (req, res) => {
//       const query = {};
//       const cursor = productcollection.find(query);
//       const products = await cursor.toArray();
//       res.send(products);
//     });
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// -----------------------------//-------------------
