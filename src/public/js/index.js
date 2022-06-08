
const socket = io()
IDProgram = [];
Victorias = [];
Jugadores = [];

FechaH = new Date().toISOString().split('T')[0];
socket.emit('Client: RequestProgramation',FechaH)
socket.emit('Client: TablePositionRequest')

socket.on('Server: Victorias',(data)=>{
    Victorias = [];
    data.forEach(data=>{
        if(data.Victoria=='A'){
            Victorias.push(data["Equipo A"])
        }else{
            Victorias.push(data["Equipo B"])
        }
    })
})

socket.on('Server: Jugadores',(data)=>{
    Jugadores = data;
})


socket.on('Server: TablePositionReply',(data)=>{
    TablaRepeticiones = [];
    Positiones = "";
    Dropdown = [];
    data.forEach(data=>{
        DropdownHTML = '';
        Repeticiones = 0;
        Victorias.forEach(Victorias=>{
            if(Victorias == data.nombreequipo){
                Repeticiones++;
            }
        })
        TablaRepeticiones.push([data.nombreequipo,Repeticiones])
        Jugadores.forEach(Jugadores=>{
            if(Jugadores.idequipo == data.idequipo){
                DropdownHTML = DropdownHTML + `<li><a class="dropdown-item">` + Jugadores.nombrejugador + ", "+ Jugadores.numerojugador +`</a></li>` 
            }
        })
        Dropdown.push(DropdownHTML)
    })
    
    for(let i = 0; i < TablaRepeticiones.length; i++){
        for(let j=0; j < TablaRepeticiones.length - i -1; j++){
            if(TablaRepeticiones[j][1]<TablaRepeticiones[j+1][1]){
                guardar = TablaRepeticiones[j][1];
                TablaRepeticiones[j][1] = TablaRepeticiones[j+1][1];
                TablaRepeticiones[j+1][1] = guardar; 
                guardar = Dropdown[j];
                Dropdown[j] = Dropdown[j+1];
                Dropdown[j+1] = guardar; 
                   
                [TablaRepeticiones[j][0],TablaRepeticiones[j+1][0]] = [TablaRepeticiones[j+1][0],TablaRepeticiones[j][0]]
            }
        }
    }


    
    i = 0;
    TablaRepeticiones.forEach((TablaRepeticiones,idx)=>{
        i++;
        Positiones = Positiones + `<tr class = 'table-primary' ><td>`+ i + `</td>
                            <td> ` + `<div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                              ` + TablaRepeticiones[0] + `
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">` + Dropdown[idx] + `</ul>
                            </div></td> 
                            <td> ` + TablaRepeticiones[1] + `</td></tr>`
    })
    document.getElementById('Posiciones').innerHTML = Positiones;
})


socket.on('Server: TablePositionReplyB',(data)=>{
    TablaRepeticiones = [];
    Positiones = "";
    Dropdown = [];
    data.forEach(data=>{
        DropdownHTML = '';
        Repeticiones = 0;
        Victorias.forEach(Victorias=>{
            if(Victorias == data.nombreequipo){
                Repeticiones++;
            }
        })
        TablaRepeticiones.push([data.nombreequipo,Repeticiones])
        Jugadores.forEach(Jugadores=>{
            if(Jugadores.idequipo == data.idequipo){
                DropdownHTML = DropdownHTML + `<li><a class="dropdown-item">` + Jugadores.nombrejugador + ", "+ Jugadores.numerojugador +`</a></li>` 
            }
        })
        Dropdown.push(DropdownHTML)
    })
    
    for(let i = 0; i < TablaRepeticiones.length; i++){
        for(let j=0; j < TablaRepeticiones.length - i -1; j++){
            if(TablaRepeticiones[j][1]<TablaRepeticiones[j+1][1]){
                guardar = TablaRepeticiones[j][1];
                TablaRepeticiones[j][1] = TablaRepeticiones[j+1][1];
                TablaRepeticiones[j+1][1] = guardar; 
                guardar = Dropdown[j];
                Dropdown[j] = Dropdown[j+1];
                Dropdown[j+1] = guardar; 
                   
                [TablaRepeticiones[j][0],TablaRepeticiones[j+1][0]] = [TablaRepeticiones[j+1][0],TablaRepeticiones[j][0]]
            }
        }
    }


    
    i = 0;
    TablaRepeticiones.forEach((TablaRepeticiones,idx)=>{
        i++;
        Positiones = Positiones + `<tr class = 'table-primary' ><td>`+ i + `</td>
                            <td> ` + `<div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                              ` + TablaRepeticiones[0] + `
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">` + Dropdown[idx] + `</ul>
                            </div></td> 
                            <td> ` + TablaRepeticiones[1] + `</td></tr>`
    })
    document.getElementById('PosicionesB').innerHTML = Positiones;
})

socket.on('Server: ProgramationReply',(data)=>{
    Patidos = ''
    IDProgram = [];
    Victorias = [];
    data.forEach(data => {
        Estado = ''
        Accion = ``
        console.log(data.FechaFinal == null)
        if(new Date(data.Fecha) < new Date()){
            Estado = 'En curso'
            Accion =    `<a href='/Progreso/`+ data.IDProgramacion +`' class='btn btn-primary'>Estado Online</a>
                        <a href='/Narrar/`+ data.IDProgramacion +`' class='btn btn-primary'>Narrar</a>`
            Resultado = ``
        }else if(data.FechaFinal != null && data.Victoria != null){

            Estado = 'Finalizado'
            Accion = `<a href='/Resultado/`+ data.IDProgramacion +`' class='btn btn-primary'>Ver resultado</a>`
        }else{
            Estado = 'Proximamente'
            Accion = ``
            Resultado = ``
        }
        

        Patidos = Patidos + `<tr class = 'table-primary' ><td>`+ data["Equipo A"] + " <b>vs</b> " + data["Equipo B"] + `</td>
                            <td id=Result-` + data.IDProgramacion + `></td> 
                            <td> ` + data.Fecha.split('T')[1].replace('Z',"") + `</td> 
                            <td> ` + Estado + `</td><td>` + Accion + `</td></tr>`
        IDProgram.push(data.IDProgramacion);
    });
    document.getElementById('Partidos').innerHTML = Patidos
    socket.emit('Client: RequesResult',IDProgram)
})


socket.on('Server: ReplyResult', (data)=>{
    data.forEach(data=>{
        document.getElementById('Result-' + data.IDGame).innerHTML = data.GolesEquipoA + ' - ' + data.GolesEquipoB
    })
})