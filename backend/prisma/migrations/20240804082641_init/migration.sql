/*
  Warnings:

  - Added the required column `stage` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestampNextPhase" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_Game" ("data", "id", "timestampNextPhase") SELECT "data", "id", "timestampNextPhase" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
