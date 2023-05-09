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

    var query; 
    var q = url.parse(req.url, true);
    var path = q.path;

    if(path.includes("projectName")){
        var name = q.query.name;
        var filter = [name];
        query = "SELECT * FROM project WHERE projectName=?"
    }

    else if(path.includes("cityName")){ 
        var name = q.query.cityName;            
        var filter = [name];                    
        query = "SELECT DISTINCT firstName, lastName, projectName, cityname  FROM ((city INNER JOIN project on city.cityID = project.cityID) INNER JOIN works_on on project.projectID=works_on.projectID) INNER JOIN employee on works_on.employeeID=employee.employeeID WHERE cityname = ? ORDER BY projectName, lastName, firstName;"
    }

    con.query(query, filter,
        function (err, result, fields) {
            if (err) console.log("Fehler: " + err.sqlMessage);
            res.end(JSON.stringify(result));
            
        });
    con.end(function (err) {
        console.error(err)
     });

});
myServer.listen(8080);
