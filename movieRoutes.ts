import { Router, Request, Response } from 'express';
import { getMovies } from './movieController';

const router = Router();

router.get('/movies', async (req: Request, res: Response) => {
  try {
    await getMovies(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
