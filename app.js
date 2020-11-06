import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import {postgraphile, makePluginHook} from 'postgraphile';
//import Myusers from '../controller/sortbyprice.js';
const MySchemaExtensionPlugin = require('./controller/sortbyprice.js');
const user = require('./controller/notify/Emailtemplate');

const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'staging';
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PgOrderByRelatedPlugin = require("@graphile-contrib/pg-order-by-related");

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

 app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
// const config = {
//     user: 'mac',
//     password: '12345',
//     host: 'localhost',
//     db: 'NAC_product_upload',
//     table: 'trans_sku_lists'
// }

// const connectionstring =`postgres://${config.user}:${config.password}@${config.host}/${config.db}`;
// const pgclient = new pg.Client(connectionstring)
// pgclient.connect();

// const query = pgClient.query('newsaleevent')

// pgClient.on('notification', async(data) => {
//   const payload = JSON.parse(data.payload);
//   console.log('row added!', payload);
// });

app.get('/', (req, res) => {
  console.log("running")
  res.send('NAC Auth running');
});
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./routes/route.js')(app);

//Configuring postgraphile middleware
let connString;
console.log("dasd")
console.log(process.env.LOCAL_DB_PORT)
// if(dotenv === "local")
// {
  // connString={
  //   host:process.env.LOCAL_DB_HOST,
  //   user:process.env.LOCAL_DB_USER,
  //   password:process.env.LOCAL_DB_PASS,
  //   database:process.env.LOCAL_DB,  
  //   port:process.env.LOCAL_DB_PORT      
  // }
// }else{
  connString={
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DATABASE,  
    port:process.env.DB_PORT      
   }
// }


app.use(postgraphile(connString,{
    graphiql:true,  
    live: true,

    appendPlugins: [MySchemaExtensionPlugin, ConnectionFilterPlugin, PgOrderByRelatedPlugin],
    graphileBuildOptions: {
      connectionFilterRelations: true,

       // default: false
    },
    // ownerConnectionString: `postgres://${connString.user}:${connString.password}@${connString.host}/${connString.database}`,
     
}));


app.listen(process.env.PORT, () =>
  console.log(`NAC Ecommerce unning ${process.env.PORT}!`),
);


