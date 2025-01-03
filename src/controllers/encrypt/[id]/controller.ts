import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { getUserById } from '../../../services/users';

// Obtener datos encriptados
export const GET = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params as { idUsuario: string };

    if (!idUsuario)
      return res.status(400).json({ message: 'User ID is required' });

    const pool = await connectDB();
    let user = await getUserById({
      pool,
      values: { idUsuario: parseInt(idUsuario) }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
