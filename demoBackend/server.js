var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();

var pool      =    mysql.createPool({
    connectionLimit : 10, // set the limit connection
    host     : '127.0.0.1',
	port	 : 3306,
    user     : 'root',
    password : 'root',
    database : 'casa-web', // change into casa-web
    debug    : false,
	acquireTimeout : 30000
});

app.use(express.static('public'));

// connect to mysql database 
function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          console.log(err);
		  res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        // output the threadId
        console.log('connection id: ' + connection.threadId);
        
        // change into casa-web.accidents_london order by Speed_limit
        // change: Accident_Index Date Road_Type Number_of_Vehicles
        // 'SELECT * from `casa-web`.accidents_london order by Speed_limit'
        // SELECT Accident_Index, Time, Road_Type, Number_of_Vehicles from `casa-web`.accidents_london
        // SELECT Date, str_to_date(Date,'%d/%m/%Y') as 'riqi' FROM `casa-web`.accidents_london where Road_Type is not null; 
        // select time, str_to_date(Time, '%H:%i') as 'time_formated' from `casa-web`.accidents_london;
        // v2 select Accident_Index, str_to_date(t2.Datetime, '%d/%m/%Y %H:%i:%s') as Time_format, Road_Type, Number_of_Vehicles  from  `casa-web`.accidents_london as t1, (select Accident_Index, concat(Date,Time) as Datetime from `casa-web`.accidents_london) as t2  where t1.Accident_Index = t2.Accident_Index
        // v1 SELECT Accident_Index, str_to_date(Date, '%d/%m/%Y') as Time_format, Road_Type, Number_of_Vehicles from `casa-web`.accidents_london LIMIT 1000
        connection.query("SELECT Accident_Index, str_to_date(Date, '%d/%m/%Y') as Time_format, Road_Type, Number_of_Vehicles from `casa-web`.accidents_london where Road_type is not null limit 5", function(err, rows, fields) {

            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

// app.get("/service1",function())
app.get("/service",function(req,res){
        handle_database(req,res);
});

app.listen(3000);

