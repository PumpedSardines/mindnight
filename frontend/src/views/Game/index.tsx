import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getGame from "@/api/getGame";
import CenterView from "@/components/CenterView";
import Spinner from "@/components/Spinner";
import { io } from "socket.io-client";
import { API_URL, SOCKET_API_URL } from "@/const";
import { Nullish } from "@/types";
import Playing from "./Playing";
import GameOver from "./GameOver";

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) throw new Error("No game ID");

  const playerId = useRef(localStorage.getItem("id")).current;
  const token = useRef(localStorage.getItem("token")).current;
  const kickedAbortController = useRef(new AbortController());

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !playerId) {
      navigate(`/game/${gameId}/join`);
      return;
    }
  }, [gameId, navigate, token, playerId]);

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (!token) return null; // Can't happen
      if (kickedAbortController.current.signal.aborted) return null;

      const res = await getGame(gameId, token);
      if (!res.ok) {
        if (res.status === 403) {
          navigate(`/game/${gameId}/join`);
          return;
        }

        toast.error(res.msg);
        navigate("/");
      }
      return res.payload;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: !!token && !!playerId,
  });

  useEffect(() => {
    const socket = SOCKET_API_URL ? io(SOCKET_API_URL) : io();
    socket.emit("attach", { gameId, playerId, token });
    let id: NodeJS.Timeout;

    socket.on("kick", ({ playerId: kickId }) => {
      if (kickId === playerId) {
        toast.error("You were kicked from the game");
        navigate(`/`);
        kickedAbortController.current.abort();
      }
    });

    socket.on("update", (data: Nullish<{ debounce?: Nullish<number> }>) => {
      const debounce = data?.debounce ?? 0;
      clearTimeout(id);
      console.log("HERE");
      id = setTimeout(() => refetch(), debounce);
    });
    return () => void socket.disconnect();
  }, [gameId, playerId, navigate, token, refetch]);

  if (isLoading) {
    return (
      <CenterView>
        <Spinner />
      </CenterView>
    );
  }

  if (isError || !playerId || !token) {
    return (
      <CenterView>
        <Spinner />
      </CenterView>
    );
  }

  const game = data!;

  switch (game.state) {
    case "lobby":
      return <Lobby playerId={playerId} token={token} game={game} />;
    case "playing":
      return <Playing playerId={playerId} token={token} game={game} />;
    case "game-over":
      return <GameOver playerId={playerId} game={game} />;
  }
};

export default Game;
