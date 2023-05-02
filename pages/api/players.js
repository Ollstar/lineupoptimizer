// pages/api/players.js
import axios from 'axios';

export default async function handler(req, res) {
  const { contestId = '86402' } = req.query; // Set a default value for contestId

  try {
    const response = await axios.get(
      `https://api.draftkings.com/draftgroups/v1/draftgroups/${contestId}/draftables`
    );

    const playersByName = response.data.draftables.reduce((acc, player) => {
      const { firstName, lastName, position, salary, status } = player;

      // Filter out players with the status "OUT"
      if (status === 'OUT') {
        return acc;
      }

      const name = `${firstName} ${lastName}`;

      // Split the position by the hyphen if it exists
      const [position1, position2] = position.includes('/')
        ? position.split('/')
        : [position, ''];

      if (!acc[name]) {
        // Add the player to the playersByName object if they don't already exist
        acc[name] = {
          name,
          position1,
          position2,
          projectedPoints: parseFloat(
            player.draftStatAttributes.find((attr) => attr.id === 219)?.value || 0
          ),
          salary,
        };
      }

      return acc;
    }, {});
    const players = Object.values(playersByName);
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching NBA players:', error);
    res.status(500).json({ error: 'Failed to fetch NBA players.' });
  }
}
