import { Request, Response } from 'express';
import { connectDB } from '../../../../services/database/connect';
import { delModule } from '../../../../services/admin/modules';

export const DELETE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', deleted: false });
    }

    const pool = await connectDB();
    const request = await delModule({ pool, values: { id } });

    if (request.returnValue !== 1) {
      return res
        .status(400)
        .json({ message: 'Module not found', deleted: false });
    }

    return res.status(200).json({ message: 'Module deleted', deleted: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', deleted: false });
  }
};
