
const socket = io()


FechaH = new Date().toISOString().split('T')[0];
socket.emit('Client: RequestProgramation',FechaH)

socket.on('Server: ProgramationReply',(data)=>{
    Patidos = ''
    data.forEach(data => {
        Estado = ''
        Accion = ``
        if(data.FechaFinal != null){
            console.log(new Date(data.FechaFinal))
            console.log(new Date())
            if(new Date(data.Fecha) < new Date() && new Date() < new Date(data.FechaFinal)){
                Estado = 'En curso'
                Accion =    `<a href='/Progreso/`+ data.IDProgramacion +`' class='btn btn-primary'>Estado Online</a>
                            <a href='/Narrar/`+ data.IDProgramacion +`' class='btn btn-primary'>Narrar</a>`
            }else if(new Date() > new Date(data.FechaFinal)){
    
                Estado = 'Finalizado'
                Accion = `<a href='/Resultado/`+ data.IDProgramacion +`' class='btn btn-primary'>Ver resultado</a>`
            }else{
                Estado = 'Proximamente'
                Accion = ``
            }
        }else{
            Estado = 'Proximamente'
        }
        

        Patidos = Patidos + `<tr class = 'table-primary' ><td>`+ data["Equipo A"] + " <b>vs</b> " + data["Equipo B"] + `</td>
                            <td> ` + data.Fecha.split('T')[1].replace('Z',"") + `</td> 
                            <td> ` + Estado + `</td><td>` + Accion + `</td></tr>`
    });
    document.getElementById('Partidos').innerHTML = Patidos
})
