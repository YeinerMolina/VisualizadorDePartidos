
URLArray = document.URL.split('/')
ID = URLArray[URLArray.length-1]

const socket = io();

socket.emit('Client: ResultRequest',ID)
socket.emit('Client: EventsRequest',ID)
socket.emit('Client: TeamRequestResult',ID)



socket.on('Server: ResultReply',(data)=>{
    Descripcion = ''
    data.forEach(data => {
        Descripcion = Descripcion + `<tr class = 'table-primary' ><td>`+ data["ActualizationTime"] + `</td>
                                        <td> ` + data.Minuto + `</td>
                                        <td>` + data["Descripcion"] + `</td></tr>`
    });
    document.getElementById('Descripcion').innerHTML = Descripcion
})

socket.on('Server: EventsRequest',(data)=>{
    EventosA = '';
    EventosB = '';
    data.forEach(data => {
        EventosA = EventosA + `<tr class = 'table-primary' ><td>`+ data["TarjetasAmarillasA"] + `</td> 
                            <td> ` + data["TarjetasRojasA"] + `</td>
                            <td>` + data["TirosDeEsquinaA"] + `</td>
                            <td> ` + data["GolesEquipoA"] + `</td>
                            <td> ` + data["FueraDeJuegoA"] + `</td></tr>`
        EventosB = EventosB + `<tr class = 'table-primary' ><td>`+ data["TarjetasAmarillasB"] + `</td> 
                            <td> ` + data["TarjetasRojasB"] + `</td>
                            <td>` + data["TirosDeEsquinaB"] + `</td>
                            <td> ` + data["GolesEquipoB"] + `</td>
                            <td> ` + data["FueraDeJuegoB"] + `</td></tr>`
    
    });
    document.getElementById('EventosA').innerHTML = EventosA
    document.getElementById('EventosB').innerHTML = EventosB
})

socket.on('Server: TeamReplyResult',(data)=>{
    NombreA = data[0]["Equipo A"]
    NombreB = data[0]["Equipo B"]
    
    document.getElementById('PartidoTitle').innerHTML = 'Partido en curso: ' + NombreA + ' <b>vs</b> ' + NombreB 
    document.getElementById("PartidoEventosA").innerHTML = 'Eventos especiales: ' + NombreA
    document.getElementById("PartidoEventosB").innerHTML = 'Eventos especiales: ' + NombreB
})