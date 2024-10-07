import { Request, Response } from 'express';
import { isDBConnected } from '../../services/database/connect';

export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    const databaseConnected = await isDBConnected();

    return res.json({ connected: databaseConnected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
