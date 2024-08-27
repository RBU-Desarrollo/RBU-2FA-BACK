import { Request, Response } from 'express';
import { verifyToken } from '../../../lib/jwt';

// Validate if user's token is correct
export const GET = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };

    if (!token) return res.status(400).json({ message: 'Missing token' });

    const verifiedToken = verifyToken(token);
    console.log(verifiedToken, 'verifiedToken');

    return res.status(200).json({ validated: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
