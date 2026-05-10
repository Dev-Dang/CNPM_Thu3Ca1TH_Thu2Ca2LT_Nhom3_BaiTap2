// import {useAppSelector} from './store/index.js';
// import StartScreen from './components/StartScreen.jsx';
// import StatusBar from "./components/StatusBar.jsx";
// import {PHASES} from "./constants/gameConstants.js";
// import SetupBoard from "./components/SetupBoard.jsx";
// import './styles/app.css';
// import GameBoard from './components/GameBoard.jsx';

// export default function App() {
//     const phase = useAppSelector((state) => state.game.phase);
//     const playerBoard = useAppSelector((state) => state.game.playerBoard);
//     const computerBoard = useAppSelector((state) => state.game.computerBoard);

//     return (
//         <div className="app">
//             {/*  1.1c render(<StartScreen />)  */}
//             {phase === null && <StartScreen/>}

//             {/* 1.5 render label "Vs Máy tính" -> StatusBar */}
//             {phase !== null && <StatusBar/>}

//             {/* 2.2 useAppSelector → render board 10x10 + fleet list */}
//             {(phase === PHASES.SETUP || phase === PHASES.INVALID_PLACEMENT) && <SetupBoard />}
//             {(phase === PHASES.PLAYER_TURN || phase === PHASES.CPU_TURN) && (
//                     <div className="game-area">
//                       <GameBoard board={playerBoard}   label="Bảng của bạn"  isEnemy={false} />
//                       <GameBoard board={computerBoard} label="Bảng đối thủ"  isEnemy={true}  />
//                     </div>
//                   )}
            
//                   {/* {phase === PHASES.GAME_OVER && <ResultScreen />} chưa làm ResultScreen nên tạm thời show text Game Over */}
//                   {phase === PHASES.GAME_OVER && <div>Game Over!</div>}
//                 </div>

//     );
// }
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/index.js';
import { PHASES, DELAY_MS } from "./constants/gameConstants.js";
import { computerAttack } from './store/gameSlice.js';
import StartScreen from './components/StartScreen.jsx';
import StatusBar from "./components/StatusBar.jsx";
import SetupBoard from "./components/SetupBoard.jsx";
import GameBoard from './components/GameBoard.jsx';
import './styles/app.css';

export default function App() {
    const dispatch = useAppDispatch();
    const phase = useAppSelector((state) => state.game.phase);
    const playerBoard = useAppSelector((state) => state.game.playerBoard);
    const computerBoard = useAppSelector((state) => state.game.computerBoard);

    
    useEffect(() => {
        if (phase === PHASES.CPU_TURN) {
            const timer = setTimeout(() => {
                dispatch(computerAttack());
            }, DELAY_MS);
            return () => clearTimeout(timer);
        }
    }, [phase, dispatch]);

    return (
        <div className="app">
            {phase === null && <StartScreen/>}
            {phase !== null && <StatusBar/>}

            {(phase === PHASES.SETUP || phase === PHASES.INVALID_PLACEMENT) && <SetupBoard />}
            
            {(phase === PHASES.PLAYER_TURN || phase === PHASES.CPU_TURN) && (
                <div className="game-area">
                    <GameBoard board={playerBoard} label="Bảng của bạn" isEnemy={false} />
                    <GameBoard board={computerBoard} label="Bảng đối thủ" isEnemy={true} />
                </div>
            )}
            
            {phase === PHASES.GAME_OVER && (
                <div className="game-over-msg">Ván đấu kết thúc!</div>
//                 {/* {phase === PHASES.GAME_OVER && <ResultScreen />} chưa làm ResultScreen nên tạm thời show text Game Over */}
// //                   
            )}
        </div>
    );
}