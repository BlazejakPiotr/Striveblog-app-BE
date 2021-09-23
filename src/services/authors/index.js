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

const authorsRouter = express.Router();

const authorsJSONFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

// GET /authors => returns the list of authors
authorsRouter.get("/", async (req, res) => {
  try {
    res.send(await loadJSONFile(authorsJSONFilePath));
  } catch (error) {
    console.log(error);
  }
});

// GET /authors/123 => returns a single author
authorsRouter.get("/:authorID", async (req, res) => {
  try {
    res.send(await getRecordByID(authorsJSONFilePath, req.params.authorID));
  } catch (error) {
    console.log(error);
  }
});

// POST /authors => create a new author
authorsRouter.post("/", async (req, res) => {
  try {
    let data = await loadJSONFile(authorsJSONFilePath);
    let validateEmail = data.find((e) => req.body.email === e.email);
    if (!validateEmail) {
      let newAuthor = {
        _id: uniqid(),
        _createdAt: new Date(),
        ...req.body,
      };
      data.push(newAuthor);
      await writeJSONFile(authorsJSONFilePath, data);
      res.status(201).send(`Author with ID:${newAuthor._id} has been created`);
    } else {
      res.status(409).send(`Email: ${req.body.email} already exists!`);
    }
  } catch (error) {
    console.log(error);
  }
});

// PUT /authors/123 => edit the author with the given id
authorsRouter.put("/:authorID", async (req, res) => {
  try {
    await editRecordByID(authorsJSONFilePath, req.params.authorID, req.body);
    res.send(`Author with ID ${req.params.authorID} has been changed`);
  } catch (error) {
    console.log(error);
  }
});

// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:authorID", async (req, res) => {
  try {
    await deleteRecordByID(authorsJSONFilePath, req.params.authorID);
    res.status(204).send("Deleted");
  } catch (error) {
    console.log(error);
  }
});

export default authorsRouter;
