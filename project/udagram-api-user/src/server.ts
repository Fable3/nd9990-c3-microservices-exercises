import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {UserRouter} from './controllers/v0/users/routes/user.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_USER_MODELS} from './controllers/v0/model.index';


(async () => {
  try {
    console.log('authenticate'); // <== to make sure console.log is working and not overrided!
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();
  console.log( `sequelize ok` );

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.url,
  }));

  app.use('/api/v0/users', UserRouter);
  
  // reverse proxy version: (didn't work)
  //app.use('/', UserRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );

  console.log( `start on ${port}` );
  // Start the Server
  app.listen( port, () => {
    console.log( `server running ${config.url}:${port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
