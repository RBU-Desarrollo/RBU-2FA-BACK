import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { delProfile } from '../../../../services/admin/profiles';

export const DELETE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id)
      return res
        .status(400)
        .json({ message: 'Missing required fields', deleted: false });

    const pool = await connectDB();
    const request = await delProfile({ pool, values: { id: parseInt(id) } });

    if (!request || request.returnValue !== 1)
      return res
        .status(400)
        .json({ message: 'Profile not found', deleted: false });

    return res.status(200).json({ message: 'Profile deleted', deleted: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', deleted: false });
  }
};
