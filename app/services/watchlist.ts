import { Movie } from './movies'

export async function addToWatchlist(movieId: number): Promise<Movie[]> {
  const res = await fetch('/api/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add to watchlist');
  }
  // returns the updated array of movies in your watchlist
  return res.json() as Promise<Movie[]>;
}

export async function removeFromWatchlist(movieId: number): Promise<Movie[]> {
  const res = await fetch(`/api/watchlist/${movieId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to remove from watchlist');
  }
  return res.json() as Promise<Movie[]>;
}
