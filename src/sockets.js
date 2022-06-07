module.exports = io => {
    io.on('connection',(socket) => {

        console.log('New user connected');
        socket.on('client: NewTeam', (NewTeam) =>  {
            NuevoEquipo(NewTeam);
        })

        socket.on('client: newArbitro', (newArbitro)=>{
            NuevoArbitro(newArbitro)
        })

        socket.on('client:RequireProcedence',()=>{
            ProcedenceRequest(socket);
        })

        socket.on('client: newStadium', (newStadium)=>{
            NuevoEstadio(newStadium)
        })

        socket.on('client: busquedaRequest',(Busqueda)=>{

            BusquedaModify(socket,Busqueda);
        })
        
        socket.on('Client: EstadimunRequest',()=>{
            EstadimunRequest(socket);
        })

        socket.on('Client: TeamsRequest',()=>{
            TeamsRequest(socket);
        })

        socket.on('Client: ArbitroListoProgramacion',(Equipos)=>{
            ArbitroListoProgramacion(socket, Equipos)
        })
        
        socket.on('Client: NewProgramming',(Programacion)=>{
            Programar(Programacion);
        })

        socket.on('Client: ProgramacionBusquedaRequest', (Busqueda) => {
            BuscarProgramacion(socket,Busqueda);
        })

        socket.on('Client: RequestProgramation',(FechaH)=>{
            RequestProgramation(socket, FechaH);
        })

        socket.on('Client: ResultRequest',(ID)=>{
            ResultReques(socket,ID);
        })

        socket.on('Client: EventsRequest',(ID)=>{
            EventsRequest(socket,ID);
        })

        socket.on('Client: TeamRequestResult',(ID)=>{
            TeamRequestResult(socket,ID);
        })

        socket.on('Client: NewDescription',(Descripcion)=>{
            NewDescription(Descripcion);
        })

        socket.on('Client: ActualizarEventosTeamA',(ArrayData)=>{
            ActualizarEventosTeamA(ArrayData);
        })

        socket.on('Client: StartEventosTeam',(ID)=>{
            StartEventosTeam(ID);
        })

        
        socket.on('Client: ActualizarEventosTeamB',(ArrayData)=>{
            ActualizarEventosTeamB(ArrayData);
        })

        socket.on('Client: FinishGame',(DatosFinish)=>{
            FinishGame(DatosFinish);
        })

    })
}

function NuevoEquipo(NewTeam){
   
    Grupos = '`equipos`';
    Query2 = "SELECT idequipo FROM futbol.equipos  WHERE nombreequipo=? LIMIT 1";
    Query = "INSERT INTO `futbol`.`equipos` (`nombreequipo`, `dtequipo`, `logoequipo`,`procedenciaequipo`,`Grupo`) VALUES (?, ?, ?,?,?)";

    dataArray = [NewTeam.Equipo,NewTeam.Entrenador,NewTeam.Logo,NewTeam.Procedencia,NewTeam.Grupo]
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }
    })


    connection.query(Query2,[NewTeam.Equipo], (error,data)=>{
        if(error){
            console.log(error);
        }else{
            var IDEquipo = data[0].idequipo;

            NewTeam.JugadoresName.forEach((data,idx,array) => {
                Query = "INSERT INTO `futbol`.`jugadores` (`nombrejugador`, `numerojugador`, `idequipo`) VALUES (?, ?, ?)";
                dataArray = [data + NewTeam.JugadoresLastName[idx], NewTeam.JugadoresNumber[idx], IDEquipo]
                connection.query(Query,dataArray, (error,data)=>{
                    if(error){
                        console.log(error);
                    }
                })
            });
        }
    })

}

function ProcedenceRequest(socket){
    Query = "SELECT * FROM futbol.procedencia";
    connection.query(Query, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server:ProcedenceReply',data)
            
        }
    })
}


