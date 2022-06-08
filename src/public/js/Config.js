
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

var Row = '';
var btnDelete = 'null';

socket.emit('client: RequireProcedence')


socket.on('Server: NewTablesData',(data)=>{
    TableResultDeploy(data);
})

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

BuscarModify = document.getElementById('BuscarModify');
Back = document.getElementById('Back');

AddPlayer.addEventListener('click',()=>{
    NombrePlayer = PlayerName.value;
    ApellidoPlayer = PlayerLastName.value;
    NumeroPlayer = PlayersNumber.value; 

    if(NombrePlayer != '' && ApellidoPlayer != '' && NumeroPlayer != ''){
        JugadoresNombre.push(NombrePlayer);
        JugadoresApellido.push(ApellidoPlayer);
        JugadoresNumero.push(NumeroPlayer);
        Actual = NewPlayer.innerHTML;
        NewPlayer.innerHTML = Actual + `<li class="list-group-item">` + NombrePlayer + ' ' + ApellidoPlayer + ', ' + NumeroPlayer  + `</li>`

        PlayerName.value = '';
        PlayerLastName.value = '';
        PlayersNumber.value = ''; 
    }

})

BuscarModify.addEventListener('submit',(event)=>{
    event.preventDefault();
    NombreSearch = document.getElementById('NombreBuscar').value;
    TipoSearch = document.getElementById('Type').value;

    socket.emit('client: Search',{NombreSearch,TipoSearch})

})

FormTeam.addEventListener('submit',(event)=>{
    event.preventDefault();
    
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
      
    Procedencia = document.getElementById('ProcedenciaTeam').value;
    Grupo = document.getElementById('Grupo').value;
    NombreVal = TeamName.value;
    LogoVal = Logo.value;
    EntrenadorVal = Entrenador.value;
    if(NombreVal != '' && LogoVal != '' && EntrenadorVal != '' && JugadoresNombre.length > 0 && JugadoresApellido.length > 0 && JugadoresNumero.length > 0 && Procedencia != ''){
        
        socket.emit('client: NewTeam', {Equipo: NombreVal, Logo:files.name, Entrenador: EntrenadorVal, Procedencia, JugadoresName: JugadoresNombre, JugadoresLastName: JugadoresApellido, JugadoresNumber: JugadoresNumero, Grupo})
        alert('Datos enviados correctamente')

    }else if(JugadoresNombre.length == 0){
        alert('El equipo debe tener al menos 1 jugador');
    }
})

ArbitroName = document.getElementById('ArbName');
FormArbitro = document.getElementById('FormArbitro')


FormArbitro.addEventListener('submit', (event)=>{
    event.preventDefault();
    ArbitroNameVal = ArbitroName.value;
    ProcedenciaArb = document.getElementById('ProcedenciaArb').value;
    if(ArbitroNameVal != '' && ProcedenciaArb != ''){
        
        socket.emit('client: newArbitro', {Arbitro: ArbitroNameVal, Procedencia: ProcedenciaArb})
        alert('Datos enviados correctamente')

    }
})

EstadioForm = document.getElementById('EstadioForm');
Estadio = document.getElementById('EstName');
Capacidad = document.getElementById('Capacidad');


EstadioForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    EstadioVal = Estadio.value;
    CapacidadVal = Capacidad.value;
    UbicacionVal = document.getElementById('Ubicacion').value;
    if(EstadioVal != '' && CapacidadVal != '' && Ubicacion != ''){
        
        socket.emit('client: newStadium', {Estadio: EstadioVal, Capacidad: CapacidadVal, Ubicacion: UbicacionVal})
        alert('Datos enviados correctamente')
    }
})


Modificar = document.getElementById('Modificar');
ModificarButton = document.getElementById('btn-Modificar');
DataSelector = document.getElementById('DataSelector');
Back = document.getElementById('Back');
BuscarModify = document.getElementById('BuscarModify');

ModificarButton.addEventListener('click',(event)=>{
    event.preventDefault();
    $('#TableResult').empty();
    Modificar.style.display = '';
    DataSelector.style.display = 'none';
})

Back.addEventListener('click',(event)=>{
    event.preventDefault();
    Modificar.style.display = 'none';
    DataSelector.style.display = '';
})


BuscarModify.addEventListener('click',(event)=>{
    event.preventDefault();
    Busqueda = document.getElementById('NombreBuscar').value;
    Type = document.getElementById('Type').value;
    Row = '';
    $('#TableResult').empty();
    socket.emit('client: busquedaRequest',{Busqueda,Type});
})

function Eliminar(Type,identificacion){
    socket.emit('Client: EliminarParametro',({Type,identificacion}))
    Busqueda = document.getElementById('NombreBuscar').value;
    Type = document.getElementById('Type').value;
    Row = '';
    socket.emit('client: busquedaRequest',{Busqueda,Type});
    alert('Eliminado')
}

function TableResultDeploy(data){

    data.forEach((data) => {

        if (data.nombreequipo != undefined){
            Row = "<tr class = 'table-primary' ><td>" + data.nombreequipo + "</td><td> Equipo de futbol </td><td><a href='/Selected/Configuracion/Equipo/" + data.idequipo + "' class='btn btn-primary'>Modificar</a><button class='delete btn btn-danger' onclick = Eliminar('Equipo',"+ data.idequipo +")>Eliminar</button></td></tr>"
            $('#TableResult').append(Row);
        }
        if (data.nombrejugador != undefined){

            Row = "<tr class = 'table-primary' ><td>" + data.nombrejugador + "</td><td> Jugador de futbol </td><td><a href='/Selected/Configuracion/Jugador/" + data.idjugador + "' class='btn btn-primary'>Modificar</a><button class='delete btn btn-danger' onclick = Eliminar('Jugador',"+ data.idjugador +")>Eliminar</button></td></tr>"
            $('#TableResult').append(Row);
        }
        if (data.nombreestadio != undefined){

            Row = "<tr class = 'table-primary' ><td>" + data.nombreestadio + "</td><td> Estadio </td><td><a href='/Selected/Configuracion/Estadio/" + data.idestadio + "' class='btn btn-primary'>Modificar</a><button class='delete btn btn-danger' onclick = Eliminar('Estadio',"+ data.idestadio +")>Eliminar</button></td></tr>"
            $('#TableResult').append(Row);
        }
        if (data.nombrearbitro != undefined){

            Row = "<tr class = 'table-primary' ><td>" + data.nombrearbitro + "</td><td> Arbitro </td><td><a href='/Selected/Configuracion/Arbitro/" + data.idarbitro + "' class='btn btn-primary'>Modificar</a><button class='delete btn btn-danger' onclick = Eliminar('Arbitro',"+ data.idarbitro +")>Eliminar</button></td></tr>"
            $('#TableResult').append(Row);
        }
    })
    btnDelete = document.querySelector('.delete');
}



