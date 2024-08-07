#include <Arduino.h>

const int pwmPin = 6;
const int ON_THRESHOLD = 255;
const int OFF_THRESHOLD = -1;
const int MIN_BRIGHTNESS = 0;
const int MAX_BRIGHTNESS = 254;
const int MIN_PWM_VALUE = 50;
const int MAX_PWM_VALUE = 90;

void setup()
{
    pinMode(pwmPin, OUTPUT);
    Serial.begin(9600);
}

void loop()
{
    if (Serial.available())
    {
        int brightness = Serial.parseInt();
        while (Serial.read() != '\n')
        {
            // Clear the serial buffer
        }
        if (brightness == ON_THRESHOLD)
        {
            analogWrite(pwmPin, -90);
            Serial.println("Lamp set to: ON");
        }
        else if (brightness == OFF_THRESHOLD)
        {
            analogWrite(pwmPin, -10);
            Serial.println("Lamp set to: OFF");
        }
        else if (brightness >= MIN_BRIGHTNESS && brightness <= MAX_BRIGHTNESS)
        {
            int pwmValue = map(brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS, MIN_PWM_VALUE, MAX_PWM_VALUE);
            analogWrite(pwmPin, -pwmValue);
            Serial.print("Brightness set to: ");
            Serial.println(pwmValue);
        }
        else
        {
            Serial.println("Invalid brightness value");
        }
    }
}
