from .config import DEFAULT_PINS, MIN_BRIGHTNESS, MAX_BRIGHTNESS

class Lamp:

    def __init__(self, id: int, name: str, brightness: int, pin: int): #TODO check if brightness is on or off 
        """
        Initializes a Lamp object.
        
        :param id: A unique identifier for the lamp.
        :param name: A unique name for the lamp.
        :param pin: The PWM pin number on the Arduino the lamp is connected to.
        :param brightness: Initial brightness level (0-255).
        """
        if pin not in DEFAULT_PINS:
            raise ValueError(f"Pin {pin} is not in the allowed pin list: {DEFAULT_PINS}")
        # if brightness < MIN_BRIGHTNESS or brightness > MAX_BRIGHTNESS:
        #     raise ValueError(f"Brightness value {brightness} is not in the allowed range: {MIN_BRIGHTNESS}-{MAX_BRIGHTNESS}")
        self.id = id
        self.name = name
        self.brightness = brightness
        self.pin = pin
    
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
        isOn = False if self.brightness == 0 else True
        brightness_percentage = (self.brightness / 254) * 100
        return {
            "id": self.id,
            "name": self.name,
            "brightness": brightness_percentage,
            "isOn": isOn,
            "pin": self.pin
        }
    @staticmethod
    def from_dict(data: dict):
        """
        Creates a Lamp object from a dictionary (for JSON deserialization).
        
        :param data: Dictionary with lamp data.
        :return: A Lamp object.
        """
        isOn = True if data['isOn'] else False
        brightness = -1 if not isOn else int((data['brightness'] / 100) * 254)
        return Lamp(id=data['id'], name=data['name'], brightness=brightness, pin=data['pin'])
