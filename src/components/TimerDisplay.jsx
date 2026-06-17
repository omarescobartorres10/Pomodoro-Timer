import formatearTiempo from "../utils/formatearTiempo";

function TimerDisplay({segundos}){
    return (
         <h1 className="timer-display">{formatearTiempo(segundos)}</h1>
    )
}

export default TimerDisplay;