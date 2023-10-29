# SillyTavern-Map Extension

<This project is still in prototype phase and will undergo changes>

This extension allows you to interact with STscripts using a graphical user interface.
This allows users to extend STscripts into graphically interactive fashion.

## Features

- Background image in MovingUI dialog box
- User definable SVG Shapes with OnHover and OnClick triggering STScript

## Installation and Usage

### Installation

Install using SillyTavern's third-party extensions installer using this link:

https://github.com/Elthial/SillyTavern-Map

### Usage

- Open the "Map" extension menu.
- Select the map in the dropdown list
- Click the "Load Map" button

Alternatively:

- Use slashcommand ```"/Map <MapFileName>"``` to load a map by name

### Creating a Map

A map currently has two components:
- A Background image file
- A JSON file defining the SVG Shapes and STscript

(Later development will move the JSON file into the PNG metadata similar to ST character cards)

Most of the JSON file is self explainatory. 
The SVG Shapes have the following format
```
{
	"id": "Player-house",
	"path": "M 150 500 L 193 385 L 261 345 L 330 400 L 330 435 L 365 455 L 360 510 L 285 550 Z",
	"color": "#CC0000",
	"script": "/go flux | /bg bedroom clean | /sys {{user}} returns home and finds {{char}} lying on their bed."
},
```

- ```"path"``` defines the shape of the SVG shape using SVG path notation
- ```"M"``` : Origin point
- ```"L"``` : Line drawn from the previous point to this absolute point
- ```"Z"``` : Line from the previous point to the origin

Load your background image in paint or other image editor then use the cursor to find the X, Y positions within your images for your shapes.
Then using those co-ordinates create your SVG shape path.

- ```"color"``` : Transparency highlight colour for mouse OnHover events
- ```"script"``` : STscript to be executed upon OnClick event

Note: 
Using ```"/Map <MapFileName>"``` can allow chaining of maps together is a nested structure. 
This can allow hierarchical maps such as Town -> Building -> Room.
If a back button is zoned on the image for the parent then full tree traversal is possible.

## Prerequisites

- Latest release version of SillyTavern.

## Support and Contributions

Feel free to contribute.

## License

MIT License
