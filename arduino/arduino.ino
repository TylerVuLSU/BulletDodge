//https://youtube.com/shorts/Ytu0FSHPVt8?feature=share

#include "PDMSerial.h"

PDMSerial pdm;

const int LeftRightPin = A0;
const int UpDownPin = A1;

const int outPinBlue = 8;
const int button = 7;

int sensorValue = 0;
int UpDownSensorValue = 0;
int LeftRightSensorValue = 0;

void setup() {
  pinMode(LeftRightPin, INPUT);
  pinMode(UpDownPin, INPUT);

  pinMode(outPinBlue, OUTPUT);
  pinMode(button, INPUT);

  Serial.begin(9600);
}

void loop() {

  LeftRightSensorValue = analogRead(LeftRightPin);
  UpDownSensorValue = analogRead(UpDownPin);
  sensorValue = digitalRead(button);
  pdm.transmitSensor("a0", LeftRightSensorValue);
  pdm.transmitSensor("a1", UpDownSensorValue);
  pdm.transmitSensor("p7", sensorValue);
  pdm.transmitSensor("end");

  boolean newData = pdm.checkSerial();
  
  if(newData) {
    if(pdm.getName().equals(String("ledBlue"))) {
      digitalWrite(outPinBlue, pdm.getValue());
    }
  }
}