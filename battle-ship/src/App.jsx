import { useAppSelector } from './store/index.js';
import StartScreen from './components/StartScreen.jsx';
import StatusBar from './components/StatusBar.jsx';
import './styles/app.css';

export default function App() {
  const phase = useAppSelector((state) => state.game.phase);

  return (
    <div className="app">
      <StatusBar />
      {phase === null && <StartScreen />}
    </div>
  );
}
