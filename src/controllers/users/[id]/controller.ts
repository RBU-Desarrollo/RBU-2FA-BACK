import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { getUserById, updateUserById } from '../../../services/users';

// Get user data by id
export const GET = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params as { idUsuario: string };

    if (!idUsuario)
      return res.status(400).json({ message: 'User ID is required' });

    const pool = await connectDB();
    const user = await getUserById({
      pool,
      values: { idUsuario: parseInt(idUsuario) }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update the user data by id
export const PUT = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params as { idUsuario: string };
    const { telefono, direccion } = req.body as {
      telefono: string | null;
      direccion: string | null;
    };

    if (!idUsuario)
      return res.status(400).json({ message: 'User ID is required' });

    const pool = await connectDB();
    const result = await updateUserById({
      pool,
      values: { idUsuario, telefono, direccion }
    });

    if (!result || result.returnValue !== 1)
      return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ updated: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
