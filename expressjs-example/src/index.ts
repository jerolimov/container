import express from 'express';

const port = process.env.PORT || 3000;

const app = express();

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
