
const {io} = require('socket.io-client');

const socket = io("http://127.0.0.1:3000");
socket.on('connect', () => {
    var item = $('<p></p>').text(`A user has been connected ${socket.id}`);
    $('#display').append(item);
})

$('#sendMessage').on('click',function(e){
    e.preventDefault();
    let message = $('#message').val();
    let room =  $('#room').val();


    var item = `<div class="col-md-12"><div class="mt-2" style="border:1px solid #ddd;border-radius: 10px;padding:10px;width:fit-content"> <p> ${message} </p> </div></div>`
    $('#display').append(item);

    socket.emit('message', message , room);
    $('#message').val('');
})

socket.on('message', function(msg) {
    var item = `<div class="col-md-12"><div class="mt-2" style="border:1px solid #ddd;border-radius: 10px;padding:10px;width:fit-content"> <p> ${msg} </p> </div></div>`
    $('#display').append(item);
    window.scrollTo(0, document.body.scrollHeight);
});

$('#join-room').on('click',function(e){
    e.preventDefault();
    let room = $('#room').val();
    let oldRoom = '';

    //check if room is already there else add new url
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if(urlRoom && urlRoom !== room){
        oldRoom = urlRoom;
        currentUrl.searchParams.set('room', room);
        window.history.pushState({}, null, currentUrl);
    }else{
        const newUrl = currentUrl+`?room=${room}`;
        window.history.pushState({}, null, newUrl);
    }

    socket.emit('join-room', room , oldRoom);
})



