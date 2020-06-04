import Koa, { Request } from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router()

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

app.use((ctx, next) => {
  // Insert at position 0
  lastCalls.splice(0, 0, extractEssentialRequestData(ctx.request));
  // Drop everything after position 10
  lastCalls.splice(10);
  next();
});

router.get('/cookies', (ctx) => {
  const cookies = ctx.cookies;
  ctx.response.body = JSON.stringify({
    cookies,
  }, null, 2);
});

router.get('/cookies/set/:name/:value', (ctx) => {
  ctx.cookies.set(ctx.params.name, ctx.params.value);
  ctx.response.redirect('/cookies');
});

router.get('/cookies/clear', (ctx) => {
  const cookies = ctx.cookies;
  Object.keys(cookies).forEach((cookieName) => cookies.set(cookieName));
  ctx.response.redirect('/cookies');
});

router.get('/env', (ctx) => {
  const envKeys = Object.keys(process.env);
  ctx.response.type = 'json';
  ctx.response.body = JSON.stringify(envKeys, null, 2);
});

router.get('/', (ctx) => {
  ctx.response.type = 'json';
  ctx.response.body = JSON.stringify(lastCalls, null, 2);
});

app.use(router.routes());

export default app;
