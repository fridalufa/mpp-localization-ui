# mpp-localization-ui
User Interface for the Localization UI of the MPP project

## Usage
Install frontend dependencies by running ```npm install``` and ```gulp```. Make sure to have gulp installed globally.
Requires an installed MQTT broker with active websockets on localhost, otherwise you have to change the URLs. Configure a webserver for the page however you like.
Run ```python gui.py``` to launch a GUI, that will allow you to publish fake distances from three root nodes to the MQTT broker.
This tool does also add up to 20% error to the calculated distances.
