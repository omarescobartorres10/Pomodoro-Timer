function TimeSelectors({ timeHandle, restHandle }) {
    return (
        <div className="controls">
            <label htmlFor="focus-select">Enfoque</label>
            <select id="focus-select" onChange={timeHandle} defaultValue="25">
                <option value="0">Elegir</option>
                <option value="10">10m</option>
                <option value="15">15m</option>
                <option value="25">25m</option>
                <option value="30">30m</option>
                <option value="50">50m</option>
            </select>
            
            <label htmlFor="rest-select">Descanso</label>
            <select id="rest-select" onChange={restHandle} defaultValue="5">
                <option value="5">5m</option>
                <option value="10">10m</option>
                <option value="15">15m</option>
            </select>
        </div>
    );
}

export default TimeSelectors;