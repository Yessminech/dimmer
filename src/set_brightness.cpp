#include <Arduino.h>

const int pwmPin6 = 6;
const int pwmPin5 = 5;
const int ON_THRESHOLD = 255;
const int OFF_THRESHOLD = -1;
const int MIN_BRIGHTNESS = 0;
const int MAX_BRIGHTNESS = 254;
const int MIN_PWM_VALUE = 50;
const int MAX_PWM_VALUE = 90;

void setup()
{
    pinMode(pwmPin6, OUTPUT);
    pinMode(pwmPin5, OUTPUT);
    Serial.begin(9600);
}

void loop()
{
    if (Serial.available())
    {
        int lampId = Serial.parseInt(); 
        int brightness = Serial.parseInt();
        while (Serial.read() != '\n')
        {
            // Clear the serial buffer
        }

        int pwmPin;
        if (lampId == 1)
        {
            pwmPin = pwmPin6;
        }
        else if (lampId == 2)
        {
            pwmPin = pwmPin5;
        }
        else
        {
            Serial.println("Invalid lamp ID");
            return;
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
            if (pwmValue < 71 && pwmValue > 49)
            {
            analogWrite(pwmPin, 0);
            }
            else if (pwmValue < 0)
            {
                pwmValue = 0;
            }
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
