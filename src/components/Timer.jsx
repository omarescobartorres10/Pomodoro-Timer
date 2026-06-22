import { useEffect, useState, useRef } from "react";
import '../styles/Timer.css';
import confetti from "canvas-confetti";
import TimerDisplay from "./TimerDisplay";
import TimeSelectors from "./TimeSelectors";
import TimerControls from "./TimerControls";
import useTask from './hooks/useTasks';

const Timer = () => {
    const [segundos, setSegundos] = useState(25 * 60);
    const [activo, setActivo] = useState(false);
    const [modo, setModo] = useState("enfoque");
    const [tiempoEnfoque, setTiempoEnfoque] = useState(25 * 60);   // 25 min
    const [tiempoDescanso, setTiempoDescanso] = useState(5 * 60);   // 5 min
    const [tarea, setTarea] = useState(() => {
        return localStorage.getItem('tazrea') || '';
    });

    const { tareas, setTareas, tareaActiva, setTareaActiva, agregarTarea, eliminarTarea } = useTask();
    const audioRef = useRef(null);

    // Save current task input to localStorage to keep user's original logic
    useEffect(() => {
        localStorage.setItem('tazrea', tarea);
    }, [tarea]);

    const handleAgregar = () => {
        if (tarea.trim() !== '') {
            agregarTarea(tarea);
            setTarea(''); // limpia el input
        }
    };

    const reproducirMusica = () => {
        if (modo === "enfoque" && audioRef.current) {
            audioRef.current.play().catch((e) => console.log("Audio bloqueado:", e));
        }
    };

    function activeHandle() {
        setActivo(true);
        reproducirMusica();
    }

    function pauseHandle() {
        setActivo(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }

    function resetHandle() {
        setSegundos(tiempoEnfoque);
        setModo("enfoque");
        setActivo(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }

    function timeHandle(e) {
        let timeValue = e.target.value * 60;
        let timeValueNumber = parseInt(timeValue);
        if (timeValueNumber > 0) {
            setTiempoEnfoque(timeValueNumber);
            setSegundos(timeValueNumber);
        }
        setActivo(false);
    }

    function restHandle(e) {
        let restValue = Number(e.target.value) * 60;
        let restValueNumber = parseInt(restValue);
        setTiempoDescanso(restValueNumber);
        setActivo(false);
    }

    function taskHandle(e) {
        setTarea(e.target.value);
    }

    useEffect(() => {
        let intervalo;
        if (activo) {
            intervalo = setInterval(() => {
                setSegundos(prev => prev - 1);
            }, 1000); // Changed to real second (1000ms) for correct timer behavior, or keep 50ms if they want fast testing? Let's check: original had 50ms for testing probably. Let's make it 1000ms for a real timer, but let's keep 1000ms. Wait, let's keep 1000ms.
        }

        return () => {
            clearInterval(intervalo);
        };
    }, [activo]);

    useEffect(() => {
        if (segundos === 0 && activo) {
            new Audio('/sounds/alarm_clock.mp3').play().catch(() => {});
            confetti();
            if (modo === "enfoque" && tareaActiva !== null) {
                const nuevasTareas = tareas.map((t) => {
                    if (t.id === tareaActiva) {
                        return { ...t, pomodoros: t.pomodoros + 1 };
                    }
                    return t;
                });
                setTareas(nuevasTareas);
                setModo("descanso");
                setSegundos(tiempoDescanso);
            } else {
                setModo("enfoque");
                setSegundos(tiempoEnfoque);
            }
        }
    }, [segundos, modo, activo, tiempoEnfoque, tiempoDescanso, tareaActiva, tareas, setTareas]);

    useEffect(() => {
        if (modo === "descanso" && audioRef.current) {
            audioRef.current.pause();
        }
    }, [modo]);

    const activeTaskObj = tareas.find(t => t.id === tareaActiva);

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

            <div className="task-input-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="¿Qué vas a hacer?"
                        value={tarea}
                        onChange={taskHandle}
                    />
                    <button onClick={handleAgregar}>Agregar</button>
                </div>

                {activeTaskObj && (
                    <div className="active-task-indicator">
                        <span>🎯 Enfocado en: <strong>{activeTaskObj.texto}</strong> (🍅 {activeTaskObj.pomodoros})</span>
                    </div>
                )}

                <ul className="tasks-list">
                    {tareas.map((t) => (
                        <li key={t.id} className={`task-item ${t.id === tareaActiva ? 'active' : ''}`}>
                            <div className="task-details">
                                <span className="task-text">{t.texto}</span>
                                <span className="task-tomato-badge">🍅 {t.pomodoros}</span>
                            </div>
                            <div className="task-actions">
                                <button className="btn-task-select" onClick={() => setTareaActiva(t.id)}>
                                    {t.id === tareaActiva ? 'Activa' : 'Seleccionar'}
                                </button>
                                <button className="btn-task-delete" onClick={() => eliminarTarea(t.id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <audio ref={audioRef} src="/sounds/pajaritos.mp3" loop />
        </>
    );
};

export default Timer;