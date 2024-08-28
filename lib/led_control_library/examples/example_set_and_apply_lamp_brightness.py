# example_set_and_apply_lamp_brightness.py

from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.controller import Controller
import time

# Initialize the controller 
controller = Controller()

# AAlternative 1
newLamp = Lamp(id=1, name="New Panel", pin=2, brightness=10)
controller.set_pwm(newLamp)
print(f"Brightness of New Panel: {newLamp.brightness}")
# Wait for some time to see the changes
time.sleep(2)

## Alternative 2 / Set the brightness of an existing lamp to the MAX value
newLamp = Lamp(id=1, brightness=0)
newLamp.set_brightness(254)
controller.set_pwm(newLamp)
print(f"Updated brightness of New Panel to {newLamp.brightness}.")
# Wait for some time to see the changes
time.sleep(2)

## Alternative 3 / Set the brightness of an existing lamp to the MIN value
newLamp = Lamp(id=1)
controller.set_pwm(newLamp, 0)
print(f"Updated brightness of New Panel to {newLamp.brightness}.")