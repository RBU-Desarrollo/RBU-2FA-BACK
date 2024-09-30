import { Request, Response } from 'express';
import { verifyToken } from '../../../lib/jwt';
import { JwtPayload } from 'jsonwebtoken';

// Validate if user's token is correct
export const GET = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };

    if (!token) return res.status(400).json({ message: 'Missing token' });

    const verifiedToken = verifyToken(token) as JwtPayload;

    if (!verifiedToken)
      return res.status(401).json({ message: 'Invalid token' });

    return res.status(200).json({ idUsuario: verifiedToken.idUsuario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
