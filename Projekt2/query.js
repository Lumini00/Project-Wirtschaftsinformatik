var mysql = require('mysql2');
var http = require('http');
var url = require('url');

var myServer = http.createServer();
myServer.on("request", function returnResults(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); //optional
    res.writeHead(200, { 'Content-Type': 'application/json' });

    var con = mysql.createConnection({
        host: "wi2-project-server.mysql.database.azure.com",
        port: "3306",
        user: "wi2-student",
        password: "wirtschaftsinformatik-2023",
        database: "wi-2-project"
    });

    var q = url.parse(req.url, true);
    var name = q.query.project;


    con.query("SELECT * FROM project WHERE projectName=?", [name],
        function (err, result, fields) {
            if (err) console.log("Fehler: " + err.sqlMessage);
            res.end(JSON.stringify(result));
            console.log(result);
        });
    con.end(function (err) { });

});
myServer.listen(8080);
