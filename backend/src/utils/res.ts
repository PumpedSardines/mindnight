import { Response } from "express";

function resForger<T = any>(res: Response) {
  return (status: number, data: { msg: string; payload?: T }) => {
    res.status(status).send({
      ok: status < 400,
      status: status,
      msg: data.msg,
      payload: data.payload ?? null,
    });
  };
}

export default resForger;
