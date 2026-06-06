// ================================================================
// fleetConfig.js — UC-02 (createFleet, validateFleetConfig)
//                  UC-03/05 (isShipSunk, isFleetDefeated)
// ================================================================

import { SHIP_TYPES, ORIENTATION } from '../constants/gameConstants.js';

/** Cấu hình hạm đội tiêu chuẩn (RUL-02). */
export const FLEET_CONFIG = [
    SHIP_TYPES.CARRIER,       // size: 5
    SHIP_TYPES.BATTLESHIP,    // size: 4
    SHIP_TYPES.CRUISER,       // size: 3
    SHIP_TYPES.SUBMARINE,     // size: 3
    SHIP_TYPES.DESTROYER,     // size: 2
];

/**
 * [2.E2.1] Validate FLEET_CONFIG sizes = {5,4,3,3,2}.
 * Nếu sai → throw Error('FLEET_CONFIG_MISMATCH').
 * Được gọi trong startGame() trước createFleet().
 * @throws {Error} FLEET_CONFIG_MISMATCH
 */
export function validateFleetConfig() {
    const EXPECTED_SIZES = [5, 4, 3, 3, 2];
    const actualSizes = FLEET_CONFIG.map((type) => type.size);

    const isValid =
        actualSizes.length === EXPECTED_SIZES.length &&
        actualSizes.every((size, i) => size === EXPECTED_SIZES[i]);

    if (!isValid) {
        // [2.E2.1] error="FLEET_CONFIG_MISMATCH"
        throw new Error('FLEET_CONFIG_MISMATCH');
    }
}

/**
 * [2.1] createFleet(FLEET_CONFIG) → fleet[5].
 * Tạo hạm đội mới cho một ván chơi.
 * @returns {Ship[]}
 */
export function createFleet() {
    return FLEET_CONFIG.map((type) => ({
        ...type,
        orientation: ORIENTATION.HORIZONTAL,
        positions: [],
        hitCount: 0,
        placed: false,
    }));
}

/**
 * Kiểm tra tàu đã bị nhấn chìm chưa. (UC-03, UC-05)
 * @param {Ship} ship
 * @returns {boolean}
 */
export function isShipSunk(ship) {
    return ship.hitCount >= ship.size;
}

/**
 * Kiểm tra toàn bộ hạm đội đã bị nhấn chìm chưa. (UC-05)
 * @param {Ship[]} fleet
 * @returns {boolean}
 */
export function isFleetDefeated(fleet) {
    return fleet.every((ship) => isShipSunk(ship));
}
