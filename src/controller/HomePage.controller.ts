import { Request, Response } from "express";

function Home_Page(req: Request, res: Response) {
  res.send("Hello from Home!");
}

export default Home_Page;
