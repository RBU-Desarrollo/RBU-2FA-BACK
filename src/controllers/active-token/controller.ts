import { Request, Response } from 'express';
import { getActiveToken, postActiveToken } from '../../services/active-token';
import { connectDB } from '../../services/database/connect';
import { generateActiveToken } from '../../utils/generators';

// Validate token
export const GET = async (req: Request, res: Response) => {
  try {
    const { idUsuario, token } = req.query as {
      idUsuario: string;
      token: string;
    };

    if (!idUsuario || !token)
      return res.status(400).json({ message: 'Missing required fields' });

    const pool = await connectDB();
    const { returnValue } = await getActiveToken({
      pool,
      values: { idUsuario, token }
    });

    if (returnValue === 0)
      return res.status(403).json({ message: 'Token not valid' });

    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create token
export const POST = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.body as {
      idUsuario: string;
    };

    if (!idUsuario)
      return res.status(400).json({ message: 'Missing required fields' });

    const token = generateActiveToken({ sub: idUsuario, name: 'active-token' });

    const pool = await connectDB();

    const { rowsAffected } = await postActiveToken({
      pool,
      values: { idUsuario, token }
    });

    if (rowsAffected[0] === 0)
      return res.status(403).json({ message: 'Token not created' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