function NuevoArbitro(newArbitro){
    Query = "INSERT INTO `futbol`.`arbitros` (`nombrearbitro`, `procedenciaarbitro`) VALUES (?, ?)";
    dataArray = [newArbitro.Arbitro, newArbitro.Procedencia]
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function NuevoEstadio(newStadium){
    Query = "INSERT INTO `futbol`.`estadios` (`nombreestadio`, `precedenciaestadio`, `capacidad`) VALUES (?, ?,?)";
    dataArray = [newStadium.Estadio, newStadium.Ubicacion, newStadium.Capacidad];
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function BusquedaModify(socket,Busqueda){
    var DB = '';
    switch (Busqueda.Type){
        case '2':
            DB = [`equipos`]
            Column = [`nombreequipo`]
            break;
        case '3':
            DB = ['arbitros']
            Column = `nombrearbitro`
            break;
        case '4':
            DB = ['jugadores']
            Column = `nombrejugador`
            break;
        case '5':
            DB = ['estadios']
            Column = `nombreestadio`
            break;
        default:
            Column = [`nombreequipo`,`nombreequipo`,`nombrejugador`,`nombreestadio`,`nombrearbitro`]
            DB = [`equipos`,`equipos2`,`jugadores`,`estadios`,`arbitros`];
            break;
    } 
    like = Busqueda.Busqueda;
    if (DB.length > 1){
        for (var i=0; i < DB.length; i++){
            dataArray = [like+'%'];
            Query = "SELECT * FROM futbol."+ DB[i] +" WHERE "+Column[i]+" LIKE ?";
            connection.query(Query, dataArray, (error,data)=>{
                if(error){
                    console.log(error);
                }else{
                    socket.emit('Server: NewTablesData',(data))
                }
            })

        }
    }else{
        dataArray = [like+'%'];
        Query = "SELECT * FROM futbol."+ DB[0] +" WHERE "+Column +" LIKE ?";
        connection.query(Query, dataArray, (error,data)=>{
            if(error){
                console.log(error);
            }else{
                socket.emit('Server: NewTablesData',(data))
                
            }
        })
    }
}

function EstadimunRequest(socket){
    Query = "SELECT * FROM futbol.estadios";
    connection.query(Query, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: EstadimunReply',data)
            
        }
    })
}

function TeamsRequest(socket){
    Query = "SELECT * FROM futbol.equipos";
    connection.query(Query, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: TeamsReply',data)
        }
    })
}

function ArbitroListoProgramacion(socket, Equipos){

    Query = "SELECT * FROM futbol.arbitros WHERE procedenciaarbitro != ? AND procedenciaarbitro != ?";
    dataArray = [Equipos.EquipoA, Equipos.EquipoB]
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: ArbitroListProgramacionReply',data)
        }
    })
}

function Programar(Programacion){

    Query = "INSERT INTO `futbol`.`Programacion` (`Equipo A`, `Equipo B`, `Arbitro`, `Estadio`, `Fecha`) VALUES (?,?,?,?,?);"
    dataArray = [Programacion.EquipoA, Programacion.EquipoB, Programacion.Arbitro, Programacion.Estadio, Programacion.Fecha]
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function BuscarProgramacion(socket,Busqueda){

    dataArray = [Busqueda.Fecha + " 00:00:00", Busqueda.Fecha + " 23:59:59", Busqueda.Busqueda+'%', Busqueda.Busqueda+'%'];
    Query = "SELECT futbol.Programacion.Arbitro FROM futbol.Programacion WHERE ((fecha>=? AND fecha<=?) || futbol.Programacion.`Equipo A` LIKE ? || futbol.Programacion.`Equipo B` LIKE ?)";
    connection.query(Query, dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            data.forEach((data)=>{
                dataArray = [data.Arbitro, data.Arbitro, Busqueda.Fecha + " 00:00:00", Busqueda.Fecha + " 23:59:00", Busqueda.Busqueda+'%', Busqueda.Busqueda+'%'];
                Query = "SELECT futbol.arbitros.nombrearbitro, futbol.Programacion.* FROM futbol.arbitros, futbol.Programacion WHERE futbol.arbitros.idarbitro = (?) AND futbol.Programacion.Arbitro = (?)"
                connection.query(Query, dataArray, (error,data)=>{
                    if(error){
                        console.log(error);
                    }else{
                        socket.emit('Server: NewTablesData',(data))
                    }
                })
            })
        }
    })
}


