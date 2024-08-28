# example_update_profile_brightness.py

from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.lampProfile import Profile
from led_control_library.led_control.controller import Controller

# Create lamps and profile
rightLamp = Lamp(id=1, name="Left Panel", brightness=0, pin=2)
leftLamp = Lamp(id=2, name="Right Panel", brightness=254,  pin=3)
morningProfile = Profile(id=1, name="Morning")
morningProfile.add_lamp(rightLamp)
morningProfile.add_lamp(leftLamp)

# Initialize the controller 
controller = Controller()

# Set brightness for an existing lamp in the profile
lamp_to_update = morningProfile.get_lamp("Right Panel")
lamp_to_update.set_brightness(0)
controller.set_pwm(lamp_to_update)
print(f"Updated brightness of 'Right Panel' to {lamp_to_update.brightness}.")
