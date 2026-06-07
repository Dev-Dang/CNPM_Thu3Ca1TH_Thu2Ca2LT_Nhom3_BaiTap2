import { describe, it, expect, vi, afterEach } from 'vitest';
import gameReducer, { startGame } from './gameSlice.js';
import { PHASES } from '../constants/gameConstants.js';
import * as fleetConfigUtils from '../utils/fleetConfig.js';

describe('gameSlice - Kiểm thử hàm startGame', () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('TC01: Kiểm tra khởi tạo thành công (Happy Path)', () => {
        // Gọi action startGame với độ khó 'normal'
        const state = gameReducer(undefined, startGame('normal'));

        // Assert: Kiểm tra các thay đổi state
        expect(state.phase).toBe(PHASES.SETUP);
        expect(state.difficulty).toBe('normal');
        expect(state.error).toBeNull();
        expect(state.score).toBe(0);
        expect(state.playerFleet.length).toBeGreaterThan(0);
    });

    it('TC02: Kiểm tra khi xảy ra lỗi khởi tạo (Exception Path)', () => {
        // Giả lập lỗi bằng cách cho hàm validateFleetConfig ném ngoại lệ
        vi.spyOn(fleetConfigUtils, 'validateFleetConfig').mockImplementation(() => {
            throw new Error('CONFIG_ERROR');
        });
        // Tắt console.error để Terminal không bị spam khi chạy test
        vi.spyOn(console, 'error').mockImplementation(() => {});

        // Gọi action startGame
        const state = gameReducer(undefined, startGame('easy'));

        // Assert: Hệ thống phải chuyển sang trạng thái ERROR
        expect(state.phase).toBe(PHASES.ERROR);
        // expect(state.error).toBe("Không thể bắt đầu ván chơi. Vui lòng tải lại trang.");
        expect(state.difficulty).toBeNull();
    });
});