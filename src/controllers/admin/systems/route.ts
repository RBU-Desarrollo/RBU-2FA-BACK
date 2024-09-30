import { Request, Response } from 'express';
import { connectDB } from '../../../services/database/connect';
import { insSystem, putSystem } from '../../../services/admin/systems';

export const POST = async (req: Request, res: Response) => {
  try {
    const { nombre, url, imageUrl } = req.body as {
      nombre: string;
      url: string;
      imageUrl: string;
    };

    if (!nombre || !url || !imageUrl) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', created: false });
    }

    const pool = await connectDB();
    const request = await insSystem({
      pool,
      values: { nombre, url, imageUrl }
    });

    if (request.returnValue !== 1) {
      return res
        .status(400)
        .json({ message: 'System already exists', created: false });
    }

    return res.status(200).json({ message: 'System created', created: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', created: false });
  }
};

export const PUT = async (req: Request, res: Response) => {
  try {
    const { idSistema, nombre, url, imageUrl } = req.body as {
      idSistema: number;
      nombre: string;
      url: string;
      imageUrl: string;
    };

    if (!idSistema || !nombre || !url || !imageUrl) {
      return res
        .status(400)
        .json({ message: 'Missing required fields', updated: false });
    }

    const pool = await connectDB();
    const request = await putSystem({
      pool,
      values: { idSistema, nombre, url, imageUrl }
    });

    if (request.returnValue !== 1) {
      return res.status(400).json({
        message: 'System does not exists or name already exists',
        updated: false
      });
    }

    return res.status(200).json({ message: 'System updated', updated: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', updated: false });
  }
};
