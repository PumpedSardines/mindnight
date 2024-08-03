import React from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

import styles from "./JoinGame.module.scss";
import Input from "@/components/Input";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@/const";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import canJoinGame from "@/api/canJoinGame";
import { toast } from "react-toastify";
import CenterView from "@/components/CenterView";
import Spinner from "@/components/Spinner";
import joinGame from "@/api/joinGame";

const JoinGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) throw new Error("No game ID");

  const navigate = useNavigate();

  const { isLoading } = useQuery({
    queryKey: ["can-join", gameId],
    queryFn: async () => {
      const res = await canJoinGame(gameId);
      if (!res.ok) {
        toast.error(res.msg);
        navigate("/");
      }
      return null;
    },
  });

  if (isLoading) {
    return (
      <CenterView>
        <Spinner />
      </CenterView>
    );
  }

  return (
    <div className={styles["root"]}>
      <form
        className={styles["form"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const name = data.get("name") as string;
          const adminToken = localStorage.getItem("adminToken") ?? null;
          const res = await joinGame(gameId, name, adminToken);

          if (!res.ok) {
            toast.error(res.msg);
            return;
          }

          localStorage.removeItem("adminToken");
          localStorage.setItem("id", res.payload.playerId);
          localStorage.setItem("token", res.payload.token);
          navigate(`/game/${res.payload.gameId}`);
        }}
      >
        <Logo className={styles["logo"]} />
        <Input
          name="name"
          label="Name"
          required
          maxLength={NAME_MAX_LENGTH}
          minLength={NAME_MIN_LENGTH}
          placeholder="Enter a name"
        />
        <Button fullWidth>Create Game</Button>
      </form>
    </div>
  );
};

export default JoinGame;
