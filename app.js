var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MultiMap = function()
{
    var content = {};
    this.set = function(key, value)
    {
        if (content[key] === undefined) content[key] = [];
        content[key].push(value);
    },
    this.get = function(key)
    {
        return content[key];
    }
    this.numbers = function(key)
    {
        return content[key].length;
    }
    this.remove = function(key,id)
    {
        for(var i=0; i< this.numbers(key); i++){
		if(this.get(key)[i].id == id){
			this.get(key).splice(i,1);
		}
	}
	//console.log("removed " + id);
    }		
};


http.listen(3000, function(){
  console.log('listening on *:3000');
});

var userList = new MultiMap();

io.on('connection', function(socket){

	console.log("user connected " + socket.id);
	
	socket.on('Add user',function(data){
		console.log('ADD USER' + data);	
		socket.userid = data;		
		userList.set(data,socket);
		//console.log(userList.numbers(data));
		//console.log("userid" + userList.get(data)[0].id);
		
	});

	socket.on('Notify',function(data){
		console.log('NOTIFY ' + data);
		for(var i=0; i< userList.numbers(data);i++){
			userList.get(data)[i].emit("Notification","Got");
		}
	});


	socket.on('disconnect', function(){	
    		console.log('user disconnected' + socket.userid);
		delete 	userList[socket.userid];
		userList.remove(socket.userid,socket.id)
  	});

});
