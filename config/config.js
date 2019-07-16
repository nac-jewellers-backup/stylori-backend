const dotenv = require('dotenv');
dotenv.config();

module.exports={
  local:{
    username:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DATABASE,
    host:process.env.DB_HOST,
    dialect: "postgres"
  },
  staging: {
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    database :  process.env.DATABASE,
    host : process.env.DB_HOST,
    logging: false,
    dialect: "postgres"
  },
  production: {
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    database :  process.env.DATABASE,
    host : process.env.DB_HOST,
    logging:false,
    dialect: "postgres"
  }
}

