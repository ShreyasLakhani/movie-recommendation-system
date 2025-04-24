# Movie Recommendation System

A movie recommendation system built with Next.js, React, and the TMDB API. This project allows users to browse popular movies, search for specific movies, and view detailed information about each movie.

## Features

- Browse popular movies
- Search for movies by title
- View detailed information about movies
- Responsive design for all screen sizes

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **API**: TMDB (The Movie Database) API
- **Authentication**: NextAuth.js (planned)
- **Database**: PostgreSQL with Prisma ORM (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- TMDB API key (get one from [TMDB](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-recommendation-system.git
cd movie-recommendation-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your TMDB API key:
```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Next.js app directory
  - `components/`: React components
  - `services/`: API services including TMDB API
  - `movie/[id]/`: Dynamic movie details page
- `prisma/`: Prisma schema and migrations

## Future Enhancements

- User authentication and profiles
- Ability to save favorite movies
- Personalized movie recommendations based on user preferences
- Social features (sharing, comments, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- [Tailwind CSS](https://tailwindcss.com/)
