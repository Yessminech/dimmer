from .config import DEFAULT_PINS, MIN_BRIGHTNESS, MAX_BRIGHTNESS

class Lamp:

    def __init__(self, id: int, name: str, brightness: int, pin: int = None): #TODO check if brightness is on or off 
        """
        Initializes a Lamp object.
        
        :param id: A unique identifier for the lamp.
        :param name: A unique name for the lamp.
        :param pin: The PWM pin number on the Arduino the lamp is connected to.
        :param brightness: Initial brightness level (0-255).
        """
        if pin is None:
            pin = {i: DEFAULT_PINS[i-1] for i in range(1, 10)}.get(id)
        if pin not in DEFAULT_PINS:
            raise ValueError(f"Pin {pin} is not in the allowed pin list: {DEFAULT_PINS}")
        self.pin = pin
        # if brightness < MIN_BRIGHTNESS or brightness > MAX_BRIGHTNESS:
        #     raise ValueError(f"Brightness value {brightness} is not in the allowed range: {MIN_BRIGHTNESS}-{MAX_BRIGHTNESS}")
        if id < 1:
            raise ValueError("ID must be greater than or equal to 1")
        self.id = id
        self.name = name
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
        brightness = -1 if not isOn  or int(data['brightness'])==0 else int((int(data['brightness']) / 100) * 254)
        return Lamp(id=data['id'], name=data['name'], brightness=brightness)
