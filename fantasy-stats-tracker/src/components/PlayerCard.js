import React from "react";
import "./PlayerCard.css";

const PlayerCard = ({ player }) => (
  <div className="player-card">
    <h2>
      {player.first_name} {player.second_name}
    </h2>
    <p>Team: {player.team}</p>
    <p>Points: {player.total_points}</p>
    <p>Goals: {player.goals_scored}</p>
  </div>
);

export default PlayerCard;
