#!/bin/sh

echo "Starting the setup........"
sudo apt-get update
python --version
pip install -r requirements.txt 
echo "Setup completed........"

echo "Starting the server......."
flask --app main run --debug
