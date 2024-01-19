import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "react-native";
import io from "socket.io-client";
import Modal from "react-modal";

import "./CricketGame.css";

Modal.setAppElement("#root");

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});

function CricketGame({ route }) {
  const { totalPlayers } = route.params;

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerScores, setPlayerScores] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);



  return (
    <div className="container">

    </div>
  );
}

export default CricketGame;
