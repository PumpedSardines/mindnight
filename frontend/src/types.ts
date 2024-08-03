export type Nullish<T> = T | null | undefined;
export type ApiRes<T> =
  | { ok: true; msg: string; status: number; payload: T }
  | { ok: false; status: number; msg: string; payload: null };
