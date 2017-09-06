var AlexaSkill = require("./AlexaSkill");
var serverinfo = require("./serverinfo");
var http = require("http");

if (serverinfo.host == "127.0.0.1") {
    throw "Default hostname found, edit your serverinfo.js file to include your server's external IP address";
}

var AlexaConsole = function () {
    AlexaSkill.call(this, serverinfo.appId);
};

AlexaConsole.prototype = Object.create(AlexaSkill.prototype);
AlexaConsole.prototype.constructor = AlexaConsole;

function sendCommand(path,body,callback) {
    var opt = {
        host: serverinfo.host,
        port: serverinfo.port,
        path: path,
        method: 'POST',
        headers: {'Authorization': serverinfo.pass},
    };

    var req = http.request(opt, function(res) {
        callback();
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    if (body) req.write(body);
    req.end();
}

AlexaConsole.prototype.intentHandlers = {
    Start: function (intent, session, response) {
        sendCommand("/aws/ec2/start/instances",intent.slots.Text.value,function() {
            response.tellWithCard("Starting "+ intent.slots.Text.value);
        });
    },
    Stop: function (intent, session, response) {
        sendCommand("/aws/ec2/stop/instances",intent.slots.Text.value,function() {
            response.tellWithCard("Stopping "+ intent.slots.Text.value);
        });
    },
    Reboot: function (intent, session, response) {
        sendCommand("/aws/ec2/reboot/instances",intent.slots.Text.value,function() {
            response.tellWithCard("Stopping "+ intent.slots.Text.value);
        });
    },
    Describe: function (intent, session, response) {
        sendCommand("/aws/ec2/describe",intent.slots.Text.value,function() {
            response.tellWithCard("Describing "+ intent.slots.Text.value);
        });
    },
    HelpIntent: function (intent, session, response) {
        response.tell("No help available at this time.");
    }
};

exports.handler = function (event, context) {
    var awsconsole = new AlexaConsole();
    awsconsole.execute(event, context);
};
