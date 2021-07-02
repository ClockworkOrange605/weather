import './App.css';
import { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const API_HOST = process.env.REACT_APP_API_HOST

function App() {
  const [loaded, setState] = useState(false)
  const [period, setPeriod] = useState(2)

  const [timeline, setTimeline] = useState(null)
  const [tempreture, setTempreture] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [pressure, setPressure] = useState(null)

  useEffect(() => {
    setState(false)

    fetch(`${API_HOST}/api/weather/?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setTimeline(data.data.map((item) => (new Date(item.fields.dt)).getHours()))

        setTempreture(data.data.map((item) => item.fields.temp))
        setPressure(data.data.map((item) => item.fields.pressure))
        setHumidity(data.data.map((item) => item.fields.humidity))

        setState(true)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [period])

  return (
    <div className="App">
      <header>
        <h1>Weather</h1>
        <div>
          <select value={ period } onChange={ e => setPeriod(e.target.value) }>
            <option value="1">Day</option>
            <option value="2">Week</option>
            <option value="3">Mounth</option>
          </select>
        </div>
      </header>
      { loaded ? (
        <main>
          <LineChart title="Tempreture" timeline={ timeline }values={ tempreture } />
          <LineChart title="Humidity" timeline={ timeline } values={ humidity } />
          <LineChart title="Pressure" timeline={ timeline }values={ pressure } />
        </main>
      ) : (
        <main><p>Loading ...</p></main>
      ) }          
      <footer>© 2020</footer>
    </div>
  );
}

const LineChart = ({title, timeline, values}) => {
  const chartRef = useRef(null)

  useEffect(() => {
    echarts
      .init(chartRef.current, 'dark')
      .setOption({
        xAxis: {
            name: title,
            nameLocation: 'center',
            nameGap: 40,
            type: 'category',
            data: timeline
        },
        yAxis: {
            type: 'value',
            offset: 0
        },
        series: [{
            data: values,
            type: 'line',
            smooth: true
        }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
      ref={ chartRef } 
      style={ { minWidth: '350px', minHeight: '300px' } } 
    />
  )
}

export default App;