function cx(...args: (string | null | boolean | undefined | number)[]) {
  return args.filter((v) => typeof v === "string").join(" ");
}

export default cx;
