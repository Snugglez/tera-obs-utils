# OBS-Utils

Adds obs controls into tera and auto records dungeon runs based on dungeon enter and exit

# Installation

Requires [obs websocket plugin](https://github.com/obsproject/obs-websocket/releases/tag/4.9.1) for obs to be set up and running  
You can follow the directions linked above to install that (at the bottom of the page basically)  
Enabled authentication and make a password for the websocket plugin in obs -> Tools -> WebSockets Server Settings  
Ingame you can run !obs password PLACEHOLDER to whatever password you set up to use  
If it says obs login success! then all worked  
From here on the mod will auto connect to obs websocket on mod load and will print a message in toolbox log when it does

# Commands
Note, if using the commands in the toolbox channel or `/8`, ignore the `!` prefix

Command | Argument(s) | Exaobsle | Description
---|---|---|---
**!obs** | NONE | !obs| Turns the module either on or off (on by default)
**!obs** | start | !obs start| Starts a recording (ends when changing zones unless entering a dungeon)
**!obs** | stop | !obs stop| Ends the current recording
**!obs** | clip | !obs clip| Ends the current recording and starts a new one
**!obs** | host | !obs host localhost:4444| Changes the host and port used to connect to the obs websocket plugin (only needed if you change the port or you use a second pc to record)
**!obs** | password | !obs password whatapasswordiam| Sets the password used to authenticate with the obs websocket plugin
**!obs** | connect | !obs connect| Attempts to connect to obs websocket manually (useful if you started obs after the mod loaded)