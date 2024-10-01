import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insProfile } from '../../../services/admin/profiles';

export const POST = async (req: Request, res: Response) => {
  try {
    const { rol } = req.body as { rol: string };

    if (!rol)
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });

    const pool = await connectDB();
    const request = await insProfile({ pool, values: { rol } });

    if (!request || request.returnValue !== 1)
      return res
        .status(400)
        .json({ message: 'Profile already exists', created: false });

    return res.status(201).json({ message: 'Profile created', created: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', created: false });
  }
};
