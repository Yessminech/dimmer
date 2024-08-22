import json
from .config import MAX_LAMPS, CONNECTED_LAMPS
from .lamp import Lamp

class Profile:
    def __init__(self, id: int, name: str):
        """
        Initializes a Profile object.
        
        :param id: ID of the profile.
        :param name: Name of the profile.
        """
        self.id = id
        self.name = name
        self.lamps = {}
    
    def add_lamp(self, lamp: Lamp):
        """
        Adds a lamp to the profile.
        
        :param lamp: Lamp object to be added.
        """
        if len(self.lamps) >= CONNECTED_LAMPS:
            raise ValueError(f"Cannot add more than {CONNECTED_LAMPS} lamps.")
        self.lamps[lamp.name] = lamp #TODO check the indices of the lamps

    def remove_lamp(self, lamp_identifier: str): #TODO turn it off
        """
        Removes a lamp from the profile by its name or ID.
        
        :param lamp_identifier: The name or ID of the lamp to remove.
        """
        for lamp_name, lamp in self.lamps.items():
            if lamp.name == lamp_identifier or lamp.id == lamp_identifier:
                del self.lamps[lamp_name]
                break

    def get_lamp(self, lamp_identifier: str) -> Lamp:
        """
        Retrieves a lamp from the profile by its name or ID.
        
        :param lamp_identifier: The name or ID of the lamp to retrieve.
        :return: Lamp object.
        """
        for lamp in self.lamps.values():
            if lamp.name == lamp_identifier or lamp.id == lamp_identifier:
                return lamp
        return None
    
    def export_to_json(self, filepath: str):
        """
        Exports the profile to a JSON file.
        
        :param filepath: Path to the JSON file.
        """
        with open(filepath, 'w') as file:
            json.dump({lamp_name: lamp.to_dict() for lamp_name, lamp in self.lamps.items()}, file, indent=4)
    
    def import_from_json(self, filepath: str):
        """
        Imports a profile from a JSON file.
        
        :param filepath: Path to the JSON file.
        """
        with open(filepath, 'r') as file:
            data = json.load(file)
            for lamp_name, lamp_data in data.items():
                self.lamps[lamp_name] = Lamp.from_dict(lamp_data)
