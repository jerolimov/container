import os from 'os';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.get('/favicon.ico', (_, res) => res.status(404).send());
app.use(morgan(process.env.HTTP_LOG_FORMAT || 'dev'));

app.get('/', (_, res) => {
  const env: Record<string, string | undefined> = process.env;
  const sortedKeys = Object.keys(env);
  sortedKeys.sort();
  const envAsString = sortedKeys.reduce(
    (prev, curr) => prev + curr + '=' + env[curr] + '\n',
    '# ' + new Date() + '\n' + '# hostname: ' + os.hostname() + '\n',
  );
  res.type('text/plain').send(envAsString);
});

export default app;
