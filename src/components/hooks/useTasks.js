import { useEffect } from "react";
import { useState } from "react";


function useTask() {

    const [tareas, setTareas] = useState(() => {
        const tareasGuardadas = localStorage.getItem('tareas');
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    })

    const [tareaActiva, setTareaActiva] = useState(null)

    useEffect(() => {
        localStorage.setItem('tareas', JSON.stringify(tareas))
    }, [tareas])

    function agregarTarea(texto) {
        if (texto.trim() === '') return;
        const nuevaTarea = { id: Date.now(), texto, pomodoros: 0 };
        setTareas([...tareas, nuevaTarea]);
    }

    function eliminarTarea(id) {
        const nuevasTareas = tareas.filter(tarea => tarea.id !== id)
        setTareas(nuevasTareas)
    }

    function setTareaActivas() {
        console.log("ola")
    }

    return {
        tareas,
        setTareas,
        tareaActiva,
        setTareaActiva,
        agregarTarea,
        eliminarTarea,
    };
}


export default useTask