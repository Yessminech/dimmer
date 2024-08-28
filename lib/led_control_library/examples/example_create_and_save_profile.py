# example_create_and_save_profile.py

from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.lampProfile import Profile

# Create lamps with specific names, pins, and brightness levels
rightLamp = Lamp(id=1, name="Left Panel", brightness=0, pin=2)
leftLamp = Lamp(id=2, name="Right Panel", brightness=254,  pin=3)

# Create a profile and add lamps to it
morningProfile = Profile(id=1, name="Morning")
morningProfile.add_lamp(rightLamp)
morningProfile.add_lamp(leftLamp)

# Save the current profile to a JSON file
morningProfile.export_to_json("led_control_library/examples/profiles/morning_profile.json")
print("Profile saved to 'morning_profile.json'")
