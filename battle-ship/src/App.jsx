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

   // [1.4.2] Hiển thị hộp thoại thông báo lỗi
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
            {/*  // [1.1.2] Render giao diện chào mừng (StartScreen)  */}
            {phase === null && <StartScreen/>}

            {/*// [1.1.7] Hiển thị StatusBar (hiển thị xuyên suốt ván chơi)*/}
            {phase !== null && <StatusBar/>}

            {/* [2.1.2a] Render SetupBoard khi game ở phase thiết lập. */}
            {/*// [1.1.8] Kích hoạt UC-02 (SetupBoard)*/}
            {(phase === PHASES.SETUP || phase === PHASES.INVALID_PLACEMENT) && <SetupBoard />}

            {/* [2.1.8d] Unmount SetupBoard và mount GameBoard khi UC-02 hoàn tất. */}
            {(phase === PHASES.PLAYER_TURN || phase === PHASES.CPU_TURN) && <GameBoard />}

            {/* UC-05: Kết thúc ván chơi */}
            {phase === PHASES.GAME_OVER && (<ResultScreen /> )}
        </div>
    );
}
