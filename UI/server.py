from flask import Flask, request, jsonify, send_from_directory
import serial
import time

app = Flask(__name__)
port = '/dev/ttyACM0' 
ser = serial.Serial(port, 9600, timeout=1)
time.sleep(2) 

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/brightness')
def get_brightness():
    try:
        percent = int(request.args.get('value', 0))
        if 1 <= percent <= 100:
            brightness = int(percent * 2.54) 
            ser.write(f'{brightness}\n'.encode())
            print(f"Sent brightness value: {brightness}")  
            return jsonify(message=f"Brightness set to {percent}%")
        elif percent == 0:
            ser.write(f'{-1}\n'.encode())
            print(f"Sent brightness value: 0")  
            return jsonify(message="Lamp Off")
        else:
            return jsonify(error="Invalid percent value. Must be between 0 and 100."), 400
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/toggle')
def toggle_lamp():
    try:
        percent = int(request.args.get('value', 0))
        brightness = int(percent * 2.54) 
        if (brightness == 254):
            ser.write(f'{255}\n'.encode()) 
            print(f"Sent brightness value: {brightness}")  
            return jsonify(message="Lamp On")
        elif (brightness == 0):
            ser.write(f'{-1}\n'.encode()) 
            print(f"Sent brightness value: {brightness}")  
            return jsonify(message="Lamp Off")
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
