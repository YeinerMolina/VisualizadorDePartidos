
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
    })()


//Sockets for connection to the backend 
const socket = io();


URLArray = document.URL.split('/')
ID = URLArray[URLArray.length-1].replace('?',"")

socket.emit('Client: TeamRequestResult',ID)
socket.emit('Client: StartEventosTeam',ID)


socket.on('Server: TeamReplyResult',(data)=>{
    NombreA = data[0]["Equipo A"]
    NombreB = data[0]["Equipo B"]
    
    document.getElementById('Narracion').innerHTML = 'Narracion: ' + NombreA + ' <b>vs</b> ' + NombreB 
    document.getElementById("EventosEspecialesA").innerHTML = 'Eventos especiales: ' + NombreA
    document.getElementById("EventosEspecialesB").innerHTML = 'Eventos especiales: ' + NombreB
})

EnviarDescripcion = document.getElementById('SendButton');
ActualizarA = document.getElementById('ActualizarTeamA')
ActualizarB = document.getElementById('ActualizarTeamB')

Minuto = document.getElementById('Minuto')
Descripcion = document.getElementById('DescrictionGame')


EnviarDescripcion.addEventListener('click',(event)=>{
    event.preventDefault();
    if(Minuto.value != '' && Descripcion.value != ''){

        socket.emit('Client: NewDescription',{ID, Minuto: Minuto.value, Descripcion: Descripcion.value})
        Minuto.value = '';
        Descripcion.value = '';
        alert('Descripción enviada correctamente')
    }
})

AmarillaA = document.getElementById('AmarillaA')
RojaA = document.getElementById('RojaA')
EsquinaA = document.getElementById('EsquinaA')
GolesA = document.getElementById('GolesA')
OutGameA = document.getElementById('OutGameA')
ActualizarTeamA = document.getElementById('ActualizarTeamA')


ActualizarTeamA.addEventListener('click',(event)=>{
    event.preventDefault();
    Campo = '';

    if(AmarillaA.value != ''){
        Campo = 'Amarilla';
        ArrayData = {ID ,Campo, Valor: AmarillaA.value}
        socket.emit('Client: ActualizarEventosTeamA',ArrayData)
    }
    if(RojaA.value != ''){
        Campo = 'Roja';
        ArrayData = {ID ,Campo, Valor: RojaA.value}
        socket.emit('Client: ActualizarEventosTeamA',ArrayData)
    }
    if(EsquinaA.value != ''){
        Campo = 'Esquina';
        ArrayData = {ID ,Campo, Valor: EsquinaA.value}
        socket.emit('Client: ActualizarEventosTeamA',ArrayData)
    }
    if(GolesA.value != ''){
        Campo = 'Gol';
        ArrayData = {ID ,Campo, Valor: GolesA.value}
        socket.emit('Client: ActualizarEventosTeamA',ArrayData)
    }
    if(OutGameA.value != ''){
        Campo = 'OutGame';
        ArrayData = {ID, Campo, Valor: OutGameA.value}
        socket.emit('Client: ActualizarEventosTeamA',ArrayData)
    }

    AmarillaA.value = '';
    RojaA.value = '';
    EsquinaA.value = '';
    GolesA.value = '';
    OutGameA.value = '';
    alert('Campos actualizados correctamente')
})

ActualizarTeamB.addEventListener('click',(event)=>{
    event.preventDefault();
    Campo = '';

    if(AmarillaB.value != ''){
        Campo = 'Amarilla';
        ArrayData = {ID ,Campo, Valor: AmarillaB.value}
        socket.emit('Client: ActualizarEventosTeamB',ArrayData)
    }
    if(RojaB.value != ''){
        Campo = 'Roja';
        ArrayData = {ID ,Campo, Valor: RojaB.value}
        socket.emit('Client: ActualizarEventosTeamB',ArrayData)
    }
    if(EsquinaB.value != ''){
        Campo = 'Esquina';
        ArrayData = {ID ,Campo, Valor: EsquinaB.value}
        socket.emit('Client: ActualizarEventosTeamB',ArrayData)
    }
    if(GolesB.value != ''){
        Campo = 'Gol';
        ArrayData = {ID ,Campo, Valor: GolesB.value}
        socket.emit('Client: ActualizarEventosTeamB',ArrayData)
    }
    if(OutGameB.value != ''){
        Campo = 'OutGame';
        ArrayData = {ID, Campo, Valor: OutGameB.value}
        socket.emit('Client: ActualizarEventosTeamB',ArrayData)
    }

    AmarillaB.value = '';
    RojaB.value = '';
    EsquinaB.value = '';
    GolesB.value = '';
    OutGameB.value = '';
    alert('Campos actualizados correctamente')
})

Finish = document.getElementById('Finish');
Finish.addEventListener('click',(e)=>{
    e.preventDefault()
    Fecha = new Date();
    console.log(Fecha)
    socket.emit('Client: FinishGame',{Fecha, ID});

})