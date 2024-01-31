import axios from "axios";
import { object } from "prop-types";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error in getAll:", error);
  }
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const createComment = async ({ id, newObject }) => {
  console.log("logging newObject in createcomment service:", newObject);
  console.log("logging id in createcomment service:", id);
  try {
    const response = await axios.post(`${baseUrl}/${id}/comments`, newObject);
    console.log("Comment created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in creating a comment", error);
    throw error;
  }
};

const update = async ({ id, newObject }) => {
  try {
    console.log(
      "logging id and object in update function backend:",
      id,
      newObject,
    );
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error in update", error);
  }
};
const remove = async ({ id }) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log("id in remove axios:", id);
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    console.log("Error in deleting a blog", error);
  }
};

export default { getAll, create, update, setToken, remove, createComment };
