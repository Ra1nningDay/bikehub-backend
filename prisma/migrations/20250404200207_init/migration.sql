-- CreateTable
CREATE TABLE "motorbike_unit" (
    "id" SERIAL NOT NULL,
    "motorbike_id" INTEGER NOT NULL,
    "license_plate" TEXT NOT NULL,
    "color" TEXT,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorbike_unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motorbike_unit_license_plate_key" ON "motorbike_unit"("license_plate");

-- AddForeignKey
ALTER TABLE "motorbike_unit" ADD CONSTRAINT "motorbike_unit_motorbike_id_fkey" FOREIGN KEY ("motorbike_id") REFERENCES "motorbikes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
