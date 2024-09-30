import { Request, Response } from 'express';
import { connectDB } from '../../services/database/connect';
import { getSystems } from '../../services/systems';
import { formatObjectToCamelCase } from '../../utils/formatters';

// Get all systems
export const GET = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();

    const data = await getSystems({ pool });

    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Systems not found' });

    const systems = data.map((system: any) => formatObjectToCamelCase(system));

    return res.status(200).json(systems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
