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

Indices = [];

socket.emit('Client: EstadimunRequest')

socket.emit('Client: TeamsRequest')

socket.on('Server: EstadimunReply',(data)=>{
    SelectTeam = `<select class="form-select" id="Estadium" required> 
                <option selected disabled value=""> Seleccionar </option>`;
     
    Options = '';

    data.forEach((data)=>{
        Options = Options + `
        <option value="`+ data.idestadio +`">` + data.nombreestadio + `</option>`
    })    
    SelectTeam = SelectTeam + Options+`</select> `
    document.getElementById('SelectPT').innerHTML = SelectTeam;
     
})

socket.on('Server: ArbitroListProgramacionReply',(data)=>{
    Arbitro = `<select class="form-select" id="Arbit" name ="Arbitros" required> 
                    <option selected disabled value=""> Seleccionar </option>`;
    Options = '';

    data.forEach((data)=>{

        Options = Options + `
        <option value="`+ data.idarbitro + `">` + data.nombrearbitro + `</option>`
        
    })    
    Arbitro  = Arbitro  + Options+`</select> `
    document.getElementById('ArbitrosList').innerHTML = Arbitro ;
})

SelectEA = document.getElementById('Equipo-A-Select');
SelectEB = document.getElementById('Equipo-B-Select');


SendProgramming = document.getElementById('SendProgramming');


socket.on('Server: TeamsReply', (data)=>{
    SelectTeamA = `<select class="form-select" id="TeamA" required> 
                <option selected disabled value=""> Seleccionar </option>`;
    SelectTeamB = `<select class="form-select" id="TeamB" required> 
    <option selected disabled value=""> Seleccionar </option>`;
    Indices = [];
    OptionsA = '';
    OptionsB = '';

    data.forEach((data)=>{
        OptionsA = OptionsA + `
        <option class="SelectTeamA" value="`+ data.procedenciaequipo + ", "+ data.idequipo + ", " + data.nombreequipo +`" id="Equipo-A-`+ data.idequipo +`">` + data.nombreequipo + `</option>`
        OptionsB = OptionsB + `
        <option class="SelectTeamB" value="`+  data.procedenciaequipo + ", "+ data.idequipo + ", " + data.nombreequipo + `" id="Equipo-B-`+ data.idequipo +`">` + data.nombreequipo + `</option>`
        Indices.push(data.idequipo)
    })    

    SelectTeamA = SelectTeamA + OptionsA+`</select> `
    document.getElementById('Equipo-A-Select').innerHTML = SelectTeamA;

    SelectTeamB = SelectTeamB + OptionsB +`</select> `
    document.getElementById('Equipo-B-Select').innerHTML = SelectTeamB;
})

SelectEA.addEventListener('change',()=>{
    Selected = document.getElementById('TeamA').value.split(", ")[1];

    Indices.forEach((Indices)=>{
        document.getElementById('Equipo-B-' + Indices).disabled = false;    
    })
    document.getElementById('Equipo-B-' + Selected).disabled = true;
    if(TeamA.value != '' && TeamB.value != ''){
        document.getElementById('ArbitroSelect').style.display = '';
        socket.emit('Client: ArbitroListoProgramacion',({EquipoA: TeamA.value, EquipoB: TeamB.value}))
    }

})

socket.on('Server: NewTablesData',(data)=>{
    TableResultDeploy(data);
})



SelectEB.addEventListener('change',()=>{
    Selected = document.getElementById('TeamB').value.split(", ")[1];

    Indices.forEach((Indices)=>{
        document.getElementById('Equipo-A-' + Indices).disabled = false;    
    })
    document.getElementById('Equipo-A-' + Selected).disabled = true;
    if(TeamA.value != '' && TeamB.value != ''){
        document.getElementById('ArbitroSelect').style.display = '';
        socket.emit('Client: ArbitroListoProgramacion',({EquipoA: TeamA.value, EquipoB: TeamB.value}))
    }
})

SendProgramming.addEventListener('click',(event)=>{

    event.preventDefault();
    Arbitros = document.getElementById('Arbit');
    Estadium = document.getElementById('Estadium');
    DateI = document.getElementById('DateI');
    SelectEA = document.getElementById('TeamA');
    SelectEB = document.getElementById('TeamB');

    if(SelectEA.value != '' && SelectEB.value != '' && Arbitros.value != '' && Estadium.value != '' && DateI.value != ''){
        ProgrammingObject = {EquipoA: SelectEA.value.split(", ")[2], EquipoB: SelectEB.value.split(", ")[2], Arbitro: Arbitros.value, Estadio: Estadium.value, Fecha: DateI.value}
        socket.emit('Client: NewProgramming',ProgrammingObject)
        alert('Datos enviados correctamente')
    }
})

ModificarButton = document.getElementById('btn-Modificar')
DataSelector = document.getElementById('DataSelector')
Back = document.getElementById('Back')


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
    Busqueda = document.getElementById('NombreBusqueda').value;

    Fecha = document.getElementById('DateModification').value;
    Row = '';
    $('#TableResult').empty();
    socket.emit('Client: ProgramacionBusquedaRequest',{Busqueda,Fecha});
})

function TableResultDeploy(data){
    data.forEach((data) => {
            Row = "<tr class = 'table-primary' ><td>" + data["Equipo A"] + "</td><td>" + data["Equipo B"] + "</td><td>" + data.Arbitro + "</td><td>" + data.Fecha.substring(0,10) + "</td><td>" + data.Estadio + "</td><td><a href='/selected/Equipo/" + data.IDProgramacion + "' class='btn btn-primary'>Modificar</a></td></tr>"
            $('#TableResult').append(Row);
    })
}