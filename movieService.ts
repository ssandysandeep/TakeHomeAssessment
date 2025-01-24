import axios from 'axios';
import { Movie } from './movieTypes';
import { getApiKey } from './authService';

const BASE_URL = 'https://api.themoviedb.org/3';

export const getMoviesByYear = async (year: string, page: number): Promise<Movie[]> => {
  try {
    const apiKey = getApiKey();

    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        primary_release_year: year,
        sort_by: 'popularity.desc',
        page: page
      }
    });

    console.log('Movies response:', response.data); // Log the response

    const movies = response.data.results;

    const movieDetails = await Promise.all(movies.map(async (movie: any) => {
      try {
        const editors = await getMovieEditors(movie.id, apiKey);
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: editors
        };
      } catch (error) {
        console.error(`Error fetching editors for movie ${movie.id}:`, error);
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: []
        };
      }
    }));

    return movieDetails;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

const getMovieEditors = async (movieId: number, apiKey: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: apiKey
      }
    });

    const editors = response.data.crew
      .filter((member: any) => member.known_for_department === 'Editing')
      .map((editor: any) => editor.name);

    return editors;
  } catch (error) {
    console.error('Error fetching movie editors:', error);
    return [];
  }
};
