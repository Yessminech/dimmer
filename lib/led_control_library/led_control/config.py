# config.py
DEFAULT_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10]
MAX_LAMPS = 9 #TODO Move this to Lamps class
CONNECTED_LAMPS = 2
ON_THRESHOLD = 255
OFF_THRESHOLD = -1
MIN_BRIGHTNESS = 0
MAX_BRIGHTNESS = 254
# Find available serial ports

import serial.tools.list_ports
ports = serial.tools.list_ports.comports()
port = None
for p in ports:
    if 'ACM' in p.device:
        USB_PORT = p.device
        break