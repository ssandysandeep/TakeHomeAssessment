import { getMoviesByYear } from './movieService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getMoviesByYear', () => {
  it('should return a list of movies with editors', async () => {
    const mockMovies = [
      { id: 1, title: 'Movie 1', release_date: '2019-01-01', vote_average: 8.0 },
      { id: 2, title: 'Movie 2', release_date: '2019-01-02', vote_average: 7.5 }
    ];

    const mockEditors = [
      { known_for_department: 'Editing', name: 'Editor 1' },
      { known_for_department: 'Editing', name: 'Editor 2' }
    ];

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/discover/movie')) {
        return Promise.resolve({ data: { results: mockMovies } });
      } else if (url.includes('/credits')) {
        return Promise.resolve({ data: { crew: mockEditors } });
      }
      return Promise.reject(new Error('not found'));
    });

    const movies = await getMoviesByYear('2019', 1);

    expect(movies).toEqual([
      {
        title: 'Movie 1',
        release_date: '2019-01-01',
        vote_average: 8.0,
        editors: ['Editor 1', 'Editor 2']
      },
      {
        title: 'Movie 2',
        release_date: '2019-01-02',
        vote_average: 7.5,
        editors: ['Editor 1', 'Editor 2']
      }
    ]);
  });
});
