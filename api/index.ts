import "dotenv/config";
import { createExpressApp } from "../server/_core/index";

const appPromise = createExpressApp();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
