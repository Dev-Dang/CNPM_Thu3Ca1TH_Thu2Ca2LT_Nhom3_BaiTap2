import { useAppSelector } from './store/index.js';
import StartScreen from './components/StartScreen.jsx';
import StatusBar from './components/StatusBar.jsx';
import './styles/app.css';

export default function App() {
  const phase = useAppSelector((state) => state.game.phase);

  return (
    <div className="app">
      <StatusBar />

    {/*  1.1c render(<StartScreen />)  */}
      {phase === null && <StartScreen />}
    </div>
  );
}
