#include <Arduino.h>

const int DEFAULT_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9, 10}; // Add more DEFAULT_PINS as needed
const int numPins = sizeof(DEFAULT_PINS) / sizeof(DEFAULT_PINS[0]);
const int ON_THRESHOLD = 255;
const int OFF_THRESHOLD = -1;
const int MIN_BRIGHTNESS = 0;
const int MAX_BRIGHTNESS = 254;
const int MIN_PWM_VALUE = 50;
const int MAX_PWM_VALUE = 90;

void setup()
{
    for (int i = 0; i < numPins; i++)
    {
        pinMode(DEFAULT_PINS[i], OUTPUT);
    }
    Serial.begin(9600);
}

void loop()
{
    if (Serial.available())
    {
        String command = Serial.readStringUntil('\n');
        int separatorIndex = command.indexOf(':');
        if (separatorIndex == -1)
        {
            Serial.println("Invalid command format");
            return;
        }

        int lampPin = command.substring(0, separatorIndex).toInt();
        int brightness = command.substring(separatorIndex + 1).toInt();

        bool validPin = false;
        for (int i = 0; i < numPins; i++)
        {
            if (DEFAULT_PINS[i] == lampPin)
            {
                validPin = true;
                break;
            }
        }

        if (!validPin)
        {
            Serial.println("Invalid pin");
            return;
        }

        if (brightness == ON_THRESHOLD)
        {
            analogWrite(lampPin, -90);
            Serial.println("Lamp set to: ON");
        }
        else if (brightness == OFF_THRESHOLD)
        {
            analogWrite(lampPin, -10);
            Serial.println("Lamp set to: OFF");
        }
        else if (brightness >= MIN_BRIGHTNESS && brightness <= MAX_BRIGHTNESS)
        {
            int pwmValue = map(brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS, MIN_PWM_VALUE, MAX_PWM_VALUE);
            if (pwmValue < 71 && pwmValue > 49)
            {
                analogWrite(lampPin, 0);
            }
            else if (pwmValue < 0)
            {
                pwmValue = 0;
            }
            analogWrite(lampPin, -pwmValue);
            Serial.print("Brightness set to: ");
            Serial.println(pwmValue);
        }
        else
        {
            Serial.println("Invalid brightness value");
        }
    }
}