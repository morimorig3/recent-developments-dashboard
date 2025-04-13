import type { ZennApiResponse } from '../types';

export const getItemsFromZenn = async (count: number) => {
  try {
    const response = await fetch('https://zenn.dev/api/articles');
    const data: ZennApiResponse = await response.json();
    return data.articles.slice(0, count);
  } catch (error) {
    console.error(error);
    return [];
  }
};
