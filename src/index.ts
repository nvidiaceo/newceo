/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express, { Application } from 'express';

import mongoose from 'mongoose';

import bodyParser from 'body-parser';

import dotenv from 'dotenv';

import routesV1 from './routes/v1';

dotenv.config();

declare global {
  namespace Express {
    export interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sessionData: any;
    }
  }
}


const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

routesV1(app);

const PORT: number|string = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO!, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('connected to mongodb');
    app.listen(PORT, () => {
      console.log(`running on ${PORT}`);
    });
  })
  .catch(_error => {
    console.log('mongodb error', Error);
  });
