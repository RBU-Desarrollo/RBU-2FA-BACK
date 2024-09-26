import { Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../../services/database/connect';
import { hashPassword } from '../../lib/bcrypt';

export const PLEASE_WORK = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const result1 = await pool.request().execute('fa_procMIGGetUsers');

    await Promise.all(
      result1.recordset.map(async (user: any) => {
        const hashedPassword = await hashPassword(user.hashed_password);

        await pool
          .request()
          .input('id_usuario', sql.Int, user.id_usuario)
          .input('password', sql.VarChar(255), hashedPassword)
          .execute('fa_procMIGPutPassword');
      })
    );

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
