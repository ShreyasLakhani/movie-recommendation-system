export const addToLikes = async (movieId: string) => {
  const response = await fetch(`/api/likes/${movieId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

export const removeFromLikes = async (movieId: string) => {
  const response = await fetch(`/api/likes/${movieId}`, {
    method: 'DELETE',
  });
  return response.json();
};
