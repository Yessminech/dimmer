from .config import DEFAULT_PINS, MIN_BRIGHTNESS, MAX_BRIGHTNESS

class Lamp:

    def __init__(self, id: int, name: str, pin: int, brightness: int = 0): #TODO check if brightness is on or off 
        """
        Initializes a Lamp object.
        
        :param id: A unique identifier for the lamp.
        :param name: A unique name for the lamp.
        :param pin: The PWM pin number on the Arduino the lamp is connected to.
        :param brightness: Initial brightness level (0-255).
        """
        if pin not in DEFAULT_PINS:
            raise ValueError(f"Pin {pin} is not in the allowed pin list: {DEFAULT_PINS}")
        if brightness < MIN_BRIGHTNESS or brightness > MAX_BRIGHTNESS:
            raise ValueError(f"Brightness value {brightness} is not in the allowed range: {MIN_BRIGHTNESS}-{MAX_BRIGHTNESS}")
        self.id = id
        self.name = name
        self.pin = pin
        self.brightness = brightness
    
    def set_brightness(self, brightness: int):
        """
        Sets the brightness of the lamp.
        
        :param brightness: Brightness level (0-255).
        """
        if brightness < MIN_BRIGHTNESS or brightness > MAX_BRIGHTNESS:
            raise ValueError(f"Brightness value {brightness} is not in the allowed range: {MIN_BRIGHTNESS}-{MAX_BRIGHTNESS}")
        self.brightness = brightness
    
    def to_dict(self) -> dict:
        """
        Converts the Lamp object to a dictionary for easy JSON serialization.
        """
        return {
            "name": self.name,
            "pin": self.pin, #TODO
            "brightness": self.brightness
        }
    
    @staticmethod
    def from_dict(data: dict):
        """
        Creates a Lamp object from a dictionary (for JSON deserialization).
        
        :param data: Dictionary with lamp data.
        :return: A Lamp object.
        """
        return Lamp(name=data['name'], pin=data['pin'], brightness=data['brightness']) #TODO
