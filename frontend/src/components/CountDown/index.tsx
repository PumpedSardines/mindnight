import React, { useEffect, useState } from "react";

type CountDownProps = {
  timestamp: number;
  onTick?: (time: number) => void;
};

const CountDown: React.FC<CountDownProps> = (props) => {
  const { timestamp } = props;
  const [time, setTime] = useState(timestamp);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        const currentTimeStamp = Date.now();
        const timeLeft = timestamp - currentTimeStamp;
        const newTime = Math.max(Math.floor(timeLeft / 1000), 0);

        if (newTime != time) {
          props.onTick?.(newTime);
        }

        return newTime;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [timestamp, props]);

  return <>{time}</>;
};

export default CountDown;
