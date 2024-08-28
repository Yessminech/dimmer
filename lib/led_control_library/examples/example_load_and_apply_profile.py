# example_load_and_apply_profile.py

from led_control_library.led_control.lampProfile import Profile
from led_control_library.led_control.controller import Controller

# Initialize the controller 
controller = Controller()

# Load the profile from a JSON file and apply it
importedProfile = Profile(id=1, name="Imported Profile")
importedProfile.import_from_json("led_control_library/examples/profiles/0_profile.json")
controller.apply_profile(importedProfile)
print("Imported profile applied.")
