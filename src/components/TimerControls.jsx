function TimerControls({ onIniciar, onPausar, onReset }) {
  return (
    <div className="buttons">
      <button className="btn-primary" onClick={onIniciar}>Iniciar</button>
      <button className="btn-secondary" onClick={onPausar}>Pausar</button>
      <button className="btn-reset" onClick={onReset}>Reset</button>
    </div>
  );
}

export default TimerControls;