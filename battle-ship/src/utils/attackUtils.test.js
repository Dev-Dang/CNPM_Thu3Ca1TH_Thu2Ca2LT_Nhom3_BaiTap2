import { describe, test, expect } from 'vitest'; 

import { calculateComboMultiplier, SHIP_POINTS } from './attackUtils';

describe('Kiểm thử logic tính Combo hệ số nhân (calculateComboMultiplier)', () => {
    
    test('Chuỗi bắn trúng là 0 hoặc 1 thì hệ số nhân phải là x1', () => {
        expect(calculateComboMultiplier(0)).toBe(1);
        expect(calculateComboMultiplier(1)).toBe(1);
    });

    test('Chuỗi bắn trúng liên tiếp bằng 2 thì hệ số nhân phải là x2', () => {
        expect(calculateComboMultiplier(2)).toBe(2);
    });

    test('Chuỗi bắn trúng liên tiếp lớn hơn hoặc bằng 3 thì hệ số nhân phải là x3', () => {
        expect(calculateComboMultiplier(3)).toBe(3);
        expect(calculateComboMultiplier(5)).toBe(3); 
    });
});

describe('Kiểm thử cấu hình điểm số của tàu (SHIP_POINTS)', () => {
    test('Tàu chiến hạm (battleship) phải có điểm nền là 40', () => {
        expect(SHIP_POINTS.battleship).toBe(40);
    });
    
    test('Tàu sân bay (carrier) phải có điểm nền là 50', () => {
        expect(SHIP_POINTS.carrier).toBe(50);
    });
});