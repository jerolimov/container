import express from 'express';

const port = process.env.PORT || 3000;

// Create a new express app instance
const app = express();

app.get('/', function (_, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log(`App is listening on port ${port}!`);
});
