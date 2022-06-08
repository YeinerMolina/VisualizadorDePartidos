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
})

socket.emit('Client: ProgrammingRequest',ID);



socket.on('Server: ProgrammingReply',(data)=>{
    socket.emit('Client: ArbitroListoProgramacion',({EquipoA: data[0]["Equipo A"], EquipoB: data[0]["Equipo B"]}))
})

SendProgramming.addEventListener('click',(event)=>{

    event.preventDefault();
    Arbitros = document.getElementById('Arbit');
    Estadium = document.getElementById('Estadium');
    DateI = document.getElementById('DateI');
    SelectEA = document.getElementById('TeamA');
    SelectEB = document.getElementById('TeamB');

    if(SelectEA.value != '' && SelectEB.value != '' && Arbitros.value != '' && Estadium.value != '' && DateI.value != ''){
        ProgrammingObject = {EquipoA: SelectEA.value.split(", ")[2], EquipoB: SelectEB.value.split(", ")[2], Arbitro: Arbitros.value, Estadio: Estadium.value, Fecha: DateI.value, ID}
        socket.emit('Client: ModifyProgramming',ProgrammingObject)
        alert('Datos modificados correctamente')
        location.href = "/Programacion"
    }
})
