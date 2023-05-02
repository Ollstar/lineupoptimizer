import { useState, useEffect } from "react";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [contestId, setContestId] = useState("84787");

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch(`/api/players?contestId=${contestId}`);
      const players = await response.json();
      setPlayers(players);
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/players?contestId=${contestId}`);
    console.log("fetchPlayers response", response); // Add this line

    const players = await response.json();
    setPlayers(players);
  };

  const handleCalculateLineup = async () => {
    const response = await fetch(`/api/lineups?contestId=${contestId}`);
    const result = await response.json();

    if (result.infeasible) {
      alert(
        "No optimal lineup found. Please check the constraints and try again."
      );
    } else {
      setLineup(result.lineup);
    }
  };

  return (
    <div className="container">
      <h1>NBA Lineup Optimizer</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="contestId">Enter DraftKings Contest ID:</label>
        <input
          type="text"
          value={contestId}
          id="contestId"
          name="contestId"
          onChange={(e) => setContestId(e.target.value)}
        />
        <button type="submit">Update Players</button>
      </form>
      <div id="totals">
        <div id="totalSalary"></div>
        <div id="totalPoints"></div>
      </div>
      <div className="tables-container">
        <PlayerTable players={players} title="All Players" />
        <PlayerTable players={lineup} title="Optimal Lineup" />
      </div>
      <button onClick={handleCalculateLineup}>Calculate Optimal Lineup</button>
    </div>
  );
}

function PlayerTable({ players, title }) {
  const isOptimalLineup = title === "Optimal Lineup";
  const totalSalary = isOptimalLineup
    ? players.reduce((acc, player) => acc + player.salary, 0)
    : 0;
  const totalPoints = isOptimalLineup
    ? players.reduce((acc, player) => acc + player.projectedPoints, 0)
    : 0;

  return (
    <>
      <div className="table-wrapper">
        <div className="title-container">
          <h2>{title}</h2>
          {isOptimalLineup && (
            <div id="totals">
              <div>Total Salary: ${totalSalary}</div>
              <div>Total Projected Points: {totalPoints.toFixed(2)}</div>
            </div>
          )}
        </div>
        <table className="player-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position1</th>
              <th>Position2</th>
              <th>Projected Points</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody id="playersTbody">
            {players.map((player) => (
              <tr key={player.name}>
                <td>{player.name}</td>
                <td>{player.position1}</td>
                <td>{player.position2}</td>
                <td>{player.projectedPoints}</td>
                <td>{player.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

