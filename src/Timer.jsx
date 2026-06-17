import { useEffect, useState } from "react"; //utilizamos los hooks
import './App.css'

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
        let restValueNumber = parseInt(restValue)
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
        <div className="pomodoro-container">
            <h1>{formatearTiempo(segundos)}</h1>
            <div className="controls">
                <label>Enfoque</label>
                <select onChange={timeHandle}>
                    <option value="0">Seleccionar</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                </select>
                <label>Descanso</label>
                <select onChange={restHandle}>  <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option></select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-music"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v13" /><path d="M9 8h10" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sun"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>
            </div>
            <div className="buttons">
                
                <button className="btn-primary" onClick={activeHandle}>Iniciar</button>
                <button className="btn-secondary" onClick={pauseHandle}>Pausar</button>
                <button className="btn-reset" onClick={resetHandle}>Reset</button>
            </div>
        </div>
    );
}


export default Timer;