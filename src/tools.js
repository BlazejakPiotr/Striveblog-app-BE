import fs from "fs-extra";

export const loadJSONFile = async (path) => {
  return JSON.parse(await fs.readFile(path));
};

export const writeJSONFile = async (path, data) => {
  await fs.writeFile(path, JSON.stringify(data));
};

export const getRecordByID = async (path, id) => {
  let data = await loadJSONFile(path);
  let findRecordByID = data.find((data) => data._id === id);
  return findRecordByID;
};

export const deleteRecordByID = async (path, id) => {
  let data = await loadJSONFile(path);
  let removeRecordByID = data.filter((data) => data._id !== id);
  await writeJSONFile(path, removeRecordByID);
};

export const editRecordByID = async (path, id, body) => {
  let data = await loadJSONFile(path);
  let editedRecordIndex = data.findIndex((data) => data._id === id);
  data[editedRecordIndex] = {
    ...data[editedRecordIndex],
    ...body,
    _updatedAt: new Date(),
  };
  await writeJSONFile(path, data);
};
