import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import {
  loadJSONFile,
  getRecordByID,
  writeJSONFile,
  deleteRecordByID,
  editRecordByID,
} from "../../tools.js";

const blogPostsRouter = express.Router();

const blogPostsJSONFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

// GET /blogPosts => returns the list of authors
blogPostsRouter.get("/", async (req, res) => {
  try {
    res.send(await loadJSONFile(blogPostsJSONFilePath));
  } catch (error) {
    console.log(error);
  }
});

// GET /blogPosts/123 => returns a single author
blogPostsRouter.get("/:blogPostID", async (req, res) => {
  try {
    res.send(await getRecordByID(blogPostsJSONFilePath, req.params.blogPostID));
  } catch (error) {
    console.log(error);
  }
});

// POST /blogPosts => create a new author
blogPostsRouter.post("/", async (req, res) => {
  try {
    let data = await loadJSONFile(blogPostsJSONFilePath);
    let newPost = {
      _id: uniqid(),
      _createdAt: new Date(),
      ...req.body,
    };
    data.push(newPost);
    await writeJSONFile(blogPostsJSONFilePath, data);
    res.status(201).send(`Blog post with ID: ${newPost._id} has been created`);
  } catch (error) {
    console.log(error);
  }
});

// PUT /blogPosts/123 => edit the author with the given id
blogPostsRouter.put("/:blogPostID", async (req, res) => {
  try {
    await editRecordByID(
      blogPostsJSONFilePath,
      req.params.blogPostID,
      req.body
    );
    res.send(`Article with ID: ${req.params.blogPostID} has been changed`);
  } catch (error) {
    console.log(error);
  }
});

// DELETE /blogPosts/123 => delete the author with the given id
blogPostsRouter.delete("/:blogPostID", async (req, res) => {
  try {
    await deleteRecordByID(blogPostsJSONFilePath, req.params.blogPostID);
    res.status(204).send("Deleted");
  } catch (error) {
    console.log(error);
  }
});

export default blogPostsRouter;
