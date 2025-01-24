import { Request, Response } from 'express';
import { getMoviesByYear } from './movieService';

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  const { year, page } = req.query;

  if (!year || !page) {
    res.status(400).json({ error: 'Year and page parameters are required' });
    return;
  }

  try {
    const movies = await getMoviesByYear(year as string, parseInt(page as string));
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};
