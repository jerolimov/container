import os from 'os';
import express, { Request } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.get('/favicon.ico', (_, res) => res.status(404).send());
app.use(cookieParser());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

const startupTime = new Date();

let calls = 0;

const extractEssentialRequestData = (req: Request) => {
  return {
    call: ++calls,
    uptime: process.uptime(),
    startupTime,
    currentTime: new Date(),
    path: req.path,
    query: req.query,
    headers: req.headers.cookie ? { ...req.headers, cookie: '** PROTECTED **' } : req.headers,
  };
}

const lastCalls: ReturnType<typeof extractEssentialRequestData>[] = [];

app.use((req, _, next) => {
  // Insert at position 0
  lastCalls.splice(0, 0, extractEssentialRequestData(req));
  // Drop everything after position 10
  lastCalls.splice(10);
  next();
});

app.get('/cookies', (req, res) => {
  const cookies: Record<string, string> = req.cookies;
    res.type('json').send(JSON.stringify({
    cookies,
  }, null, 2));
});

app.get('/cookies/set/:name/:value', (req, res) => {
  res.cookie(req.params.name, req.params.value);
  res.redirect('/cookies');
});

app.get('/cookies/clear', (req, res) => {
  const cookies: Record<string, string> = req.cookies;
  Object.keys(cookies).forEach((cookieName) => res.clearCookie(cookieName));
  res.redirect('/cookies');
});

app.get('/cookies/*', (_, res) => {
  res.redirect('/cookies');
});

app.get('/env', (_, res) => {
  const envKeys = Object.keys(process.env);
  res.type('json').send(JSON.stringify(envKeys, null, 2));
});

app.get('/calls', (req, res) => {
  res.type('json').send(JSON.stringify(lastCalls, null, 2));
});

app.get('/*', (req, res) => {
  const hostname = os.hostname();
  res.type('json').send(JSON.stringify({
    hostname,
    lastCalls,
  }, null, 2));
});

export default app;
