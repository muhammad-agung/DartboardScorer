# dartboardScorer

This project is made to create a DIY grandboard by using a cheap plastic tip electronic dartboard. As of now there is only one game which is count down.
NOTE: This project is nowhere near complete and use it as just starting point in your project

items needed:
- Arduino uno/mega - depends on the dartboard matrix ribbon cable connection, in my case it has total of 17, therefore I am using arduino mega. You might even get away with using esp32 if you know how to  port it
- cabbles - to connects arduino mega to the the matrix ribbon cable
- power bank - to power both arduino and the server
- raspberry pi 2 or newer - it used to run the server that reads arduino terminal logs to the game client. in my case I run both server and the client in the raspberry pi
- electronic dartboard - I am using ED110 DARTBOARD ELECTRONIC
- Soldering Iron kit - To sloder the ribbon cable connection to the arduino



I use their project as refference
https://www.instructables.com/OpenDarts-the-Home-Made-Darts-Machine/
