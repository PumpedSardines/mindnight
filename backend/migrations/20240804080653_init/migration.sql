-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameData" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");
