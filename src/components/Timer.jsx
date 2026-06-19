import { useEffect, useState } from "react"; //utilizamos los hooks
//import '../App.css'
import '../styles/Timer.css'
import confetti from "canvas-confetti"
import formatearTiempo from "../utils/formatearTiempo";
import TimerDisplay from "./TimerDisplay";
import TimeSelectors from "./TimeSelectors";
import TimerControls from "./TimerControls";
import useTask from './hooks/useTasks';


const TIEMPO_ENFOQUE = 10; // 25 minutos

const TIEMPO_DESCANSO = 30; // 5 minutos

const Timer = () => {

    const [segundos, setSegundos] = useState(0) //inicalizamos los segundos en cero

    const [activo, setActivo] = useState(false) //el valor con el que iniciará es false. 

    const [modo, setModo] = useState("enfoque");

    const [tiempoEnfoque, setTiempoEnfoque] = useState(25 * 60);   // 25 min

    const [tiempoDescanso, setTiempoDescanso] = useState(5 * 60);   // 5 min

    const [tarea, setTarea] = useState(() => {
        return localStorage.getItem('tarea') || '';
    })

    const [tareaInput, setTareaInput] = useState('')

    const { tareas, setTareas, tareaActiva, setTareaActiva, agregarTarea, eliminarTarea } = useTask();


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

    const text = tarea ? <p>Tarea: {tarea} </p> : <p>Agregar Tareas</p>;

    function taskHandle(e) {
        setTarea(e.target.value)
    }

    function inputTaskHandle(e) {
        tareaInput(e.target.value)
    }


    useEffect(() => {
        let intervalo;
        if (activo) {
            intervalo = setInterval(() => {
                setSegundos(prev => prev - 1)
            }, 50)
        }

        return () => {
            clearInterval(intervalo)
        }

    }, [activo])


    useEffect(() => {
        if (segundos === 0 && activo) {
            new Audio('/sounds/alarm_clock.mp3').play()
            confetti()
            if (modo === "enfoque" && tareaActiva !== null) {
                const nuevasTareas = tareas.map((t) => {
                    if (t.id === tareaActiva) {
                        return ({ ...t, pomodoros: t.pomodoros + 1 })
                    }
                    return t
                });
                setTareas(nuevasTareas);
                setModo("descanso");
                setSegundos(tiempoDescanso);
            } else {
                setModo("enfoque");
                setSegundos(tiempoEnfoque);
            }
        }
    }, [segundos, modo, activo, tiempoEnfoque, tiempoDescanso]);


    return (
        <>
            <div className="pomodoro-container">
                <TimerDisplay segundos={segundos} />
                <TimeSelectors
                    timeHandle={timeHandle}
                    restHandle={restHandle}
                />
                <div className="buttons">
                    <TimerControls
                        onIniciar={activeHandle}
                        onPausar={pauseHandle}
                        onReset={resetHandle}
                    />
                </div>
            </div>
            <input
                type="text"
                placeholder="¿Qué vas a hacer?"
                value={tarea}
                onChange={taskHandle}
            />
            <span>{text}</span>
            <button onClick={() => agregarTarea(tarea)}>Agregar</button>
            <span>(Pomodoros: {tarea.pomodoros})</span>
            <ul>
                {
                    tareas.map((tarea) => (
                        <li key={tarea.id}>
                            {tarea.texto} - 🍅 {tarea.pomodoros}
                            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
                            <button onClick={() => setTareaActiva(tarea.id)}>Seleccionar</button>
                        </li>
                    ))
                }

            </ul>

        </>


    );
}


export default Timer;