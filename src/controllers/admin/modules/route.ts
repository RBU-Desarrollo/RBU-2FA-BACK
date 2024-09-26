import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insModule, putModule } from '../../../services/admin/modules';

export const POST = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body as { nombre: string };

    if (!nombre) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });
    }

    const pool = await connectDB();
    const request = await insModule({ pool, values: { nombre } });

    if (request.returnValue !== 1)
      return res
        .status(400)
        .json({ message: 'Module not created', created: false });

    return res.status(200).json({ message: 'Module created', created: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', created: false });
  }
};

export const PUT = async (req: Request, res: Response) => {
  try {
    const { idModulo, nombre } = req.body as {
      idModulo: number;
      nombre: string;
    };

    if (!idModulo || !nombre) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', updated: false });
    }

    const pool = await connectDB();
    const request = await putModule({
      pool,
      values: { idModulo, nombre }
    });

    if (request.returnValue !== 1) {
      return res.status(400).json({
        message: 'Module does not exists or name already exists',
        updated: false
      });
    }

    return res.status(200).json({ message: 'Module updated', updated: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', updated: false });
  }
};
