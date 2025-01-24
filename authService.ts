import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
export const getApiKey = (): string => API_KEY!;
