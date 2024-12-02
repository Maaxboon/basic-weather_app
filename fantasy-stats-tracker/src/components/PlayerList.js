import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import "./PlayerList.css";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://fantasy.premierleague.com/api/bootstrap-static/")
      .then((response) => response.json())
      .then((data) => setPlayers(data.elements))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredPlayers = players.filter((player) =>
    `${player.first_name} ${player.second_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search players..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="player-list">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
