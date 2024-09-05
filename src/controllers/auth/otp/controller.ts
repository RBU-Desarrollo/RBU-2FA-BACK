import { Request, Response } from 'express';
import { getUserById, putLastAccessDate } from '../../../services/auth';
import { connectDB } from '../../../services/database/connect';
import { formatObjectToCamelCase } from '../../../utils/formatters';
import { delOTPCode, getOTPCode } from '../../../services/otp';
import { generateToken } from '../../../lib/jwt';

// Validate if the OTP and the user are correct, then send the user data and token
export const GET = async (req: Request, res: Response) => {
  try {
    const { idUsuario, otp } = req.query;

    if (!idUsuario || !otp)
      return res.status(400).json({ message: 'Missing fields' });

    const pool = await connectDB();

    const resultUser = await getUserById({
      pool,
      values: { idUsuario: parseInt(idUsuario as string) }
    });

    if (resultUser.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = formatObjectToCamelCase(resultUser.recordset[0]);

    const resultOtp = await getOTPCode({
      pool,
      values: { idUsuario: user.idUsuario, otp: parseInt(otp as string) }
    });

    if (resultOtp.recordset.length === 0)
      return res.status(401).json({ message: 'Invalid OTP' });

    const isOTPDeleted = await delOTPCode({
      pool,
      values: { idUsuario: user.idUsuario }
    });

    if (!isOTPDeleted)
      return res.status(500).json({ message: 'Internal server error' });

    const token = generateToken(user.idUsuario);

    await putLastAccessDate({ pool, values: { idUsuario: user.idUsuario } });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
