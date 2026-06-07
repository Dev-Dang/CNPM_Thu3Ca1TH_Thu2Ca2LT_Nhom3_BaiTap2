// ================================================================
// fleetConfig.js — UC-02 (createFleet, validateFleetConfig)
//                  UC-03/05 (isShipSunk, isFleetDefeated)
// ================================================================

import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY,
  ORIENTATION,
} from '../constants/gameConstants.js';

/**
 * Validate fleet sizes theo độ khó.
 * Nếu sai → throw Error('FLEET_CONFIG_MISMATCH').
 *
 * @param {{ id: string, boardSize: number, fleet: object[] }} difficulty
 * @throws {Error} FLEET_CONFIG_MISMATCH
 */
export function validateFleetConfig(difficulty = DEFAULT_DIFFICULTY) {
  const EXPECTED_SIZES =
    difficulty.id === DIFFICULTY.NORMAL.id
      ? [5, 4, 4, 3, 3, 3, 2, 2]
      : [5, 4, 3, 3, 2];

  const actualSizes = difficulty.fleet.flatMap((entry) =>
    Array(entry.count).fill(entry.ship.size)
  );

  const isValid =
    actualSizes.length === EXPECTED_SIZES.length &&
    actualSizes.every((size, i) => size === EXPECTED_SIZES[i]);

  if (!isValid) {
    throw new Error('FLEET_CONFIG_MISMATCH');
  }
}

/**
 * [2.1] createFleet(difficulty.fleet) → fleet[].
 * Tạo hạm đội mới cho một ván chơi theo độ khó.
 *
 * @param {{ id: string, boardSize: number, fleet: object[] }} difficulty
 * @returns {Ship[]}
 */
export function createFleet(difficulty = DEFAULT_DIFFICULTY) {
  validateFleetConfig(difficulty);

  const fleet = [];

  for (const entry of difficulty.fleet) {
    const ship = entry.ship;

    for (let i = 1; i <= entry.count; i += 1) {
      fleet.push({
        id: entry.count === 1 ? ship.id : `${ship.id}-${i}`,
        type: ship.id,
        name: ship.name,
        size: ship.size,
        orientation: ORIENTATION.HORIZONTAL,
        positions: [],
        hitCount: 0,
        placed: false,
      });
    }
  }

  return fleet;
}

/**
 * Reset trạng thái đặt tàu.
 *
 * @param {Ship[]} fleet
 * @returns {Ship[]}
 */
export function resetFleet(fleet) {
  return fleet.map((ship) => ({...ship, orientation: ORIENTATION.HORIZONTAL, positions: [], hitCount: 0, placed: false}));
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
