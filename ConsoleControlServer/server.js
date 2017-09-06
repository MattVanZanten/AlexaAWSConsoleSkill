var serverinfo = require("./serverinfo");
var exec = require('exec');
var http = require('http');
var fs = require('fs');
var urllib = require("url");


//a simple wrapper to post to a url with no payload
function post(url,callback) {
    var info = urllib.parse(url);
    console.log("Posting: ",url);
    var opt = {
        host:info.hostname,
        port:info.port,
        path: info.path,
        method: 'POST',
    };

    var req = http.request(opt, callback);

    req.end();
}

//simple helper function to pull the data out of a post request. This could be avoided by using a more capable library such
function getRequestData(request,callback) {
    var body = "";
    request.on("data",function(data) {
        body += String(data);
    });
    request.on("end",function() {
        callback(body);
    });
}

//depending on the URL endpoint accessed, we use a different handler.
//This is almost certainly not the optimal way to build a TCP server, but for our simple example, it is more than sufficient
var handlers = {
    "/aws/ec2/start/instances":function(request,response) {  
        getRequestData(request,function(data) {
            var instanceRequest = data.replace().toLowerCase();
            console.log("aws ec2 start-instances " + instanceRequest);
            if (ec2InstanceState(instanceRequest, "start-instances")) {
                console.log('Instance started.');
                response.end("OK");
            } else {
                console.log('Instance not found.');
                response.end("Instance not found.");
            }
        });
        response.end("OK");     //respond with OK before the operation finishes
    },
    "/aws/ec2/stop/instances":function(request,response) {  
        getRequestData(request,function(data) {
            var instanceRequest = data.replace().toLowerCase();
            console.log("aws ec2 stop-instances " + instanceRequest);
            if (ec2InstanceState(instanceRequest, "stop-instances")) {
                console.log('Instance stopping.');
                response.end("OK");
            } else {
                console.log('Instance not found.');
                response.end("Instance not found.");
            }
        });
        response.end("OK");     //respond with OK before the operation finishes
    },
    "/aws/ec2/reboot/instances":function(request,response) {  
        getRequestData(request,function(data) {
            var instanceRequest = data.replace().toLowerCase();
            console.log("aws ec2 reboot-instances " + instanceRequest);
            if (ec2InstanceState(instanceRequest, "reboot-instances")) {
                console.log('Instance stopping.');
                response.end("OK");
            } else {
                console.log('Instance not found.');
                response.end("Instance not found.");
            }
        });
        response.end("OK");     //respond with OK before the operation finishes
    } 
}

//handles and incoming request by calling the appropriate handler based on the URL
function handleRequest(request, response){
    if (request.headers.authorization !== serverinfo.pass) {
        console.log("Invalid authorization header");
        response.end();
        return;
    }
    if (handlers[request.url]) {
        handlers[request.url](request,response);
    } else {
        console.log("Unknown request URL: ",request.url);
        response.end();
    }
}

function ec2InstanceState(instance, command) {
    console.log("aws ec2 describe-instances --filters \"Name=tag:Purpose,Values=" + instance + "\"")
    describeInstance = exec("aws ec2 describe-instances --filters \"Name=tag:Purpose,Values=" + instance + "\" | jq \".Reservations[].Instances[].InstanceId\" -r | xargs aws ec2 " + command + " --instance-ids", function(err, stdout, stderr) {
      if (err) {
        // should have err.code here?
      }
      console.log(stdout);
    });
}

//start the tcp server
http.createServer(handleRequest).listen(serverinfo.port,function(){
    console.log("Server listening on port %s", serverinfo.port);
});