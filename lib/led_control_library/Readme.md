# LED Control Library
# A Python library for controlling the brightness of LEDs using an Arduino

This library allows you to manage individual lamps connected to Arduino's PWM pins, organize them into profiles, and save/load these profiles from JSON files. The library facilitates easy control over LED brightness for various applications, such as smart lighting systems.

## Features

- **Lamp Management**: Create, update, and manage individual lamps connected to specific PWM pins.
- **Profiles**: Group multiple lamps into profiles, allowing for easy control of multiple LEDs simultaneously.
- **Persistence**: Save and load lamp profiles to/from JSON files for easy reuse and sharing.
- **Arduino Communication**: Communicate with an Arduino over a serial connection to control LED brightness via PWM.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/led_control_library.git
    cd led_control_library
    ```

2. **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3. **Optional: Install the library locally:**
    ```bash
    pip install .
    ```

## Getting Started

### Example Usage

Here's a simple example of how to use the library to control LED brightness:

```python
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
```

### Pin Configuration

By default, the library assumes you have nine available PWM pins on your Arduino:

```python
DEFAULT_PINS = [3, 5, 6, 9, 10, 11, 13, 2, 4]
MAX_LAMPS = 9
```

You can customize these pins in the `config.py` file or directly in your code when creating `Lamp` instances.

### Connecting to the Arduino

The library uses `pyserial` to communicate with the Arduino over a serial connection. Make sure you know the correct serial port your Arduino is connected to (e.g., `/dev/ttyUSB0` on Linux, `COM3` on Windows).