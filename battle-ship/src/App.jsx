import { useAppSelector } from './store/index.js';
import { PHASES } from "./constants/gameConstants.js";
import StartScreen from './components/StartScreen.jsx';
import StatusBar from "./components/StatusBar.jsx";
import SetupBoard from "./components/SetupBoard.jsx";
import GameBoard from './components/GameBoard.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import './styles/app.css';

export default function App() {
    const phase = useAppSelector((state) => state.game.phase);

    return (
        <div className="app">
            {/*  1.1c render(<StartScreen />)  */}
            {phase === null && <StartScreen/>}

            {/* 1.5 render label "Vs Máy tính" -> StatusBar */}
            {phase !== null && <StatusBar/>}

            {/* 2.2 useAppSelector → render board 10x10 + fleet list */}
            {(phase === PHASES.SETUP || phase === PHASES.INVALID_PLACEMENT) && <SetupBoard />}

            {/* UC-03 & UC-04: Giai đoạn tấn công */}
            {(phase === PHASES.PLAYER_TURN || phase === PHASES.CPU_TURN) && <GameBoard />}
            
            {/* UC-05: Kết thúc ván chơi */}
            {phase === PHASES.GAME_OVER && (<ResultScreen /> )}
        </div>
    );
}