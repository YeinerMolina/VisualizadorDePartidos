
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
Type = URLArray[URLArray.length-2].replace('?',"")

Equipo = document.getElementById('equipos');
Arbitros = document.getElementById('Arbitros');
Estadios = document.getElementById('Estadios');

switch(Type){
    case 'Equipo':
        Equipo.style.display = ''
        Arbitros.style.display = 'none'
        Estadios.style.display = 'none'
        break;
    case 'Jugador':
        Equipo.style.display = ''
        Arbitros.style.display = 'none'
        Estadios.style.display = 'none'
        break;
    case 'Estadio':
        Equipo.style.display = 'none'
        Arbitros.style.display = 'none'
        Estadios.style.display = ''
        break;
    case 'Arbitro':
        Equipo.style.display = 'none'
        Arbitros.style.display = ''
        Estadios.style.display = 'none'
        break;
}


var Row = '';
var btnDelete = 'null';

socket.emit('client: RequireProcedence')
socket.emit('client: Requiredata',{Type,ID})


socket.on('Server:ProcedenceReply',(data)=>{
    SelectTeam = `<select class="form-select" id="ProcedenciaTeam" required> 
                <option selected disabled value=""> Seleccionar </option>`;

    SelectArb = `<select class="form-select" id="ProcedenciaArb" required> 
                <option selected disabled value=""> Seleccionar </option>`;

    SelectStadium = `<select class="form-select" id="Ubicacion" required> 
                    <option selected disabled value=""> Seleccionar </option>`;

     
    Options = '';

    data.forEach((data)=>{
        Options = Options + `
        <option value="`+ data.idprocedecia +`">` + data.procedencia + `</option>`
    })    
    SelectTeam = SelectTeam + Options+`</select> `
    document.getElementById('SelectPT').innerHTML = SelectTeam;
    SelectArb = SelectArb + Options +`</select> `
    document.getElementById('SelectPA').innerHTML = SelectArb;
    SelectStadium = SelectStadium + Options + `</Select>`;
    document.getElementById('SelectPE').innerHTML = SelectStadium;
     
})



JugadoresNombre = [];
JugadoresApellido = [];
JugadoresNumero = [];

tablerows = document.getElementById('TableResult')

FormTeam = document.getElementById('FormTeam');
TeamName = document.getElementById('TeamName');
Logo = document.getElementById('Logo');
Entrenador = document.getElementById('Entrenador');


AddPlayer = document.getElementById('AddPlayer');
NewPlayer = document.getElementById('NewPlayer');
PlayerName = document.getElementById('PlayersName');
PlayerLastName = document.getElementById('PlayersLastName');
PlayersNumber = document.getElementById('PlayersNumber');

ArbitroName = document.getElementById('ArbName');
FormArbitro = document.getElementById('FormArbitro')

EstadioForm = document.getElementById('EstadioForm');
Estadio = document.getElementById('EstName');
Capacidad = document.getElementById('Capacidad');

BuscarModify = document.getElementById('BuscarModify');
Back = document.getElementById('Back');

AddPlayer.addEventListener('click',()=>{
    NombrePlayer = PlayerName.value;
    ApellidoPlayer = PlayerLastName.value;
    NumeroPlayer = PlayersNumber.value; 

    if(NombrePlayer != '' && ApellidoPlayer != '' && NumeroPlayer != ''){
        JugadoresNombre = NombrePlayer
        JugadoresApellido = ApellidoPlayer
        JugadoresNumero = NumeroPlayer
        
        socket.emit('Client: ModifyPlayer',{JugadoresNombre, JugadoresApellido, JugadoresNumero,ID})
        alert('Datos enviados correctamente')
        location.href= '/Configuracion';
    }

})


socket.on('Server: ReplyData',(data)=>{
    
    ProcedenciaTeam = document.getElementById('ProcedenciaTeam');
    ProcedenciaArb = document.getElementById('ProcedenciaArb');
    ProcedenciaEst = document.getElementById('Ubicacion');

    GrupoTeams = document.getElementById('GrupoTeams');
    switch(Type){
        case 'Equipo':

            TeamName.value = data[0].nombreequipo;
            Entrenador.value = data[0].dtequipo;
            ProcedenciaTeam.value = data[0].procedenciaequipo;
            GrupoTeams.value = data[0].Grupo;

            PlayerName.disabled = true
            PlayerLastName.disabled = true
            PlayersNumber.disabled = true
            AddPlayer.disabled = true

 
            break;
        case 'Jugador':

            TeamName.disabled = 'true';
            Entrenador.disabled = 'true';
            ProcedenciaTeam.disabled = 'true';
            GrupoTeams.disabled = 'true';
            document.getElementById('TeamButton').disabled = 'true';

            NyA = data[0].nombrejugador.split(' ')

            PlayerName.value = NyA[0]
            PlayerLastName.value = NyA[1]
            PlayersNumber.value = data[0].numerojugador
            

            break;
        case 'Estadio':


            Estadio.value = data[0].nombreestadio;
            Capacidad.value = data[0].capacidad;
            document.getElementById('Ubicacion').value = data[0].precedenciaestadio

            Equipo.style.display = 'none'
            Arbitros.style.display = 'none'
            Estadios.style.display = ''
            break;
        case 'Arbitro':


            ArbitroName.value = data[0].nombrearbitro;
            document.getElementById('ProcedenciaArb').value = data[0].procedenciaarbitro;


            Equipo.style.display = 'none'
            Arbitros.style.display = ''
            Estadios.style.display = 'none'
            break;
    }
})

FormTeam.addEventListener('submit',(event)=>{
    event.preventDefault();
    
    if(Logo.files.length === 0){
        var formData = new FormData();
        var files = $('#Logo')[0].files[0];
        formData.append('image', files);
        
        $.ajax({
            url: "/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        });   
        LogoVal = Logo.value;  
    }
    
    Procedencia = document.getElementById('ProcedenciaTeam').value;
    Grupo = document.getElementById('GrupoTeams').value;
    NombreVal = TeamName.value;
    EntrenadorVal = Entrenador.value;
    if(NombreVal != '' && EntrenadorVal != ''  && Procedencia != ''){
        
        socket.emit('client: UpdateTeam', {Equipo: NombreVal, Entrenador: EntrenadorVal, Procedencia, Grupo, ID})
        alert('Datos enviados correctamente')
        location.href = '/Configuracion'
    }
})


FormArbitro.addEventListener('submit', (event)=>{
    event.preventDefault();
    ArbitroNameVal = ArbitroName.value;
    ProcedenciaArb = document.getElementById('ProcedenciaArb').value;
    if(ArbitroNameVal != '' && ProcedenciaArb != ''){
        
        socket.emit('client: ModifyArbitro', {Arbitro: ArbitroNameVal, Procedencia: ProcedenciaArb, ID})
        alert('Datos enviados correctamente')
        location.href= '/Configuracion';

    }
})




EstadioForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    EstadioVal = Estadio.value;
    CapacidadVal = Capacidad.value;
    UbicacionVal = document.getElementById('Ubicacion').value;
    if(EstadioVal != '' && CapacidadVal != '' && Ubicacion != ''){
        
        socket.emit('client: ModifyStadium', {Estadio: EstadioVal, Capacidad: CapacidadVal, Ubicacion: UbicacionVal, ID})
        alert('Datos enviados correctamente')
        location.href= '/Configuracion';
    }
})


Modificar = document.getElementById('Modificar');
DataSelector = document.getElementById('DataSelector');




