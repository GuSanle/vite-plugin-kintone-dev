import chalk from "chalk";

const prefix = `${chalk.greenBright("[vite-plugin-kintone-dev]")}`;

export default Object.freeze({
  error: (err: string) => {
    console.error(`${prefix}: ${chalk.redBright(err)}`);
  },

  warn: (msg: string) => {
    console.error(`${prefix}: ${chalk.yellowBright(msg)}`);
  },

  info: (msg: string) => {
    console.info(`${prefix}: ${chalk.greenBright(msg)}`);
  },
});
