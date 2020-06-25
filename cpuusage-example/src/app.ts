import os from 'os';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { formatCPUInfo } from './utils';

const app = express();

app.get('/favicon.ico', (_, res) => res.status(404).send());
app.use(cookieParser());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

app.get('/', (req, res) => {
  const cookies: Record<string, string> = req.cookies;
  res.type('json').send(JSON.stringify({
    hostname: os.hostname(),
    date: new Date(),
    cookies,
    cpu: formatCPUInfo(os.cpus()),
  }, null, 2));
});

app.get('/loop/:time', (req, res) => {
  const time = parseInt(req.params.time);
  if (!time || time < 0 || time > 60000) {
    res.status(400).send('Invalid time');
    return;
  }

  // Run the loop for $time ms to consume cpu
  const start = new Date();
  const waitUntil = Date.now() + time;
  let loops = 0;
  while (Date.now() < waitUntil) {
    loops++;
  }
  const end = new Date();

  const cookies: Record<string, string> = req.cookies;
  res.type('json').send(JSON.stringify({
    hostname: os.hostname(),
    time,
    loops,
    loopsPerMilliseconds: loops / time,
    start,
    end,
    cookies,
    cpu: formatCPUInfo(os.cpus()),
  }, null, 2));
});

export default app;
