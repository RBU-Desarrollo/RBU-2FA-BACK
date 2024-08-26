import { Request, Response } from 'express';

// Validate if the OTP and the user are correct, then send the user data
export const GET = async (req: Request, res: Response) => {
  try {
    const { codigoUsuario, otp } = req.query;

    if (!codigoUsuario || !otp)
      return res.status(400).json({ message: 'Missing fields' });

    // TODO: Validate if the user exists

    // TODO: Validate if the OTP is correct and it's not expired

    // TODO: Get the user data

    return res.status(200).json({ user: { codigoUsuario } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
