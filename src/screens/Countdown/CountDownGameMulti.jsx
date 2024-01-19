import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import io from 'socket.io-client';
import Modal from 'react-modal'; // Import the Modal component from react-modal
import '../screens/Styles/CountDownGame.css'; // Import the CSS file for styling
import mapping from '../Mapping'; // Import the CSS file for styling

Modal.setAppElement('#root'); // Set the app element to the root element of your app

const socket = io('http://192.168.1.22:3000', {transports: ['websocket', 'polling', 'flashsocket']});

import singleSound from '../../assets/single.mp3';
import doubleSound  from '../../assets/Double.mp3';
import tripleSound  from '../../assets/Triple.mp3';


function App({route}) {
  const { totalPlayer, maxStartingNumber } = route.params;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCount, setPlayerCount] = useState(totalPlayer);
  const [totalPlayers] = useState(playerCount);
  const [totalRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [captureCount, setCaptureCount] = useState(0);
  const [capturedData, setCapturedData] = useState([]);
  const [capturingEnabled, setCapturingEnabled] = useState(false);
  const [roundData, setRoundData] = useState({});
  const [playerScores, setPlayerScores] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const [isStartDialogOpen, setisStartDialogOpen] = useState(true); // State to control the dialog visibility
  const [activeAudios, setActiveAudios] = useState([]);
  const [isNegativeDialogOpen, setisNegativeDialogOpen] = useState(false);



  // Map input data to numbers
  function mapInputToNumber(input) {
    const mappedItem = mapping.find((item) => item.input.replace(/[\s,]/g, '') === input.toString().replace(/[\s,]/g, ''));
    if (mappedItem) {
      return mappedItem.number.toString();
    } else {
      return "0"; // Default value for unmapped inputs
    }
  }

  function mapInputToPoint(input) {
    const mappedItem = mapping.find((item) => item.input.replace(/[\s,]/g, '') === input.toString().replace(/[\s,]/g, ''));
    if (mappedItem) {
      return mappedItem.point.toString();
    } else {
      return "0"; // Default value for unmapped inputs
    }
  }

  function checkForChars(input) {
    const mappedItem = mapping.find((item) => item.input.replace(/[\s,]/g, '') === input.toString().replace(/[\s,]/g, ''));
    if (mappedItem) {
      return mappedItem.type.toString();
    } else {
      return "s"; // Default value for unmapped inputs
    }
  }

  function checkForCharsFullApha(input) {
    const mappedItem = mapping.find((item) => item.input.replace(/[\s,]/g, '') === input.toString().replace(/[\s,]/g, ''));
    console.log(mappedItem)
    switch (mappedItem.type) {
      case "s":
        return "SINGLE"
      case "d":
        return "DOUBLE"
      case "t":
        return "TRIPLE"
      default:
        return "SINGLE"
    }
  }

  // Initialize scores for each player
  function initializeScores() {
    const scores = {};
    for (let i = 1; i <= playerCount; i++) {
      scores[`player${i}`] = maxStartingNumber;
    }
    setPlayerScores(scores);
  }

  useState(() => {
    initializeScores();
  }, []);

  useEffect(() => {

    // Update the score inside the player container whenever the playerScores state changes
    document.getElementById(`score${currentPlayer}`).textContent = `Score: ${playerScores[`player${currentPlayer}`]}`;
    
    socket.on('arduinoData', (data) => {
      const mappedItemToDigit = mapInputToNumber(data);
      const checkFOrCharsData = checkForChars(data);
      const checkFOrCharsDataFullApha = checkForCharsFullApha(data);
      const mappedItemToPoint = mapInputToPoint(data);
      console.log(data)
      if (capturingEnabled) {
        setCapturedData(prevCapturedData => [...prevCapturedData, mappedItemToDigit]); // Add captured data to the state variable
        if (captureCount < 3) {
          let capturedDatawithType = checkFOrCharsDataFullApha + " " +mappedItemToPoint
          setCapturedData([...capturedData, capturedDatawithType]);
          setCaptureCount(captureCount + 1);

          const capturedString = capturedData.join(' ');
          setRoundData(prevRoundData => ({
            ...prevRoundData,
            [`round${currentRound}`]: {
              ...prevRoundData[`round${currentRound}`],
              [`player${currentPlayer}`]: capturedString
            }
          }));

          const score = calculateScore(mappedItemToDigit);
          document.getElementById(`score${currentPlayer}`).textContent = `Score: ${playerScores[`player${currentPlayer}`]}`;

          showCurentScore(currentPlayer);


          const singleAudio = new Audio(singleSound);
          const doubleAudio = new Audio(doubleSound);
          const tripleAudio = new Audio(tripleSound);
          let audioToPlay;
          switch (checkFOrCharsData) {
            case "s":
              audioToPlay = singleAudio;
              break;
            case "d":
              audioToPlay = doubleAudio;
              break;
            case "t":
              audioToPlay = tripleAudio;
              break;
            default:
              audioToPlay = singleAudio;
          }
        
          setActiveAudios(prevAudios => [...prevAudios, audioToPlay]);
          audioToPlay.play();
          
        }
        if(captureCount ==2){
          setTimeout(function() {
            setCapturingEnabled(false)
            setIsDialogOpen(true); // Open the dialog
          }, 2000);
        }
      }
    });

    return () => {
      socket.off('arduinoData');
    };
    
  }, [capturingEnabled, captureCount, capturedData, currentRound, currentPlayer, playerScores]);


  // Calculate the score based on the subtracted values
  function calculateScore(number) {
    let result = playerScores[`player${currentPlayer}`];
    let previousScore = result;
  
    let tempResult = result - parseInt(number);
  
    if (tempResult <= 0) {
      if (tempResult === 0) {
        showWinnerDialog(currentPlayer, result);
      } else {
        showNegativeScoreDialog();
      }
      result = previousScore; // Restore previous score if the result is non-positive
      setCapturingEnabled(false); // Disable capturing functionality
    } else {
      result = tempResult;
    }
  
    setPlayerScores(prevPlayerScores => ({
      ...prevPlayerScores,
      [`player${currentPlayer}`]: result
    }));
    return result;
  }
  

  function startNextTurn() {
    if (!capturingEnabled) {
      setCapturingEnabled(true);
      setCaptureCount(0);
      setCapturedData([]);
    }
    document.getElementById("startGame").style.display = "none";
    setisStartDialogOpen(false);
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  function nextPlayerTurn() {
    setCaptureCount(0);
    setCapturedData([]);

    if (currentPlayer === totalPlayers) {
      setCurrentPlayer(1);
      showCurentScore(currentPlayer);
      setCurrentRound(prevCurrentRound => prevCurrentRound + 1);

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
      setCurrentPlayer(prevCurrentPlayer => prevCurrentPlayer + 1);
      showCurentScore(currentPlayer);
    }

    setIsDialogOpen(false);
    setisNegativeDialogOpen(false);
    setCapturingEnabled(true); // Enable capturing functionality for the next player
    removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
  }

  // Show negative score dialog
  function showNegativeScoreDialog() {

    setisNegativeDialogOpen(true);
    // removeDialogOverlay(); // Remove dialog overlay when next player's turn starts
    // Play sound effect
    // playSoundEffectBusted();
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
    document.getElementById(`currentScore`).textContent = `${playerScores[`player${input}`]}`;
    document.getElementById(`currentPlayer`).textContent = `Player ${currentPlayer}`;
  }


  // Ref for the Start button
const startButtonRef = useRef(null);

// Function to handle keydown event
const handleKeyDown = (event) => {
  if (event.keyCode === 13) { // Check if the Enter key is pressed (key code 13)
    event.preventDefault(); // Prevent the default form submission behavior
    startButtonRef.current.click(); // Simulate a click on the Start button
  }
};

// Add an event listener to the document on component mount
useEffect(() => {
  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, []);

  

  return (
    <div className="game-container">
      <div className="score-container">
        <h1 id="currentPlayer">Player {currentPlayer}</h1>
        <div>
          <p id="currentScore">{playerScores[`player${currentPlayer}`]}</p>
        </div>
          <div>
              <div id={"capturedThreeData"}>
                {capturedData.map((data, i) => (
                  <div key={i}>{data}</div>
                ))}
              </div>
        </div>
      </div>
      <div className="players-container">
        {[...Array(playerCount)].map((_, index) => (
          <div key={index} className={`player-style player-${index + 1}`}>
            <h2 id={`player${index + 1}`}>Player {index + 1}</h2>
            <div id={`capturedData${index + 1}`}></div>
            <p id={`score${index + 1}`}>Score: {playerScores[`player${index + 1}`]}</p>
          </div>
        ))}
      </div>
      <Modal
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background color
            },
            content: {
              fontSize: "3vw",
              color:"white",
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Translucent background color
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        isOpen={isStartDialogOpen} onRequestClose={() => setisStartDialogOpen(false)}>
        <button id="startGame" className="pushable" onClick={startNextTurn}>  <span className="front">START GAME</span></button>
      </Modal>
      <Modal
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background color
            },
            content: {
              fontSize: "3vw",
              color:"white",
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Translucent background color
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        isOpen={isNegativeDialogOpen} onRequestClose={() => setisNegativeDialogOpen(false)}>
        <p>Busted! It's now Player {currentPlayer === playerCount ? 1 : currentPlayer + 1}'s turn.</p>
        <button className="pushable" ref={startButtonRef} onClick={nextPlayerTurn}>  <span className="front">NEXT TURN</span></button>
      </Modal>
      <Modal
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background color
            },
            content: {
              fontSize: "3vw",
              color:"white",
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Translucent background color
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        isOpen={isDialogOpen} onRequestClose={() => setIsDialogOpen(false)}>
        <p>It's now Player {currentPlayer === playerCount ? 1 : currentPlayer + 1}'s turn.</p>
        <button className="pushable" ref={startButtonRef} onClick={nextPlayerTurn}>  <span className="front">NEXT TURN</span></button>
      </Modal>
    </div>
  );
}

export default App;
