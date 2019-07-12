import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./routes/route.js')(app);


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


