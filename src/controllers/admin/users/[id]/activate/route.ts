import { Request, Response } from 'express';
import { connectDB } from '../../../../../services/database/connect';
import { activateUser } from '../../../../../services/admin/users';

export const PUT = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ message: 'Missing fields', activated: false });

    const pool = await connectDB();

    const request = await activateUser({
      pool,
      values: { idUsuario: parseInt(id) }
    });

    if (!request || request.returnValue !== 1)
      return res
        .status(404)
        .json({ message: 'User not found', activated: false });

    return res
      .status(200)
      .json({ message: 'User activated successfully', activated: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', activated: false });
  }
};
