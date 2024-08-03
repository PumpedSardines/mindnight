import React, { useCallback, useState } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

import styles from "./EnterGameCode.module.scss";
import Input from "@/components/Input";
import TextDivider from "@/components/TextDivider";
import createGame from "@/api/createGame";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import joinGame from "@/api/joinGame";

const EnterGameCode: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = useCallback(async () => {
    setIsLoading(true);
    const res = await createGame();

    if (res.ok) {
      localStorage.setItem("adminToken", res.payload.adminToken);
      navigate(`/game/${res.payload.gameId}/join`);
    } else {
      toast.error(res.msg);
    }
  }, [navigate]);

  return (
    <div className={styles["root"]}>
      <form
        className={styles["form"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const gameId = data.get("code") as string;
          const name = data.get("name") as string;

          const res = await joinGame(gameId, name, null);

          if (!res.ok) {
            toast.error(res.msg);
            return;
          }
          localStorage.setItem("id", res.payload.playerId);
          localStorage.setItem("token", res.payload.token);
          navigate(`/game/${res.payload.gameId}`);
        }}
      >
        <Logo className={styles["logo"]} />
        <div className={styles["inputs"]}>
          <Input
            name="code"
            label="Game Code"
            required
            placeholder="Enter a Game Code"
          />
          <Input required name="name" label="Name" placeholder="Enter a Name" />
        </div>
        <div className={styles["buttons"]}>
          <Button loading={isLoading} fullWidth>
            Join
          </Button>
          <TextDivider text="Or" />
          <Button
            loading={isLoading}
            onClick={handleCreateGame}
            type="button"
            fullWidth
          >
            Create Game
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnterGameCode;
