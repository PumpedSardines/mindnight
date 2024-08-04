/*
  Warnings:

  - You are about to alter the column `timestampNextPhase` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestampNextPhase" BIGINT NOT NULL,
    "state" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_Game" ("data", "id", "state", "timestampNextPhase") SELECT "data", "id", "state", "timestampNextPhase" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
