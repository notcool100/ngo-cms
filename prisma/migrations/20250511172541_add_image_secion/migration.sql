-- CreateTable
CREATE TABLE "ProgramImage" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramImage_programId_idx" ON "ProgramImage"("programId");

-- AddForeignKey
ALTER TABLE "ProgramImage" ADD CONSTRAINT "ProgramImage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
