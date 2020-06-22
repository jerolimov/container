import express from 'express';
import morgan from 'morgan';
import os from 'os';

const app = express();

app.get('/favicon.ico', (_, res) => res.status(404).send());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

const initialState: Record<string, string | undefined> = {
  ready: 'OK',
  live: 'OK',
  startup: 'OK',
};

let healthChecks = initialState;

app.get('/', (_, res) => {
  const data = {
    hostname: os.hostname(),
    healthChecks,
  };
  res.type('json').send(JSON.stringify(data, null, 2));
});

app.get('/reset', (_, res) => {
  healthChecks = initialState;
  const data = {
    hostname: os.hostname(),
    healthChecks,
  };
  res.type('json').send(JSON.stringify(data, null, 2));
});

app.get('/:name', (req, res) => {
  const message = healthChecks[req.params.name];
  const status = message?.trim().toUpperCase() === 'OK' ? 200 : 404;
  const data = {
    status,
    message,
  };
  res.status(status).type('json').send(JSON.stringify(data, null, 2));
});

app.get('/:name/:message', (req, res) => {
  healthChecks[req.params.name] = req.params.message;
  res.redirect(`/${req.params.name}`);
});

export default app;
