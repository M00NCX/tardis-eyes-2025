-- CreateTable
CREATE TABLE "Annotation" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planet" TEXT NOT NULL,
    "is_historical" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);
