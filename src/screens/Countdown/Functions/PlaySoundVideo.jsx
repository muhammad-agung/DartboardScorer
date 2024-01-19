const singleSound = require("../../../../assets/audio/single.mp3");
const doubleSound = require("../../../../assets/audio/Double.mp3");
const tripleSound = require("../../../../assets/audio/Triple.mp3");
const bullSound = require("../../../../assets/audio/Bull.mp3");
const bustedSound = require("../../../../assets/audio/Busted.mp3");
const nextPlayerSound = require("../../../../assets/audio/enter.wav");

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

export { playSoundVideo };
