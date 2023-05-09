function listEmployeesAndProjectsByCity(){
    var string = document.getElementById('city').value;
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/?city=" + string;
    request.open("GET", url, true);
    request.onreadystatechange = function () {
        var table;
        if (request.readyState == request.DONE && request.status == 200) {
            try{    
                var data = JSON.parse(request.responseText);
                table = "<TABLE>";
                table += "<tr><th>FirstName</th><th>LastName</th><th>ProjectName</th><th>CityName</th></tr>";    
                for (var row in data) {
                    table += ("<TR>");
                    var colCount = 0;
                    for (var field in data[row]) {
                        table += ("<TD>" + data[row][field] + "</TD>");
                    
                        colCount++;
                            if (colCount == 4) { // limit to 4 columns
                                break;
                            }
                    }
                    table += ("</TR>");
                }
                table += "</TABLE>";

                // Create the popup window and add the table to it
                var popup = document.createElement('div2');
                popup.classList.add('popup');
                popup.innerHTML = '<span class="close" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">&times;</span>' + table;
                document.body.appendChild(popup);
            } catch(e){
                console.error(e);
            }
        }
    }
    request.send(null);
}