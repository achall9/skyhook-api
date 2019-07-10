import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();

app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.status(200).send('Up and running');
});

export default app;
