const express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.status(200).send({ message: "Server is up & running" });
  });

app.listen(8000);