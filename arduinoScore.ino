
int masterLines = 10; //Change here to the number of lines of your Master Layer
int slaveLines = 7; //Change here to the number of lines of your Slave Layer

int matrixMaster[] = {10, 11, 12, 13, 14, 15, 16, 17, 18, 19}; //Put here the pins you connected the lines of your Master Layer
int matrixSlave[] = {2, 3, 4, 5, 6, 7, 8}; //Put here the pins you connected the lines of your Slave Layer

void setup() {
  Serial.begin(9600);

  for (int i = 0; i < slaveLines; i++) {
    pinMode(matrixSlave[i], INPUT_PULLUP);
  }

  for (int i = 0; i < masterLines; i++) {
    pinMode(matrixMaster[i], OUTPUT);
    digitalWrite(matrixMaster[i], HIGH);
  }
}

void loop() {
  for (int i = 0; i < masterLines; i++) {
    digitalWrite(matrixMaster[i], LOW);
    for (int j = 0; j < slaveLines; j++) {
      if (digitalRead(matrixSlave[j]) == LOW) {
        Serial.print(j);
        Serial.print(",");
        Serial.println(i);
        delay(500);
        break;
      }
    }
    digitalWrite(matrixMaster[i], HIGH);
  }
}