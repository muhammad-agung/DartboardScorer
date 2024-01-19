import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import io from 'socket.io-client';
import Modal from 'react-modal'; // Import the Modal component from react-modal
import '../screens/Styles/CountDownGame.css'; // Import the CSS file for styling

Modal.setAppElement('#root'); // Set the app element to the root element of your app

const mapping = [
  // Mapping entries here
{ input: "2,3", number: "20", point:"20", type: "s" },
{ input: "0,3", number: "60", point:"20", type: "t" },
{ input: "1,3", number: "40", point:"20", type: "d" },

{ input: "2,9", number: "1", point:"1",  type: "s"  },
{ input: "0,9", number: "3", point:"1",  type: "t" },
{ input: "1,9", number: "2", point:"1",  type: "d" },

{ input: "2,8", number: "18", point:"18",  type: "s"  },
{ input: "0,8", number: "54", point:"18",  type: "t" },
{ input: "1,8", number: "36", point:"18",  type: "d" },

{ input: "2,7", number: "4", point:"4",  type: "s"  },
{ input: "0,7", number: "12", point:"4",  type: "t" },
{ input: "1,7", number: "8", point:"4",  type: "d" },

{ input: "2,6", number: "13", point:"13",  type: "s"  },
{ input: "0,6", number: "39", point:"13",  type: "t" },
{ input: "1,6", number: "26", point:"13",  type: "d" },

{ input: "2,5", number: "6", point:"6",  type: "s"  },
{ input: "0,5", number: "18", point:"6",  type: "t" },
{ input: "1,5", number: "12", point:"6",  type: "d" },

{ input: "2,4", number: "10", point:"10",  type: "s"  },
{ input: "0,4", number: "30", point:"10",  type: "t" },
{ input: "1,4", number: "20", point:"10",  type: "d" },

{ input: "4,4", number: "15", point:"15",  type: "s"  },
{ input: "6,4", number: "45", point:"15",  type: "t" },
{ input: "5,4", number: "30", point:"15",  type: "d" },

{ input: "4,5", number: "2", point:"2",  type: "s"  },
{ input: "6,5", number: "6", point:"2",  type: "t" },
{ input: "5,5", number: "4", point:"2",  type: "d" },

{ input: "4,6", number: "17", point:"17",  type: "s"  },
{ input: "6,6", number: "51", point:"17",  type: "t" },
{ input: "5,6", number: "34", point:"17",  type: "d" },

{ input: "4,7", number: "3", point:"3",  type: "s"  },
{ input: "6,7", number: "9", point:"3",  type: "t" },
{ input: "5,7", number: "6", point:"3",  type: "d" },

{ input: "4,8", number: "19", point:"19",  type: "s"  },
{ input: "6,8", number: "57", point:"19",  type: "t" },
{ input: "5,8", number: "38", point:"19",  type: "d" },

{ input: "4,9", number: "7", point:"7",  type: "s"  },
{ input: "6,9", number: "21", point:"7",  type: "t" },
{ input: "5,9", number: "14", point:"7",  type: "d" },

{ input: "4,3", number: "16", point:"16",  type: "s"  },
{ input: "6,3", number: "32", point:"16",  type: "t" },
{ input: "5,3", number: "48", point:"16",  type: "d" },

{ input: "4,2", number: "8", point:"8",  type: "s"  },
{ input: "6,2", number: "24", point:"8",  type: "t" },
{ input: "5,2", number: "16", point:"8",  type: "d" },

{ input: "4,1", number: "11", point:"11",  type: "s"  },
{ input: "6,1", number: "33", point:"11",  type: "t" },
{ input: "5,1", number: "22", point:"11",  type: "d" },

{ input: "4,0", number: "14", point:"14",  type: "s"  },
{ input: "6,0", number: "42", point:"14",  type: "t" },
{ input: "5,0", number: "28", point:"14",  type: "d" },

{ input: "2,0", number: "9", point:"9",  type: "s"  },
{ input: "0,0", number: "27", point:"9",  type: "t" },
{ input: "1,0", number: "18", point:"9",  type: "d" },

{ input: "2,1", number: "12", point:"12",  type: "s"  },
{ input: "0,1", number: "36", point:"12",  type: "t" },
{ input: "1,1", number: "24", point:"12",  type: "d" },

{ input: "2,2", number: "5", point:"5",  type: "s"  },
{ input: "0,2", number: "15", point:"5",  type: "t" },
{ input: "1,2", number: "10", point:"5",  type: "d" },

{ input: "3,1", number: "25", point:"25",  type: "b"  },
{ input: "3,0", number: "50", point:"25",  type: "be" },
];

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
