import { Request, Response } from 'express';
import { connectDB } from '../database/connect';

export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM dbo.adm_usuarios');

    const data = result.recordset[0];

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