function RequestProgramation(socket, FechaH){
    Query = "SELECT * FROM futbol.Programacion WHERE DATE(Fecha)=?";
    connection.query(Query,FechaH, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: ProgramationReply',data)
        }
    })
}

function ResultReques(socket,ID){
    Query = "SELECT * FROM futbol.OnlineGame WHERE IDGame =?";
    connection.query(Query,ID, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: ResultReply',data)
        }
    })
}

function EventsRequest(socket,ID){

    Query = "SELECT * FROM futbol.OnlineGameEvents WHERE IDGame =?";
    connection.query(Query,ID, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: EventsRequest',data)
        }
    })
}

function TeamRequestResult(socket,ID){
    Query = "SELECT * FROM futbol.Programacion WHERE IDProgramacion =?";
    connection.query(Query,ID, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: TeamReplyResult',data)
        }
    })
}

function NewDescription(Descripcion){
    Query = "INSERT INTO `futbol`.`OnlineGame` (`IDGame`, `Descripcion`, `Minuto`) VALUES (?, ?, ?)";
    dataArray = [Descripcion.ID,Descripcion.Descripcion, Descripcion.Minuto]
    connection.query(Query,dataArray, (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function ActualizarEventosTeamA(ArrayData){

    switch(ArrayData.Campo){
        case 'Amarilla':
            dataArray = [`TarjetasAmarillasA`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Roja':
            dataArray = [`TarjetasRojasA`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Esquina':
            dataArray = [`TirosDeEsquinaA`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Gol':
            dataArray = [`GolesEquipoA`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'OutGame':
            dataArray = [`FueraDeJuegoA`,ArrayData.Valor, ArrayData.ID]
            break;
    }
    Query =  "UPDATE `futbol`.`OnlineGameEvents` SET "+ dataArray[0] +" = ? WHERE (`IDGame` = ?);"
    connection.query(Query,[dataArray[1],dataArray[2]], (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function ActualizarEventosTeamB(ArrayData){

    switch(ArrayData.Campo){
        case 'Amarilla':
            dataArray = [`TarjetasAmarillasB`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Roja':
            dataArray = [`TarjetasRojasB`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Esquina':
            dataArray = [`TirosDeEsquinaB`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'Gol':
            dataArray = [`GolesEquipoB`,ArrayData.Valor, ArrayData.ID]
            break;
        case 'OutGame':
            dataArray = [`FueraDeJuegoB`,ArrayData.Valor, ArrayData.ID]
            break;
    }
    Query =  "UPDATE `futbol`.`OnlineGameEvents` SET "+ dataArray[0] +" = ? WHERE (`IDGame` = ?);"
    connection.query(Query,[dataArray[1],dataArray[2]], (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

function StartEventosTeam(ID){
    Query = "SELECT * FROM futbol.OnlineGameEvents WHERE IDGame=?;"
    connection.query(Query,ID, (error,data)=>{
        if(error){
            console.log(error);
        }else{
            if(data.length === 0){
                Query = "INSERT INTO `futbol`.`OnlineGameEvents` (`IDGame`, `TarjetasAmarillasA`, `TarjetasRojasA`, `TirosDeEsquinaA`, `GolesEquipoA`, `FueraDeJuegoA`, `GolesEquipoB`, `FueraDeJuegoB`, `TarjetasAmarillasB`, `TarjetasRojasB`, `TirosDeEsquinaB`) VALUES (?, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');"
                connection.query(Query,ID, (error,data)=>{
                    if(error){
                        console.log(error);
                    }
                })
            }
        }
    })

}
function FinishGame(DatosFinish){
    Query = "UPDATE `futbol`.`Programacion` SET `FechaFinal` = ? WHERE (`IDProgramacion` = ?);"
    connection.query(Query,[DatosFinish.Fecha, DatosFinish.ID], (error,data)=>{
        if(error){
            console.log(error);
        }
    })
}

const connection = require('../database/db');