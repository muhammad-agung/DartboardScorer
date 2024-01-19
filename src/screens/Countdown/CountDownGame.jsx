import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "react-native";
import io from "socket.io-client";
import Modal from "react-modal"; // Import the Modal component from react-modal

import "./CountDownGame.css"; // Import the CSS file for styling
import mapping from "../Mapping";

Modal.setAppElement("#root"); // Set the app element to the root element of your app

// const socket = io("http://192.168.1.22:3000", {
//   transports: ["websocket", "polling", "flashsocket"],
// });

const socket = io("http://192.168.1.22:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});




import singleSound from "../../../assets/audio/single.mp3";
import doubleSound from "../../../assets/audio/Double.mp3";
import tripleSound from "../../../assets/audio/Triple.mp3";
import bullSound from "../../../assets/audio/Bull.mp3";
import bustedSound from "../../../assets/audio/Busted.mp3";
import nextPlayerSound from "../../../assets/audio/enter.wav";

function App({ route }) {
  const { totalPlayer, maxStartingNumber } = route.params;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [totalPlayers] = useState(totalPlayer);
  const [totalRounds] = useState(14);
  const [currentRound, setCurrentRound] = useState(1);
  const [captureCount, setCaptureCount] = useState(0);
  const [capturedData, setCapturedData] = useState([]);
  const [capturedScore, setCapturedScore] = useState([]);
  const [capturingEnabled, setCapturingEnabled] = useState(false);
  const [playerScores, setPlayerScores] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const [isStartDialogOpen, setisStartDialogOpen] = useState(true); // State to control the dialog visibility
  const [isNegativeDialogOpen, setisNegativeDialogOpen] = useState(false);

  useState(() => {
    initializeScores();
  }, []);

  useEffect(() => {

    //Handle enter button
    document.addEventListener("keydown", handleKeyDown);

    // Update the score inside the player container whenever the playerScores state changes
    document.getElementById(`score${currentPlayer}`).textContent = `Score: ${
      playerScores[`player${currentPlayer}`]
    }`;
    document.getElementById(
      `currentPlayer`
    ).textContent = `Player ${currentPlayer}`;

    //Fetch data from server
    socket.on("arduinoData", (data) => {
      console.log(data)
      const mappedItemToDigit = mapInputToNumber(data);

      if (capturingEnabled && mappedItemToDigit[2] !== "SKIP") {
        if (captureCount < 3) {
          //Update point
          let capturedDatawithType =
            mappedItemToDigit[2] + " " + mappedItemToDigit[1];
          setCapturedData([...capturedData, capturedDatawithType]);
          setCaptureCount(captureCount + 1);
          setCapturedScore([...capturedScore, mappedItemToDigit[0]]);

          //update current score
          calculateScore(mappedItemToDigit[1], mappedItemToDigit[3]);

          //update displayed player score
          document.getElementById(
            `score${currentPlayer}`
          ).textContent = `Score: ${playerScores[`player${currentPlayer}`]}`;
        }
      } else {
        if (captureCount == 3 || isNegativeDialogOpen == true) {
          handleKeyDown(mappedItemToDigit[2]);
        }
      }
    });

    return () => {
      socket.off("arduinoData");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    capturingEnabled,
    captureCount,
    capturedData,
    currentRound,
    currentPlayer,
    playerScores,
  ]);

  function playSoundVideo(soundType) {
    let audioToPlay;
    switch (soundType) {
      case "s":
        audioToPlay = new Audio(singleSound);
        break;
      case "d":
        audioToPlay = new Audio(doubleSound);
        break;
      case "t":
        audioToPlay = new Audio(tripleSound);
        break;
      case "busted":
        audioToPlay = new Audio(bustedSound);
        break;
      case "b":
        audioToPlay = new Audio(bullSound);
        break;
      case "next":
        audioToPlay = new Audio(nextPlayerSound);
        break;
      default:
        audioToPlay = new Audio(singleSound);
    }
    audioToPlay.play();
  }

  // Map input data to numbers
  function mapInputToNumber(input) {
    const mappedItem = mapping.find(
      (item) =>
        item.input.replace(/[\s,]/g, "") ===
        input.toString().replace(/[\s,]/g, "")
    );

    if (mappedItem) {
      let number = mappedItem.number.toString();
      let point = mappedItem.point.toString();
      let type = "";
      let char = mappedItem.type.toString();

      switch (mappedItem.type) {
        case "s":
          type = "SINGLE";
          break;
        case "skip":
          type = "SKIP";
          break;
        case "d":
          type = "DOUBLE";
          break;
        case "t":
          type = "TRIPLE";
          break;
        default:
          type = "SINGLE";
          break;
      }
      return [number, point, type, char];
    } else {
      return "0"; // Default value for unmapped inputs
    }
  }

  // Initialize scores for each player
  function initializeScores() {
    const scores = {};
    for (let i = 1; i <= totalPlayer; i++) {
      scores[`player${i}`] = maxStartingNumber;
    }
    setPlayerScores(scores);
  }

  // Calculate the score based on the subtracted values
  function calculateScore(number, sound) {
    let result = playerScores[`player${currentPlayer}`];
    let previousScore = result;
    let dialogstate = true;
    let soundPlay = sound;

    let tempResult = result - parseInt(number);

    if (tempResult <= 0) {
      if (tempResult === 0) {
        showWinnerDialog(currentPlayer, tempResult);
      } else {
        showNegativeScoreDialog();
        soundPlay = "busted";
      }
      if (capturedScore.length == 2) {
        result =
          previousScore +
          parseInt(capturedScore[0]) +
          parseInt(capturedScore[1]); // Restore previous score if the result is non-positive
      } else if (capturedScore.length == 1) {
        result = previousScore + parseInt(capturedScore[0]);
      } else {
        result = previousScore; // Restore previous score if the result is non-positive
      }
      setCapturingEnabled(false); // Disable capturing functionality
      dialogstate = false; // Toggle the dialog state based on the isNegativeDialogOpen state
    } else {
      result = tempResult;
    }

    setPlayerScores((prevPlayerScores) => ({
      ...prevPlayerScores,
      [`player${currentPlayer}`]: result,
    }));

    if (captureCount == 2) {
      setTimeout(function () {
        setCapturingEnabled(false);
        setIsDialogOpen(dialogstate); // Open the dialog
      }, 1000);
    }

    //Play audio
    playSoundVideo(soundPlay);

    document.getElementById(`currentScore`).textContent = `${
      playerScores[`player${currentPlayer}`]
    }`;
    document.getElementById(
      `currentPlayer`
    ).textContent = `Player ${currentPlayer}`;
    return result;
  }

  // Function to handle keydown event
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      // Check if the Enter key is pressed (key code 13)
      event.preventDefault(); // Prevent the default form submission behavior
      startButtonRef.current.click(); // Simulate a click on the Start button
    } else if (event == "SKIP") {
      startButtonRef.current.click(); // Simulate a click on the Start button\
    }
  }

  function startNextTurn() {
    if (!capturingEnabled) {
      setCapturingEnabled(true);
      setCaptureCount(0);
      setCapturedData([]);
      setCapturedScore([]);
    }
    document.getElementById("startGame").style.display = "none";
    setisStartDialogOpen(false);
    playSoundVideo("next");
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  function nextPlayerTurn() {
    setCaptureCount(0);
    setCapturedData([]);
    setCapturedScore([]);

    if (currentPlayer === totalPlayers) {
      setCurrentPlayer(1);
      setCurrentRound((prevCurrentRound) => prevCurrentRound + 1);

      if (currentRound > totalRounds) {
        let winner = null;
        let lowestScore = Infinity;

        // Find the player with the lowest score
        for (let i = 1; i <= totalPlayers; i++) {
          const playerScore = playerScores[`player${i}`];
          if (playerScore < lowestScore) {
            lowestScore = playerScore;
            winner = i;
          }
        }
        // Display the winner
        showWinnerDialog(currentPlayer, lowestScore);
        return; // Exit the function and stop thze game
      }
    } else {
      setCurrentPlayer((prevCurrentPlayer) => prevCurrentPlayer + 1);
      showCurentScore(currentPlayer);
    }
    playSoundVideo("next");
    setIsDialogOpen(false);
    setisNegativeDialogOpen(false);
    setCapturingEnabled(true); // Enable capturing functionality for the next player
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  // Show negative score dialog
  function showNegativeScoreDialog() {
    setisNegativeDialogOpen(true);
  }

  function showWinnerDialog(winner, score) {
    const dialogOverlay = document.createElement("div");
    dialogOverlay.classList.add("dialog-overlay");

    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box");
    dialogBox.textContent = `Player ${winner} wins with a score of ${score}!`;

    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);
  }

  // Remove dialog overlay function
  function removeDialogOverlay() {
    const dialogOverlay = document.querySelector(".dialog-overlay");
    if (dialogOverlay) {
      dialogOverlay.remove();
    }
  }

  function showCurentScore(input) {
    document.getElementById(`currentScore`).textContent = `${
      playerScores[`player${input}`]
    }`;
    document.getElementById(
      `currentPlayer`
    ).textContent = `Player ${currentPlayer}`;
  }

  // Ref for the Start button
  const startButtonRef = useRef(null);
  return (
    <div className="game-container">
      <div className="score-container">
        <h1 id="currentPlayer">Player {currentPlayer}</h1>
        <div>
          <p id="currentScore">{playerScores[`player${currentPlayer}`]}</p>
        </div>
        <div>
          <div id="capturedThreeData">
            <div
              style={{
                fontSize: "2vw",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              Round {currentRound}/15{" "}
            </div>
            {capturedData.map((data, i) => (
              <div id={`capturedThreeDataIndivudual${i + 1}`} key={i}>
                {data}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="players-container">
        {[...Array(totalPlayer)].map((_, index) => (
          <div key={index} className={`player-style player-${index + 1}`}>
            <h2 id={`player${index + 1}`}>Player {index + 1}</h2>
            <div id={`capturedData${index + 1}`}></div>
            <p id={`score${index + 1}`}>
              Score: {playerScores[`player${index + 1}`]}
            </p>
          </div>
        ))}
      </div>
      <Modal
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Translucent background color
          },
          content: {
            fontSize: "3vw",
            color: "white",
            backgroundColor: "transparent", // Translucent background color
            textAlign: "center",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
          },
        }}
        isOpen={isStartDialogOpen}
        onRequestClose={() => setisStartDialogOpen(false)}
      >
        <button id="startGame" className="pushable" onClick={startNextTurn}>
          {" "}
          <span className="front">START GAME</span>
        </button>
      </Modal>
      <Modal
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Translucent background color
          },
          content: {
            fontSize: "3vw",
            color: "white",
            backgroundColor: "transparent", // Translucent background color
            textAlign: "center",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
          },
        }}
        isOpen={isDialogOpen || isNegativeDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <View
        >
          {isNegativeDialogOpen ? (
           <button
            className="pushable"
            ref={startButtonRef}
            onClick={nextPlayerTurn}
            >
            {" "}
            <span className="front">Busted! Player{" "}
            {currentPlayer === totalPlayer ? 1 : currentPlayer + 1}'s turn</span>
          </button>
          ) : (
            <button
            className="pushable"
            ref={startButtonRef}
            onClick={nextPlayerTurn}
            >
            {" "}
            <span className="front">Player{" "}
            {currentPlayer === totalPlayer ? 1 : currentPlayer + 1}'s turn</span>
          </button>
          )}
        </View>
      </Modal>
    </div>
  );
}

export default App;