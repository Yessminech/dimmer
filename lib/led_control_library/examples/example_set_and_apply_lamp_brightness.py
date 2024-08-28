# example_set_and_apply_lamp_brightness.py

from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.controller import Controller
import time
# Create lamp
newLamp = Lamp(id=1, name="New Panel", pin=2, brightness=10)

# Initialize the controller 
controller = Controller()

# Accessing a specific lamp to get its brightness
controller.set_pwm(newLamp)
print(f"Brightness of New Panel: {newLamp.brightness}")
# Wait for some time to see the changes
time.sleep(2)
# Set the brightness of an existing lamp to the MAX value
newLamp.set_brightness(254)
controller.set_pwm(newLamp)
print(f"Updated brightness of New Panel to {newLamp.brightness}.")
# Wait for some time to see the changes
time.sleep(2)
# Set the brightness of an existing lamp to the MIN value
newLamp.set_brightness(0)
controller.set_pwm(newLamp)
print(f"Updated brightness of New Panel to {newLamp.brightness}.")