import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {FeedRouter} from './controllers/v0/feed/routes/feed.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_FEED_MODELS} from './controllers/v0/model.index';


(async () => {
  try {
    console.log('authenticate'); // <== to make sure console.log is working and not overrided!
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  await sequelize.addModels(V0_FEED_MODELS);
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

  app.use('/api/v0/feed', FeedRouter);
  
  // production: (didn't work with :8080 port at the end without /)
  //app.use('/', FeedRouter);

  // Root URI call
  /*app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );*/

  console.log( `start on ${port}` );
  // Start the Server
  app.listen( port, () => {
    console.log( `server running on port ${port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
