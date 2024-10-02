import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insProfile, putProfile } from '../../../services/admin/profiles';

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
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', created: false });
  }
};

export const PUT = async (req: Request, res: Response) => {
  try {
    const { idPerfil, rol } = req.body as { idPerfil: number; rol: string };

    if (!idPerfil || !rol)
      return res
        .status(400)
        .json({ message: 'Missing required fields', updated: false });

    const pool = await connectDB();
    const request = await putProfile({ pool, values: { idPerfil, rol } });

    if (!request || request.returnValue !== 1)
      return res
        .status(400)
        .json({ message: 'Profile not found', updated: false });

    return res.status(200).json({ message: 'Profile updated', updated: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', updated: false });
  }
};
