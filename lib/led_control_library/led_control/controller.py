import serial

class Controller:
    def __init__(self, port: str, baudrate: int = 9600): #TODO import port ftom config 
        """
        Initializes the Controller object to communicate with Arduino.
        
        :param port: The serial port connected to the Arduino.
        :param baudrate: The baud rate for the serial communication.
        """
        self.serial_conn = serial.Serial(port, baudrate)
    
    def set_pwm(self, lamp: Lamp):
        """
        Sends a command to the Arduino to set the PWM value of a specific pin.
        
        :param lamp: Lamp object containing pin and brightness information.
        """
        command = f"{lamp.pin}:{lamp.brightness}\n"
        self.serial_conn.write(command.encode())
    
    def apply_profile(self, profile: Profile):
        """
        Applies a profile by setting the brightness of all lamps in the profile.
        
        :param profile: Profile object containing the lamps and their brightness values.
        """
        for lamp in profile.lamps.values():
            self.set_pwm(lamp)


# import serial

# class LampController:
#     def __init__(self, port):
#         self.lamps = {}
#         self.profiles = {}
#         self.serial = serial.Serial(port, 9600)

#     def add_lamp(self, name, pin):
#         lamp = Lamp(name, pin)
#         self.lamps[name] = lamp

#     def remove_lamp(self, name):
#         if name in self.lamps:
#             del self.lamps[name]

#     def set_lamp_brightness(self, name, brightness):
#         if name in self.lamps:
#             self.lamps[name].set_brightness(brightness)
#             self.serial.write(f"{self.lamps[name].pin}:{brightness}\n".encode())

#     def save_profile(self, profile_name, filename):
#         profile = Profile(profile_name)
#         for lamp in self.lamps.values():
#             profile.add_lamp(lamp)
#         profile.save_to_file(filename)
#         self.profiles[profile_name] = profile

#     def load_profile(self, filename):
#         profile = Profile.load_from_file(filename)
#         self.profiles[profile.name] = profile
#         self.lamps = {lamp.name: lamp for lamp in profile.lamps}