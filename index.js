import logger from 'morgan';
import app from './app';

app.use(logger);

app.listen(3001, () => { 
  console.log('Listening on 3001'); 
});
