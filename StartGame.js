const port = 3000; //Specify a port for our web server
const express = require('express'); //load express with the use of requireJs
var app =express();
var path = require('path');

app.use(express.static(path.join(__dirname+'/')));

app.get('/', function(req,res)
{
    res.sendFile(path.join(__dirname+'/MainView.html'));
});

app.listen(port, function() { //Listener for specified port
    console.log("Server running at: http://localhost:" + port)
});
