-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('FILM', 'SERIES');

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageLimit" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "media" TEXT,
    "banner" TEXT,
    "poster" TEXT,
    "trailer" TEXT,
    "titleImage" TEXT,
    "duration" INTEGER,
    "releaseDate" INTEGER NOT NULL,
    "originalTitle" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "media" TEXT,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_url_key" ON "Content"("url");

-- CreateIndex
CREATE INDEX "Content_url_idx" ON "Content"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_title_key" ON "Genre"("title");

-- CreateIndex
CREATE INDEX "Genre_title_idx" ON "Genre"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentGenres_AB_unique" ON "_ContentGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentGenres_B_index" ON "_ContentGenres"("B");

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentGenres" ADD CONSTRAINT "_ContentGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentGenres" ADD CONSTRAINT "_ContentGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
