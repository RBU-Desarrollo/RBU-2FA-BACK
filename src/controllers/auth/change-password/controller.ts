import { Request, Response } from 'express';
import { comparePasswords } from '../../../lib/bcrypt';
import {
  getUserPassword,
  putUpdatePassword
} from '../../../services/change-password';
import { connectDB } from '../../../services/database/connect';

// Verify user's current password
export const GET = async (req: Request, res: Response) => {
  try {
    const { idUsuario, password } = req.query as {
      idUsuario: string;
      password: string;
    };

    if (!idUsuario || !password)
      return res.status(400).json({ message: 'Missing required data' });

    const pool = await connectDB();

    const resultUser = await getUserPassword({
      pool,
      values: { idUsuario: parseInt(idUsuario) }
    });

    if (!resultUser.recordset[0])
      return res.status(404).json({ message: 'User not found' });

    const user = resultUser.recordset[0];
    const userPassword = user.password;

    const isPasswordValid = await comparePasswords(password, userPassword);

    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid password' });

    return res.status(200).json({ idUsuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the user's password and delete all their recovery instance
export const PUT = async (req: Request, res: Response) => {
  try {
    const { idUsuario, password } = req.body as {
      idUsuario: number;
      password: string;
    };

    if (!idUsuario || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const result = await putUpdatePassword({
      pool,
      values: { idUsuario, password }
    });

    if (result.rowsAffected[0] === 0)
      return res.status(500).json({ message: 'Error updating password' });

    return res.status(200).json({ idUsuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
