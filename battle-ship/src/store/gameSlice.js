import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  phase: null,
  playerBoard: null,
  computerBoard: null,
  playerFleet: [],
  computerFleet: [],
  selectedShipId: null,
  winner: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /**
     * UC-01: Khởi tạo ván chơi mới.
     */
    startGame() {
      // TODO: UC-01 — Implement
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
  selectShip,
  placeShip,
  startBattle,
  playerAttack,
  computerAttack,
  restartGame,
} = gameSlice.actions;

export default gameSlice.reducer;
