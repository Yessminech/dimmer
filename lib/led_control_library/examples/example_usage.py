from led_control.lamp import Lamp
from led_control.profile import Profile
from led_control.controller import Controller

# Create lamps with specific names, pins, and brightness levels
lamp1 = Lamp(name="Lamp1", pin=3, brightness=128)
lamp2 = Lamp(name="Lamp2", pin=5, brightness=64)
lamp3 = Lamp(name="Lamp3", pin=6, brightness=200)

# Create a profile and add lamps to it
profile = Profile(name="Living Room")
profile.add_lamp(lamp1)
profile.add_lamp(lamp2)

# Set brightness for an existing lamp in the profile
lamp_to_update = profile.get_lamp("Lamp1")
lamp_to_update.set_brightness(180)

# Add another lamp to the profile
profile.add_lamp(lamp3)

# Remove a lamp from the profile
profile.remove_lamp("Lamp2")

# Save the current profile to a JSON file
profile.save_to_file("living_room_profile.json")

# Load the profile from a JSON file
profile.load_from_file("living_room_profile.json")

# Initialize the controller with the Arduino serial port
controller = Controller(port='/dev/ttyUSB0')

# Apply the loaded profile, sending PWM signals to the Arduino
controller.apply_profile(profile)

# Additional operations

# Accessing a specific lamp to get its brightness
lamp1_brightness = profile.get_lamp("Lamp1").brightness
print(f"Brightness of Lamp1: {lamp1_brightness}")

# Modify the brightness of an existing lamp directly
profile.get_lamp("Lamp3").set_brightness(50)

# Reapply the updated profile
controller.apply_profile(profile)

# Save the updated profile to a new JSON file
profile.save_to_file("updated_living_room_profile.json")



# # Initialize the LampController with the serial port connected to the Arduino
# controller = LampController('/dev/ttyUSB0')

# # Add lamps
# controller.add_lamp('Lamp1', 3)
# controller.add_lamp('Lamp2', 5)

# # Set brightness
# controller.set_lamp_brightness('Lamp1', 128)
# controller.set_lamp_brightness('Lamp2', 255)

# # Save profile
# controller.save_profile('Evening', 'evening_profile.json')

# # Load profile
# controller.load_profile('evening_profile.json')