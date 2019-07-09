import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Up and running');
});

export default app;
