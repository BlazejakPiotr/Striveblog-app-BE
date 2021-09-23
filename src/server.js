import express from "express";
import cors from "cors";
import authorsRouter from "./services/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./services/blogPosts/index.js";

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server running on " + port);
  3;
});
