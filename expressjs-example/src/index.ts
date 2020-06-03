import express from 'express';

const port = process.env.PORT || 3000;

const app = express();

app.get('/', (_, res) => {
  res.send('Hello World!');
});

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});

const shutdown = () => {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
}

process.on('SIGINT', function() {
  console.log('SIGINT signal received.');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  shutdown();
});
