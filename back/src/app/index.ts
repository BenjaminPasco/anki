import express from 'express';
import { deckRouter } from '../deck/index.js';

const app = express();

app.use(express.json());

app.use('/decks', deckRouter);

app.get('/', (_, res) => {
  res.send('Hello World 3');
});

export default app;
