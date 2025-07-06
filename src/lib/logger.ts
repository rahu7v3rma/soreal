import chalk from "chalk";

export const logger = {
  now: () => {
    return new Date().toISOString();
  },
  info: (message: string, object?: any) => {
    console.info(chalk.blue(`${logger.now()} - INFO -`), message);
    if (object) {
      console.info(object);
    }
  },
  error: (message: string, error?: any) => {
    console.error(chalk.red(`${logger.now()} - ERROR -`), message);
    if (error) {
      console.error(error);
    }
  },
};
