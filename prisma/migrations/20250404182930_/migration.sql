/*
  Warnings:

  - You are about to drop the column `remember_me` on the `users` table. All the data in the column will be lost.
  - Added the required column `oauth_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oauth_provider` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "remember_me",
ADD COLUMN     "oauth_id" TEXT NOT NULL,
ADD COLUMN     "oauth_provider" TEXT NOT NULL;
