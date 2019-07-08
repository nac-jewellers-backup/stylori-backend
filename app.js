const express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.status(200).send({ message: "Server is up & running on 80" });
  });

app.listen(8000);