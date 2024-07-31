from flask import Flask, request, jsonify, send_from_directory
import serial
import time

app = Flask(__name__)

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
time.sleep(2) 

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/brightness')
def set_brightness():
    try:
        percent = int(request.args.get('value', 0))
        if 0 <= percent <= 100:
            brightness = int(percent * 2.55)  # Convert percent to brightness value
            ser.write(f'{brightness}\n'.encode())
            print(f"Sent brightness value: {brightness}")  # Debugging print statement
            return jsonify(message=f"Brightness set to {percent}%")
        else:
            return jsonify(error="Invalid percent value. Must be between 0 and 100."), 400
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/toggle')
def toggle_lamp():
    try:
        ser.write(b'toggle\n')  # Example command for toggling the lamp
        return jsonify(message="Lamp toggled")
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
