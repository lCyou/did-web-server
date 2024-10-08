const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("static"));
app.use(cors());


app.use("/api/keys", require("./api/key.js"));
app.use("/api/did", require("./api/document.js"));
app.use("/api/testdid", require("./api/testdid.js"));

app.listen(8080, (err) => {
    if (err) {
      console.log("ERROR");
    } else {
      console.log(`Start server.`);
    }
  });