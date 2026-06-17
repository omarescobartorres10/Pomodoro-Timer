import { useEffect, useState } from "react"; //utilizamos los hooks

const TIEMPO_ENFOQUE = 10; // 25 minutos

const TIEMPO_DESCANSO = 30; // 5 minutos

const Timer = () => {
    const [segundos, setSegundos] = useState(10) //1500 porque es el tiempo. 

    const [activo, setActivo] = useState(false) //el valor con el que iniciará es false. 

    const [modo, setModo] = useState("enfoque");


    function activeHandle() {
        setActivo(true) //maneja el estado a activo
    }

    function pauseHandle() {
        setActivo(false) //maneja el estado a false para pausarlo. 
    }

    function resetHandle() {
        setSegundos(TIEMPO_ENFOQUE) //lo restablece al tiempo original. 
        setModo("enfoque")
        setActivo(false) //cambia el estado a false para que inicie pausado. 
    }

    function timeHandle(e) { //lo agrramoa aquí
        let timeValue = e.target.value * 60; //el e.target.value es el valor el evento que tiene el select
        let timeValueNumber = parseInt(timeValue)
        setSegundos(timeValueNumber)
        setActivo(false)
    }



    useEffect(() => {
        let intervalo;
        if (activo) {
            intervalo = setInterval(() => {
                // if (segundos === 1) {
                //     if (modo === "enfoque") {
                //         setModo("descanso")
                //         setSegundos(TIEMPO_DESCANSO)
                //     }

                //     if (modo === "descanso") {
                //         setModo("enfoque")
                //         setSegundos(TIEMPO_ENFOQUE)
                //     }

                // } else {
                setSegundos(prev => prev - 1)
                //}
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
                setSegundos(TIEMPO_DESCANSO);
            } else {
                setModo("enfoque");
                setSegundos(TIEMPO_ENFOQUE);
            }
        }
    }, [segundos, modo, activo]); // 👈 agrega activo a las dependencias





    function formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }




    return (
        <>
            <select name="" id="" onChange={timeHandle}> {/**esto tira un evento e */}


                <option value="1">1</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
            <h1>{formatearTiempo(segundos)}</h1>
            <button onClick={activeHandle}>Iniciar</button>
            <button onClick={pauseHandle}>Pausar</button>
            <button onClick={resetHandle}>Reset</button>
        </>
    )
}

export default Timer;