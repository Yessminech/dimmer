#include <Arduino.h> 

const int ledPin = 6; 

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    if (Serial.available()) {
        int brightness = Serial.parseInt();
        while (Serial.read() != '\n') {
        }
        brightness = constrain(brightness, 0, 255);
        analogWrite(ledPin, brightness);
        Serial.print("Brightness set to: ");
        Serial.println(brightness);
    }
}