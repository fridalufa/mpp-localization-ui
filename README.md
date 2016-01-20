# mpp-localization-ui
User Interface for the Localization UI of the MPP project

## Usage
Install frontend dependencies by running ```npm install``` and ```gulp```. Make sure to have gulp installed globally.
Requires an installed MQTT broker with active websockets on localhost, otherwise you have to change the URLs. Configure a webserver for the page however you like.
Run ```python gui.py``` to launch a GUI, that will allow you to publish fake distances from three root nodes to the MQTT broker.
This tool does also add up to 20% error to the calculated distances.

## Config
If you don't want to use your local broker, you can create settings files for both applications in this repository.

For the python test tool create a file called ```gui_config.py``` at the same level as the ```gui.py```. In this file you put the following code:

```
HostConfig = {"host" : "<hostname>", "username": "<username>", "password": "<password>"}
```

If your server is using no password or username, just pass ```None``` instead of a string.

To configure the credentials for the browser application create a folder called ```config``` in the public-directory. In there create a file called ```mqtt_config.js```.

Put in the following:

```
window.mqtt_config = {};
window.mqtt_config.host = "<hostname>";
window.mqtt_config.port = <port>;
window.mqtt_config.username = "<username>";
window.mqtt_config.password = "<password>";
```