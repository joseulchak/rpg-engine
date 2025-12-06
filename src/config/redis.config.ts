import { QueueOptions } from 'bullmq';

export default (): QueueOptions => ({
  connection: {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT),
    password: String(process.env.REDIS_PASS),
  },
});
