import { useEffect, useState } from "react"; //utilizamos los hooks

const TIEMPO_ENFOQUE = 10; // 25 minutos

const TIEMPO_DESCANSO = 30; // 5 minutos

const Timer = () => {

    const [segundos, setSegundos] = useState(0) //inicalizamos los segundos en cero

    const [activo, setActivo] = useState(false) //el valor con el que iniciará es false. 

    const [modo, setModo] = useState("enfoque");

    const [tiempoEnfoque, setTiempoEnfoque] = useState(25 * 60);   // 25 min

    const [tiempoDescanso, setTiempoDescanso] = useState(5 * 60);   // 5 min
   

    function activeHandle() {
        setActivo(true) //maneja el estado a activo
    }

    function pauseHandle() {
        setActivo(false) //maneja el estado a false para pausarlo. 
    }

    function resetHandle() {
        setSegundos(TIEMPO_ENFOQUE) //lo restablece al tiempo original. 
        setSegundos(tiempoEnfoque) //lo restablece al tiempo original. 
        setModo("enfoque")
        setActivo(false) //cambia el estado a false para que inicie pausado. 
    }

    function timeHandle(e) { //lo agrramoa aquí
        let timeValue = e.target.value * 60; //el e.target.value es el valor el evento que tiene el select
        let timeValueNumber = parseInt(timeValue)
        setTiempoEnfoque(timeValueNumber)
        setSegundos(timeValueNumber)
        setActivo(false)
    }


    function restHandle(e) {
        let restValue = Number(e.target.value) * 60;
        let  restValueNumber = parseInt(restValue)
        setTiempoDescanso(restValueNumber);
        //setSegundos(restValueNumber); // opcional: que se vea el cambio
        setActivo(false);
    }



    useEffect(() => {
        let intervalo;
        if (activo) {
            intervalo = setInterval(() => {
                setSegundos(prev => prev - 1)
            }, 1000)
        }

        return () => {
            clearInterval(intervalo)
        }

    }, [activo])


    useEffect(() => {
        if (segundos === 0 && activo) {
            if (modo === "enfoque") {
                setModo("descanso");
                setSegundos(tiempoDescanso);
            } else {
                setModo("enfoque");
                setSegundos(tiempoEnfoque);
            }
        }
    }, [segundos, modo, activo, tiempoEnfoque, tiempoDescanso]);





function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}




return (
    <>
        <label htmlFor="">Enfoque</label>
        <select onChange={timeHandle}> {/**esto tira un evento e */}
            <option value="0">Seleccionar</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="50">50</option>
        </select>
        <label htmlFor="">Descaso</label>
        <select onChange={restHandle}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
        <h1>{formatearTiempo(segundos)}</h1>
        <button onClick={activeHandle}>Iniciar</button>
        <button onClick={pauseHandle}>Pausar</button>
        <button onClick={resetHandle}>Reset</button>
    </>
)
}


export default Timer;