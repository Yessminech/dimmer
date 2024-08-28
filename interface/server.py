from flask import Flask, request, jsonify, send_from_directory
import serial
import time

app = Flask(__name__)
import serial.tools.list_ports

# Find available serial ports
ports = serial.tools.list_ports.comports()
port = None

for p in ports:
    if 'ACM' in p.device:
        port = p.device
        break

if port is None:
    print("No Arduino device found.")
    exit()

ser = serial.Serial(port, 9600, timeout=1)
time.sleep(2) 

DEFAULT_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

lamp_pin_mapping = {i: DEFAULT_PINS[i-1] for i in range(1, 10)}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/brightness')
def get_brightness():
    try:
        lamp_index = int(request.args.get('lamp'))
        percent = int(request.args.get('value', 0))
        if 1 <= percent <= 100:
            brightness = int(percent * 2.54) 
            pin = lamp_pin_mapping.get(lamp_index)
            if pin is not None:
                ser.write(f'{pin}:{brightness}\n'.encode())
                print(f"Sent brightness value: {brightness} for lamp {lamp_index}")  
                return jsonify(message=f"Brightness set to {percent}% for lamp {lamp_index}")
            else:
                return jsonify(error="Invalid lamp index."), 400
        elif percent == 0:
            pin = lamp_pin_mapping.get(lamp_index)
            if pin is not None:
                ser.write(f'{pin}:-1\n'.encode())
                print(f"Sent brightness value: 0 for lamp {lamp_index}")  
                return jsonify(message=f"Lamp {lamp_index} Off")
            else:
                return jsonify(error="Invalid lamp index."), 400
        else:
            return jsonify(error="Invalid percent value. Must be between 0 and 100."), 400
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/toggle')
def toggle_lamp():
    try:
        lamp_index = int(request.args.get('lamp'))
        percent = int(request.args.get('value', 0))
        brightness = int(percent * 2.54) 
        pin = lamp_pin_mapping.get(lamp_index)
        if pin is not None:
            if brightness == 254:
                ser.write(f'{pin}:255\n'.encode()) 
                print(f"Sent brightness value: {brightness} for lamp {lamp_index}")  
                return jsonify(message=f"Lamp {lamp_index} On")
            elif brightness == 0:
                ser.write(f'{pin}:-1\n'.encode()) 
                print(f"Sent brightness value: {brightness} for lamp {lamp_index}")  
                return jsonify(message=f"Lamp {lamp_index} Off")
            else:
                return jsonify(error="Invalid percent value. Must be either 0 or 100."), 400
        else:
            return jsonify(error="Invalid lamp index."), 400
    except Exception as e:
        return jsonify(error=str(e)), 500

#TODO: Add profile specific settings 
@app.route('/profile')
def set_profile():
    profile_name = request.args.get('name')
    try:
        ser.write(f'profile:{profile_name}\n'.encode())
        return jsonify(message=f"Profile set to {profile_name}")
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
