var cache = []
window.onload = function() {
    //set the height of the chat box
    var p = document.getElementById("pbox").offsetHeight
    var screen = window.innerHeight - 120 - p - 30
    screen = screen + "px"
    document.getElementById("box").style.height = screen
    //set the widhth of the message box
    var s = document.getElementById("send").offsetWidth
    var width = window.innerWidth - s - 40
    width = width + "px"
    document.getElementById("in").style.width = width
    //set names
    showname()
    save()
    //sendname()
    //other things
    document.getElementById('in').focus();
    uncache()
};

var socket = io();
console.log('%cJoined Server', "background-color: lightsalmon;")
console.log('%cJavaScript is Loading...', "background-color: lightyellow;")
console.log('%cServer And Client is ready', "background-color: lightgreen;")
/*socket.on('connection', function(){
  console.log('made socket connection');
});*/
//const socket = io.connect('http://localhost:4000');

// Query DOM elements
const message = document.getElementById('in');
const output = document.getElementById('chatbox');
const people = document.getElementById('people');
const uname = document.getElementById('name')
const cachesize = 400

//keypress
document.onkeypress = function (e) {
    if (document.onkeypress) {
        socket.emit('styping', uname.value);
    }
    e = e || window.event;
    // use e.keyCode
    //console.log(event);
    if (event.keyCode === 13) {//"&& event.ctrlKeyuse" for using combinations like 'ctrl+_'
    save()
    sendit()
};

function sendit() {
    console.log("hi")
    if(message.value.length > 0){
        /*socket.emit('chat', {
            message: message.value,
        });*/
        if (uname.value == "") {
            alert("You Do Not Have A username")
        }
        socket.emit('chat', document.getElementById('in').value, uname.value);
      }
      //once the message is sent, reset the innerHTML of the message div to an empty string
        message.value = "";
    }
}
//create date object
var date = new Date().toDateString();

socket.on('chat message', function(msg, name){
    var d = new Date
    var time = d.getHours() + ":" + d.getMinutes() 
    var out = document.createElement("li")
    out.innerHTML =  msg + "<h6>" + time + "</h6>" + "<h6>" + name + "</h6>";
    if (name == uname.value) {
        out.style.float = "right"
        out.style.background = "lightgreen"
    }
    output.append(out);   
    out = document.createElement("br")
    if (name == uname.value) {
        out.style.float = "right"
    }
    output.append(out);
    var m = msg
    cacheit(m)
  });
socket.on('name set', function(name, oldname){
    if (name != uname.value) {
        var out = document.createElement("li")
        out.innerHTML =  name
        out.setAttribute("id", name)
        people.append(out);
        document.getElementById("oldname").remove();
    }
});
socket.on('numpeople', function(nump){
    document.getElementById("nump").innerHTML = "There are " + nump + " people online";
});
  socket.on('typing', function(name){
    document.getElementById("typing").innerHTML = name + " is Typing";
});
function check_web_storage_support() {
    if(typeof(Storage) !== "undefined") {
        return(true);
    }
    else {
        alert("Web storage unsupported!");
        return(false);
    }
}

function showname() {
    if(check_web_storage_support() == true) {
        result = localStorage.getItem('name');
        document.getElementById('you').innerHTML = result;
    }
    if(result === null) {
        result = "user" + (Math.random() * 100000) + 1;
        document.getElementById('you').innerHTML = result;
    }
    uname.value = result;
    save()
}

function save() {
    if(check_web_storage_support() == true) {
        var name = uname;
        if(name.value != '') {
            localStorage.setItem("name", name.value);
            socket.emit('name', uname.value, localStorage.getItem('oldname'));
        }
        else {
        }
    }
}
function saveold() {
    if(check_web_storage_support() == true) {
        var name = uname;
        if(name.value != '') {
            localStorage.setItem("oldname", name.value);
        }
        else {
        }
    }
}
function sendname() {
    socket.emit('name', uname.value, localStorage.getItem('oldname'));
}
function cacheit(msg) {
    if (cache.length < cachesize){
        cache.push(msg)
    } else {
        cache.shift()
        cache.push(msg)
    }
    if(check_web_storage_support() == true) {
        localStorage.setItem("cache", JSON.stringify(cache));//JSON.stringify(cache) JSON.parse(localStorage.getItem("cache"))
    }
}
function uncache() {
    cache = JSON.parse(localStorage.getItem("cache"))
    if (cache != null ) {
        var i = 0;
        do {
            var out = document.createElement("li")
            out.innerHTML =  cache[i];
            output.append(out);   
            out = document.createElement("br")
            output.append(out);
            i++;
        }
        while (i < cache.length);
    }
}