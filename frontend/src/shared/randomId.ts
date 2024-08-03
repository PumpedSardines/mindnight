function randomId(len = 256) {
  const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += pool[Math.floor(Math.random() * pool.length)];
  }
  return id;
}

export default randomId;
