require("dotenv").config(); // Add this line to the top of the file
const express = require("express");
const axios = require("axios");
const calculateOptimalLineup = require("./lineupoptimizer.js");

const app = express();
const PORT = process.env.PORT || 3000;
const WEB_URL = process.env.WEB_URL; // Add this line

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/api/lineups", async (req, res) => {
  try {
    console.log(req.query.contestId);
    const contestId = req.query.contestId || "86402";
    const playersResponse = await axios.get(
      `${WEB_URL}/api/players?contestId=${contestId}` // Update this line
    );
    const players = playersResponse.data;
    const lineups = calculateOptimalLineup(players);
    res.json(lineups);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/players", async (req, res) => {
  try {
    const contestId = req.query.contestId || "86402"; // Updated line to handle the contest ID
    const response = await axios.get(
      `https://api.draftkings.com/draftgroups/v1/draftgroups/${contestId}/draftables`
    );
    const playersByName = response.data.draftables.reduce((acc, player) => {
      const { firstName, lastName, position, salary, status } = player;

      // Filter out players with the status "OUT"
      if (status === "OUT") {
        return acc;
      }

      const name = `${firstName} ${lastName}`;

      // Split the position by the hyphen if it exists
      const [position1, position2] = position.includes("/")
        ? position.split("/")
        : [position, ""];

      if (!acc[name]) {
        // Add the player to the playersByName object if they don't already exist
        acc[name] = {
          name,
          position1,
          position2,
          projectedPoints: parseFloat(
            player.draftStatAttributes.find((attr) => attr.id === 219)?.value ||
              0
          ),
          salary,
        };
      }

      return acc;
    }, {});
    const players = Object.values(playersByName);
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// rest of your server setup code goes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
