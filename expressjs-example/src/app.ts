import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.use(cookieParser());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

const startupTime = new Date();

let calls = 0;

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

app.get('/*', (req, res) => {
  const currentTime = new Date();
  const uptime = process.uptime();

  res.type('json').send(JSON.stringify({
    calls: ++calls,
    startupTime,
    currentTime,
    uptime,
    request: {
      path: req.path,
      query: req.query,
      headers: req.headers,
    },
  }, null, 2));
});

export default app;
