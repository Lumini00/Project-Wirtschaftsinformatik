var mysql = require('mysql2');
var http = require('http');
var https = require('https');
var url = require('url');

var myServer = http.createServer();
myServer.on("request", async function returnResults(req, res) {
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
    var temp = q.temp;

    if(path.includes("project")){
        var name = q.query.project;
        var filter = [name];
        query = "SELECT * FROM project WHERE projectName=?"
    }

    else if(path.includes("city")){ 
        var name = q.query.city;            
        var filter = [name];                    
        query = "SELECT DISTINCT firstName, lastName, projectName, name  FROM ((city INNER JOIN project on city.cityID = project.cityID) INNER JOIN works_on on project.projectID=works_on.projectID) INNER JOIN employee on works_on.employeeID=employee.employeeID WHERE name = ? ORDER BY projectName, lastName, firstName;"
    }

    else if(path.includes("minCost")){
        var minValue = q.query.minCost;
        var maxValue = q.query.maxCost;
        var filter = [minValue, maxValue];                    
        query = "SELECT ProjectID, ProjectName, MaximumCosts FROM project WHERE maximumCosts BETWEEN ? AND ? ORDER BY maximumCosts;"
    }


    con.query(query, filter,
        async function (err, result, fields) {
            if (err) console.log("Fehler: " + err.sqlMessage);
            res.end(JSON.stringify(result));
            console.log(result)
        });
    con.end(function (err) {
        console.error(err)
     });

});
myServer.listen(8080);
