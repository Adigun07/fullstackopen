import axios from "axios";

const baseUrl = "http://localhost:3001/persons";
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newNote) => {
  const response = await axios.post(baseUrl, newNote);
  return response.data;
};

const update = async (id, newNote) => {
  const response = await axios.put(`${baseUrl}/${id}`, newNote);
  return response.data;
};

const del = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default {
  getAll,
  create,
  del,
  update,
};
