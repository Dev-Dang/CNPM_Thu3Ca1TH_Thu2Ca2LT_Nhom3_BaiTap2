/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

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
        } catch (error) {
            // 1.E1.1 ERR Javascript runtime / Out of memory -> stateUpdated(error)
            state.error = "Không thể bắt đầu ván chơi. Vui lòng tải lại trang.";
            state.phase = null; // Reset state
        }

	// 1.6 Kích hoạt UC-02 (phase = SETUP)
    },

    /**
     * UC-02: Chọn tàu từ danh sách để đặt lên bảng.
     */
    selectShip() {
      // TODO: UC-02 — Implement
    },

    /**
     * UC-02: Đặt hoặc tái đặt tàu lên bảng Player.
     */
    placeShip() {
      // TODO: UC-02 — Implement
    },

    /**
     * UC-02 → UC-03: Tất cả tàu đã đặt xong — bắt đầu giai đoạn tấn công.
     */
    startBattle(state) {
      // TODO: UC-02→03 — Implement
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