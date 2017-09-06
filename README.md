AlexaAWSConsoleSkill
====================
## Description

This project provides an Alexa skill to control EC2 machines from within the private network. Instructions and additional features may come later, project is proof of concept.

## Provides

  * Nodejs server for controlling the EC2 instances state (via AWS CLI)
  * AWS Lambda code
  * Alexa Skill code

## Installation/Usage

There is currently no detailed instructions as the project is just a proof of concept. 

* Modify ConsoleControlServer/serverinfo.js with the port your want to use
* Modify ConsoleControlServer/serverinfo.js with the password that Lambda will use for authentication
* Modify ConsoleLambda/serverinfo.js with the private IP of the Control Server and the port you want to use
* Modify ConsoleLambda/serverinfo.js with your application ID (From Alexa Skills Dashboard, step 4 below) 
* Modify ConsoleLambda/serverinfo.js with the password to send to the Nodejs server (2nd bullet point above)

1. Launch an EC2 instance and install nodejs and jq (Console Control Server)
2. Start the Console Control Server by running "npm install" and "node server.js" from the ConsoleControlServer directory
3. Configure Alexa as an event source under the event source tab in the AWS Lambda Function panel. (AWS Lambda Dashboard) - Skip code upload for now
4. Configure a Alexa Skill using the contents of the ConsoleSkill folder, the ARN of your above Lambda Function, and the <a href="https://developer.amazon.com/edw/home.html">Alexa Skills Dashboard</a>.
5. Zip the .js files in ConsoleLamba up and upload them as a new AWS Lambda Function using the <a href="https://console.aws.amazon.com/lambda">AWS Lambda Dashboard</a>
6. Make sure the Security Groups between the EC2 instance and the Lambda function allow communication.

## Contributors
*Matthew Van Zanten

## License

This project is released under the MIT License. See the bundled LICENSE file for more details.
