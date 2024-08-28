import serial
from .lamp import Lamp
from .lampProfile import Profile
from .config import USB_PORT, DEFAULT_PINS

class Controller:
    def __init__(self, port = USB_PORT, baudrate: int = 9600):
        """
        Initializes the Controller object to communicate with Arduino.
        
        :param port: The serial port connected to the Arduino.
        :param baudrate: The baud rate for the serial communication.
        """
        self.serial_conn = serial.Serial(port, baudrate)

    def set_pins(self):
        """
        Sends commands to the Arduino to set the default pins for subsequent operations.
        """
        for pin in DEFAULT_PINS:
            command = f"PIN:{pin}\n"
            self.serial_conn.write(command.encode())

    def set_pwm(self, lamp: Lamp):
        """y
        Sends a command to the Arduino to set the PWM value of a specific pin.
        
        :param lamp: Lamp object containing pin and brightness information.
        """
        if lamp.brightness == 0:
            command = f"{lamp.pin}:-1\n"
        else:
            command = f"{lamp.pin}:{lamp.brightness}\n"
        self.serial_conn.write(command.encode())
    
    def apply_profile(self, profile: Profile):
        """
        Applies a profile by setting the brightness of all lamps in the profile.
        
        :param profile: Profile object containing the lamps and their brightness values.
        """
        for lamp in profile.lamps.values():
            self.set_pwm(lamp)
