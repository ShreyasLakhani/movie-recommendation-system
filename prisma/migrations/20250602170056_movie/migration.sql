/*
  Warnings:

  - You are about to drop the column `posterPath` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "posterPath",
DROP COLUMN "releaseDate",
ADD COLUMN     "backdrop_path" TEXT,
ADD COLUMN     "genre_ids" INTEGER[],
ADD COLUMN     "poster_path" TEXT,
ADD COLUMN     "release_date" TIMESTAMP(3),
ADD COLUMN     "vote_average" DOUBLE PRECISION,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL;
