# example_remove_and_add_lamp.py

from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.lampProfile import Profile

# Create lamps and profile
rightLamp = Lamp(id=1, name="Left Panel", brightness=0, pin=2)
leftLamp = Lamp(id=2, name="Right Panel", brightness=254,  pin=3)
morningProfile = Profile(id=1, name="Morning")
morningProfile.add_lamp(rightLamp)
morningProfile.add_lamp(leftLamp)

# Remove a lamp from the profile
morningProfile.remove_lamp("Right Panel")
print("Removed 'Right Panel' from profile.")

# Add another lamp to the profile
newLamp = Lamp(id=1, name="New Panel", pin=2, brightness=10)
morningProfile.add_lamp(newLamp)
print(f"Added new lamp '{newLamp.name}' to profile.")
