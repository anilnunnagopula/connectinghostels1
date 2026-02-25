const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, colorize, errors } = format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `${timestamp} ${level}: ${message}\n${stack}`
      : `${timestamp} ${level}: ${message}`;
  }),
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json(),
);

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new transports.Console()],
});

// BetterStack Logs transport (optional — activate by setting BETTERSTACK_SOURCE_TOKEN)
if (process.env.BETTERSTACK_SOURCE_TOKEN) {
  try {
    const { Logtail } = require("@logtail/node");
    const { LogtailTransport } = require("@logtail/winston");
    const logtail = new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN);
    logger.add(new LogtailTransport(logtail));
    logger.info("BetterStack log transport enabled");
  } catch (err) {
    logger.warn("BetterStack transport failed to load: " + err.message);
  }
}

module.exports = logger;
