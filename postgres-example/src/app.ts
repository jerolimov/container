import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import db from './db';

const app = express();

app.get('/favicon.ico', (_, res) => res.status(404).send());
app.use(cookieParser());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

app.get('/ready', async (_, res, next) => {
  try {
    await db.testConnection();
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
});

app.get('/', async (_, res, next) => {
  try {
    const result = await db.values.getAll();

    res.type('json').send(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    return next(error);
  }
});

app.get('/:name', async (req, res, next) => {
  try {
    const value = await db.values.getValue(req.params.name);

    if (value) {
      res.type('json').send(JSON.stringify(value, null, 2));
    } else {
      res.status(404).send();
    }
  } catch (error) {
    return next(error);
  }
});

app.get('/:name/:value', async (req, res, next) => {
  try {
    const value = await db.values.upsert(req.params.name, req.params.value);

    res.status(201).type('json').send(JSON.stringify(value, null, 2));
  } catch (error) {
    return next(error);
  }
});

export default app;
