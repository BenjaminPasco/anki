import express, { RequestHandler } from 'express';
import db from '../database/index.js';
import { RunResult } from 'sqlite3';

type Deck = {
  id: string;
  name: string;
};

const isValidCreateDeckInput = ({ name }: { name: unknown }): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  return true;
};

const createDeck: RequestHandler<{}, {}, { name: string }> = async (
  req,
  res,
) => {
  try {
    const { name } = req.body;
    if (!isValidCreateDeckInput({ name })) {
      res.status(400).json({ error: 'Invalid input' });
    }
    const sqlStatement = 'INSERT INTO decks (name) VALUES (?)';
    const runResult = await new Promise<{ success: boolean }>(
      (resolve, reject) => {
        db.run(sqlStatement, [name], (err: Error | null) => {
          if (err) {
            reject(err);
          }
          resolve({ success: true });
        });
      },
    );
    res.status(201).json(runResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create new deck' });
  }
};

const getDecks: RequestHandler<
  {},
  Array<Deck> | { error: string },
  {}
> = async (_, res) => {
  try {
    const decks = await new Promise<Array<Deck>>((resolve, reject) => {
      db.all(
        `
      SELECT id, name
      FROM decks
    `,
        [],
        (err, rows: Array<Deck>) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        },
      );
    });
    res.status(200).json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
};

const deckRouter = express.Router();

deckRouter.post('/', createDeck);
deckRouter.get('/', getDecks);

export { deckRouter };
