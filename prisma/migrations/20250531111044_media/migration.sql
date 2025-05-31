/*
  Warnings:

  - The values [AUDIO,DOCUMENTARY,INTERVIEW,NEWS,OTHER] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('IMAGE', 'VIDEO');
ALTER TABLE "Media" ALTER COLUMN "mediaType" DROP DEFAULT;
ALTER TABLE "Media" ALTER COLUMN "mediaType" TYPE "MediaType_new" USING ("mediaType"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
ALTER TABLE "Media" ALTER COLUMN "mediaType" SET DEFAULT 'VIDEO';
COMMIT;
