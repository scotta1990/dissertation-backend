const axios = require("axios");
const fs = require("fs").promises;
const exerciseFilePath = "./temp/temp-exercises.json";

const updateExerciseDataFile = async () => {
  const options = {
    method: "GET",
    url: "https://exercisedb.p.rapidapi.com/exercises/",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(options);
    var json = JSON.stringify(response.data);
    const file = await fs.writeFile(exerciseFilePath, json);
    return response.data;
  } catch (error) {
    console.log(error)
    return error;
  }
};

const getExerciseData = async () => {
  try {
    const stats = await fs.stat(exerciseFilePath);
    var oneDay = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;

    if (new Date(stats.mtime) < new Date(oneDay)) {
      console.log(`temp-exercise updated being called`);
      const data = await updateExerciseDataFile();
      return data;
    } else {
      const data = await fs.readFile(exerciseFilePath);
      return JSON.parse(data);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`temp-exercise updated being called`);
      const data = await updateExerciseDataFile();
      return data;
    }
    return error;
  }
};

exports.getExercises = async (req, res) => {
  console.log(`Request for exercises made by ${req.user.userId}`);
  try {
    const exerciseData = await getExerciseData();
    return res.status(200).send(exerciseData);
  } catch (err) {
    return res.status(400).send(err);
  }
};
