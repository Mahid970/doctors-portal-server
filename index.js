const jwt = require("jsonwebtoken");
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l64qdnl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//  JWT verify
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAutthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCES_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const servicecollection = client
      .db("doctors-portal")
      .collection("services");

    const bookingcollection = client
      .db("doctors-portal")
      .collection("bookings");

    const usercollection = client.db("doctors-portal").collection("users");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicecollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/user", verifyJWT, async (req, res) => {
      const users = await usercollection.find().toArray();
      res.send(users);
    });

    app.get("/asmin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usercollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });

    app.put("/user/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const requester = req.decoded.email;
      const requesterAccount = await usercollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await usercollection.updateOne(filter, updateDoc);
        res.send(result);
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    });

    app.put("/user/:email", async (req, res) => {
      const user = req.body;
      const email = req.params.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ result, token });
    });

    // react query
    app.get("/available", async (req, res) => {
      const date = req.query.date;
      const services = await servicecollection.find().toArray();
      const query = { date: date };
      const bookings = await bookingcollection.find(query).toArray();

      services.forEach((service) => {
        const serviceBookings = bookings.filter(
          (book) => book.treatmentName === service.name
        );
        const bookedSlots = serviceBookings.map((book) => book.slot);
        const available = service.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        service.slots = available;
      });
      res.send(services);
    });

    app.get("/booking", verifyJWT, async (req, res) => {
      const email = req.query.email;
      // const authorization = req.headers.authorization;
      // console.log("auth header", authorization);
      const decodedEmail = req.decoded.email;
      if (email === decodedEmail) {
        const query = { email: email };
        const bookings = await bookingcollection.find(query).toArray();
        res.send(bookings);
      } else {
        return res.status(403).send({ message: "forbidden" });
      }
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        treatmentName: booking.treatmentName,
        date: booking.date,
        patientNmae: booking.patientName,
      };
      const exists = await bookingcollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      } else {
        const result = await bookingcollection.insertOne(booking);
        return res.send({ success: true, result });
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("kireeeeee!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
