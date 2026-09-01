# Dimmer — LED Lighting Controller

Firmware for a controllable LED lighting unit, built to keep illumination constant and
reproducible across image acquisitions. Developed at Fraunhofer IPK as part of a camera-based
inspection setup.

## Why

In a multi-camera imaging rig, inconsistent lighting is as damaging to the data as a bad trigger.
Two images of the same object under different illumination aren't comparable, which undermines
both inspection and any dataset built from the captures. This controller makes the light source
a set parameter instead of an environmental variable.

## Structure

```
src/                       firmware entry point and application logic
lib/led_control_library/   LED driver — dimming and channel control
interface/                 web interface for setting brightness
platformio.ini             board and build configuration
```

Built with **PlatformIO**, so `platformio.ini` defines the target board, framework and
dependencies; the same project builds from the CLI or from VS Code.

## Building and flashing

```bash
pio run              # build
pio run -t upload    # flash
pio device monitor   # serial output
```

## Interface

Brightness is set over a small web interface served by the controller, so the light can be
adjusted without reflashing or a serial connection — which matters when the unit is mounted
inside a rig.
