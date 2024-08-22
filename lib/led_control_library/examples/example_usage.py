from led_control_library.led_control.lamp import Lamp
from led_control_library.led_control.lampProfile import Profile
from led_control_library.led_control.controller import Controller

# Create lamps with specific names, pins, and brightness levels
rightLamp = Lamp(id=0, name="Right Panel", pin=3, brightness=-1)
leftLamp = Lamp(id=1, name="Left Panel", pin=2, brightness=255)

# Create a profile and add lamps to it
morningProfile = Profile(id= 0, name="Morning")
morningProfile.add_lamp(rightLamp)
morningProfile.add_lamp(leftLamp)

# Initialize the controller with the Arduino serial port
controller = Controller(port='/dev/ttyACM0')

# Apply the loaded profile, sending PWM signals to the Arduino
controller.apply_profile(morningProfile)


# # Save the current profile to a JSON file
# morningProfile.export_to_json("morning_profile.json")

# # Load the profile from a JSON file and apply it 
# importedProfile = Profile(id=1, name="Imported Profile")
# importedProfile.import_from_json("/home/test/Documents/dimmer/code/main/lib/morning_profile.json") #TODO
# controller.apply_profile(importedProfile)

# # Additional operations

# # Set brightness for an existing lamp in the profile
# lamp_to_update = morningProfile.get_lamp("Right Panel")
# # Alternatively, you can get the lamp by its ID:
# # lamp_to_update = morningProfile.get_lamp(0)
# lamp_to_update.set_brightness(0)
# controller.set_pwm(lamp_to_update)

# # Remove a lamp from the profile
# morningProfile.remove_lamp("Right Panel")
# # Alternatively, you can remove the lamp by its ID:
# # morningProfile.remove_lamp(0)

# # Add another lamp to the profile
# newLamp = Lamp(id=0, name="New Panel", pin=2, brightness=10)
# morningProfile.add_lamp(newLamp)

# # Accessing a specific lamp to get its brightness
# newLamp_brightness = morningProfile.get_lamp("New Panel").brightness
# controller.set_pwm(newLamp)
# print(f"Brightness of new Panel: {newLamp_brightness}")

# # Modify the brightness of an existing lamp directly
# morningProfile.get_lamp("New Panel").set_brightness(50)
# controller.apply_profile(morningProfile)
# newLamp_brightness = morningProfile.get_lamp("New Panel").brightness
# print(f"Brightness of new Panel: {newLamp_brightness}")

# # Reapply the updated profile
# controller.apply_profile(morningProfile)

# # Save the updated profile to a new JSON file
# morningProfile.export_to_json("updated_living_room_profile.json")



