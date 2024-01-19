import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "react-native";
import io from "socket.io-client";
import Modal from "react-modal"; // Import the Modal component from react-modal
import "./Styles/CountDownGame.css"; // Import the CSS file for styling

import { playSoundVideo } from "./Functions/PlaySoundVideo";
import { mapDataToDigitFunction } from "./Functions/mapDataToDigitFunction";


Modal.setAppElement("#root"); // Set the app element to the root element of your app

function App({ route }) {
  const {maxStartingNumber, serverIP } = route.params;
  const [currentPlayer] = useState(1);
  const [totalPlayers] = useState(1);
  const [totalRounds] = useState(14);
  const [currentRound, setCurrentRound] = useState(1);
  const [captureCount, setCapturedCount] = useState(0);
  const [capturedData, setCapturedData] = useState([]);
  const [capturedScore, setCapturedScore] = useState([]);
  const [RoundcapturingEnabled, setRoundcapturingEnabled] = useState(false);
  const [playerScores, setPlayerScores] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const [isStartDialogOpen, setisStartDialogOpen] = useState(true); // State to control the dialog visibility
  const [isNegativeDialogOpen, setisNegativeDialogOpen] = useState(false);

  const socket = io(serverIP, {
  transports: ["websocket", "polling", "flashsocket"],
});

useState(() => {
  console.log(serverIP)
  initializeScores();
}, []);

// Initialize scores for each player
function initializeScores() {
  const scores = {};
    scores[`player${1}`] = maxStartingNumber;
  setPlayerScores(scores);
}

useEffect(() => {

  //Handle enter button
  document.addEventListener("keydown", handleEnterKeyFunction);

  // Update the score inside the player container whenever the playerScores state changes
  document.getElementById(`score${currentPlayer}`).textContent = `Score: ${playerScores[`player${currentPlayer}`]}`;
  document.getElementById(`currentPlayer`).textContent = `Player ${currentPlayer}`;

  //Fetch data from server
  socket.on("arduinoData", (data) => {
    const mappedArduinoDataToDigit = mapDataToDigitFunction(data);

    if (RoundcapturingEnabled && mappedArduinoDataToDigit[2] !== "SKIP") {
      if (captureCount < 3) {
        //Update point
        let capturedDatawithType = mappedArduinoDataToDigit[2] + " " + mappedArduinoDataToDigit[1];
        setCapturedData([...capturedData, capturedDatawithType]);
        setCapturedCount(captureCount + 1);
        setCapturedScore([...capturedScore, mappedArduinoDataToDigit[0]]);
        calculateScore(mappedArduinoDataToDigit[1], mappedArduinoDataToDigit[3]);
      }
    } else {
      if (isNegativeDialogOpen == true) {
        handleEnterKeyFunction(mappedArduinoDataToDigit[2]);
      }
    }
  });

  return () => {
    socket.off("arduinoData");
    document.removeEventListener("keydown", handleEnterKeyFunction);
  };
}, [RoundcapturingEnabled, captureCount, capturedData, currentRound, currentPlayer, playerScores]);


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

      if (capturedScore.length > 0) {
      result += capturedScore.reduce((sum, score) => sum + parseInt(score), 0);
    }
      setRoundcapturingEnabled(false); // Disable capturing functionality
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
        setRoundcapturingEnabled(false);
        setIsDialogOpen(dialogstate); // Open the dialog
      }, 1000);
    }

    //Play audio
    playSoundVideo(soundPlay);

    document.getElementById(`currentScore`).textContent = `${playerScores[`player${currentPlayer}`]}`;
    document.getElementById(`currentPlayer`).textContent = `Player ${currentPlayer}`;
    document.getElementById(`score${currentPlayer}`).textContent = `Score: ${playerScores[`player${currentPlayer}`]}`;
    return result;
  }

  // Function to handle keydown event
  function handleEnterKeyFunction(event) {
    if (event.keyCode === 13) {
      // Check if the Enter key is pressed (key code 13)
      event.preventDefault(); // Prevent the default form submission behavior
      startButtonRef.current.click(); // Simulate a click on the Start button
    } else if (event == "SKIP") {
      startButtonRef.current.click(); // Simulate a click on the Start button\
    }
  }

  function startNextTurn() {
    if (!RoundcapturingEnabled) {
      setRoundcapturingEnabled(true);
      setCapturedCount(0);
      setCapturedData([]);
      setCapturedScore([]);
    }
    document.getElementById("startGame").style.display = "none";
    setisStartDialogOpen(false);
    playSoundVideo("next");
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  function nextPlayerTurn() {
    setCapturedCount(0);
    setCapturedData([]);
    setCapturedScore([]);

    if (currentPlayer === 1) {
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

        if (lowestScore === 0) {
          // Player reached zero, show winning dialog
          showWinnerDialog(winner, lowestScore);
        } else {
          // Player didn't reach zero after round ends, show failure dialog
          showFailureDialog();
        }
        return; // Exit the function and stop thze game
      }
    } else {
      showCurentScore(currentPlayer);
    }
    playSoundVideo("next");
    setIsDialogOpen(false);
    setisNegativeDialogOpen(false);
    setRoundcapturingEnabled(true); // Enable capturing functionality for the next player
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  // Show negative score dialog
  function showNegativeScoreDialog() {
    setisNegativeDialogOpen(true);
  }

  function showWinnerDialog(winner) {
    const dialogOverlay = document.createElement("div");
    dialogOverlay.classList.add("dialog-overlay");

    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box");
    dialogBox.textContent = `Player ${winner} win!`;

    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);
  }

  // Show failure dialog
function showFailureDialog() {
  const dialogOverlay = document.createElement("div");
  dialogOverlay.classList.add("dialog-overlay");

  const dialogBox = document.createElement("div");
  dialogBox.classList.add("dialog-box");
  dialogBox.textContent = `Player ${currentPlayer} failed!`;

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
              className="roundData">
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
        {[...Array(1)].map((_, index) => (
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
            backgroundColor: "rgba(0, 0, 0, 0.9)", // Translucent background color
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
            backgroundColor: "rgba(0, 0, 0, 0.9)", // Translucent background color
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
            <span className="front">Busted!</span>
          </button>
          ) : (
            <button
            className="pushable"
            ref={startButtonRef}
            onClick={nextPlayerTurn}
            >
            {" "}
            <span className="front">Next turn</span>
          </button>
          )}
        </View>
      </Modal>
    </div>
  );
}

export default App;