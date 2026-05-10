/* eslint-disable no-unused-vars */
import {createSlice} from '@reduxjs/toolkit';
import {PHASES} from '../constants/gameConstants.js';
import {createBoard} from '../utils/boardUtils.js';
import {createFleet, validateFleetConfig} from '../utils/fleetConfig.js';
import {
  isValidPlacement,
  placeShipOnBoard,
  removeShipFromBoard,
  placeFleetRandomly,
} from '../utils/boardUtils.js';

// 1.4a Trạng thái game ban đầu
const initialState = {
  phase: null,
  playerBoard: null,
  computerBoard: null,
  playerFleet: [],
  computerFleet: [],
  selectedShipId: null,
  winner: null,
  error: null, // 1.E1.1: Trạng thái lưu trữ lỗi hệ thống
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /**
     * UC-01: Khởi tạo ván chơi mới.
     */
    startGame(state) {
      try {
        // 1.4b gán PHASE = SETUP
        state.phase = PHASES.SETUP;
        state.error = null; // Reset lỗi nếu thành công

        // [2.E2.1] kiểm tra sizes = {5,4,3,3,2}
        validateFleetConfig();
      } catch (error) {
        // 1.E1.1 ERR Javascript runtime / Out of memory -> stateUpdated(error)
        state.error = "Không thể bắt đầu ván chơi. Vui lòng tải lại trang.";
        state.phase = null; // Reset state

        // [2.E2.1] error="FLEET_CONFIG_MISMATCH"
        // [2.E2.2] phase='ERROR', block + ghi log
        console.error('FLEET_CONFIG_MISMATCH', error.message);

        // [2.E2.2] phase='ERROR', block
        state.phase = PHASES.ERROR;

        // [2.E2.3] kết thúc không thành công
      }

      // 1.6 Kích hoạt UC-02 (phase = SETUP)
      // [2.1] createFleet(FLEET_CONFIG) → fleet[5]
      const playerFleet = createFleet();

      // [2.1] placeFleetRandomly(emptyBoard, fleet) → {computerBoard, computerFleet}
      const {board: computerBoard, fleet: computerFleet} = placeFleetRandomly(
          createBoard(),
          createFleet()
      );

      // [2.1] phase='SETUP', playerFleet, computerBoard
      state.phase = PHASES.SETUP;
      state.playerBoard = createBoard();
      state.computerBoard = computerBoard; // computerBoard — hidden from Player
      state.playerFleet = playerFleet;
      state.computerFleet = computerFleet;
      state.selectedShipId = null;
      state.winner = null;

      // [2.2] store updated → useSelector re-render board 10×10 + fleet list
    },

    /**
     * UC-02 — Bước 2.3 / 2.A1.1: Player chọn tàu.
     * - 2.3: chọn tàu chưa đặt
     * - 2.A1.1: chọn tàu đã đặt → reposition
     */
    selectShip(state, action) {
      // [2.4.1] dispatch(selectShip(shipId)) → bindSelectedShip, fleetPlaced+1
      state.selectedShipId = action.payload.shipId;
      // store updated → useSelector re-render (highlight tàu được chọn)
    },

    /**
     * UC-02 — Bước 2.4 → 2.7: Đặt tàu lên bảng.
     * Bao gồm cả luồng thay thế 2.A1 (reposition).
     */
    placeShip(state, action) {
      const { shipId, row, col, orientation } = action.payload;
      // [2.4] dispatch(placeShip(shipId, row, col, dir))

      const shipIndex = state.playerFleet.findIndex((s) => s.id === shipId);
      if (shipIndex === -1) return;

      const ship = state.playerFleet[shipIndex];

      // [2.A1.2] Nếu tàu đã đặt → removeShipFromBoard trước khi validate
      // (tái đặt — reposition: gỡ tàu khỏi vị trí cũ, ô trở về trống)
      let boardForValidation = state.playerBoard;
      if (ship.placed && ship.positions.length > 0) {
        boardForValidation = removeShipFromBoard(state.playerBoard, ship.positions);
      }

      // [2.5] isValidPlacement(board, row, col, size, dir) → boolean
      const valid = isValidPlacement(boardForValidation, row, col, ship.size, orientation);

      if (!valid) {
        // [2.E1.1] valid = false
        // [2.E1.2] phase='INVALID_PLACEMENT' → SetupBoard hiển thị error msg
        state.phase = PHASES.INVALID_PLACEMENT;
        // [2.E1.3] Player nhận msg → back to 2.4
        return;
      }

      // alt [valid = true]
      // [2.6] placeShipOnBoard(board, row, col, size, dir) → newBoard
      let newBoard = boardForValidation; // board đã remove ship cũ nếu reposition
      const { board: updatedBoard, positions } = placeShipOnBoard(
          newBoard,
          row,
          col,
          ship.size,
          orientation,
          shipId
      );

      // [2.6] show position → cập nhật board + ship.positions
      state.playerBoard = updatedBoard;
      state.playerFleet[shipIndex] = {
        ...ship,
        orientation,
        positions,
        placed: true,
      };

      // [2.7] selectedShipId = null
      state.selectedShipId = null;

      // Reset phase về SETUP (xoá INVALID_PLACEMENT nếu có)
      state.phase = PHASES.SETUP;
      // store updated → useSelector re-render
    },

    /**
     * UC-02 — Bước 2.9 / 2.10: Bắt đầu tấn công.
     */
    startBattle(state) {
      // [2.8] Guard: allPlaced = false → không làm gì
      const allPlaced = state.playerFleet.every((s) => s.placed);
      if (!allPlaced) return;

      // [2.10] phase='BATTLE' → ref UC-03
      state.phase = PHASES.PLAYER_TURN;
    },

    /**
     * UC-03: Player tấn công một ô trên bảng máy tính.
     */
    playerAttack() {
      // TODO: UC-03 — Implement
    },

    /**
     * UC-04: Máy tính tấn công một ô trên bảng Player.
     */
    computerAttack() {
      // TODO: UC-04 — Implement
    },

    /**
     * UC-05: Chơi lại — reset toàn bộ về trạng thái ban đầu.
     */
    restartGame() {
      // TODO: UC-05 — Implement
    },
  },
});

export const {
  startGame,
  setGameError,
  selectShip,
  placeShip,
  startBattle,
  playerAttack,
  computerAttack,
  restartGame,
} = gameSlice.actions;

export default gameSlice.reducer;
