import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
const dotenv = require('dotenv');
dotenv.config();
const app = express();


app.get('/', (req, res) => {
  res.send('NAC Auth running');
});
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./routes/route.js')(app);


app.listen(process.env.PORT, () =>
  console.log(`NAC Ecommerce running ${process.env.PORT}!`),
);


