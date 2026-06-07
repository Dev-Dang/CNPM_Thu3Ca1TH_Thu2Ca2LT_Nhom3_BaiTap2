import { useAppSelector } from './store/index.js';
import { PHASES } from "./constants/gameConstants.js";
import StartScreen from './components/StartScreen.jsx';
import StatusBar from "./components/StatusBar.jsx";
import SetupBoard from "./components/SetupBoard.jsx";
import GameBoard from './components/GameBoard.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import './styles/app.css';
import './styles/error.css';

export default function App() {
    const phase = useAppSelector((state) => state.game.phase);
    const errorMessage = useAppSelector((state) => state.game.errorMessage);

    // 1.E1.2 toast: "Không thể bắt đầu ván chơi"
    // [4.3.1b] Hiển thị hộp thoại thông báo lỗi
    if (phase === PHASES.ERROR) {
        return (
            <div className="app">
                <div className="error-screen">
                    <div className="error-message">
                        <p>{errorMessage}</p>
                        <button className="error-reload-btn"
                                onClick={() => window.location.reload()}>
                            Tải lại trang
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            {/*  1.1c render(<StartScreen />)  */}
            {phase === null && <StartScreen/>}

            {/* 1.5 render label "Vs Máy tính" -> StatusBar */}
            {phase !== null && <StatusBar/>}

            {/* 2.1.2 useAppSelector → render board 10x10 + fleet list */}
            {(phase === PHASES.SETUP || phase === PHASES.INVALID_PLACEMENT) && <SetupBoard />}

            {/* UC-03 & UC-04: Giai đoạn tấn công */}
            {(phase === PHASES.PLAYER_TURN || phase === PHASES.CPU_TURN) && <GameBoard />}

            {/* UC-05: Kết thúc ván chơi */}
            {phase === PHASES.GAME_OVER && (<ResultScreen /> )}
        </div>
    );
}
