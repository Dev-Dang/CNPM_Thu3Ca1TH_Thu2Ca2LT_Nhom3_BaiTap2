  import { isShipSunk } from '../utils/fleetConfig.js';
import '../styles/ship-list.css';

const SHIP_VISUALS = {
    carrier:    { emoji: '✈️', color: '#1e40af', bgLight: 'rgba(30,64,175,0.12)',   bgPlaced: 'rgba(30,64,175,0.30)'   },
    battleship: { emoji: '⚔️', color: '#374151', bgLight: 'rgba(55,65,81,0.12)',    bgPlaced: 'rgba(55,65,81,0.30)'    },
    cruiser:    { emoji: '🌊', color: '#0d9488', bgLight: 'rgba(13,148,136,0.12)',  bgPlaced: 'rgba(13,148,136,0.30)'  },
    submarine:  { emoji: '🐟', color: '#4d7c0f', bgLight: 'rgba(77,124,15,0.12)',   bgPlaced: 'rgba(77,124,15,0.30)'   },
    destroyer:  { emoji: '⚡', color: '#b45309', bgLight: 'rgba(180,83,9,0.12)',    bgPlaced: 'rgba(180,83,9,0.30)'    },
};

const DEFAULT_VISUAL = { emoji: '🚢', color: '#6377d6', bgLight: 'rgba(99,119,214,0.12)', bgPlaced: 'rgba(99,119,214,0.30)' };

export default function ShipList({
    fleet = [],
    onSelect,
    onDragStart,
    onDragEnd,
    selectedId,
    align = 'left',
    grouped = false,
    disablePlaced = false,
}) {
    const entries = grouped
        ? Object.values(fleet.reduce((groups, ship) => {
            const type = ship.type ?? ship.id;
            if (!groups[type]) {
                groups[type] = {
                    type,
                    name: ship.name,
                    size: ship.size,
                    ships: [],
                };
            }
            groups[type].ships.push(ship);
            return groups;
        }, {}))
        : fleet.map((ship) => ({
            type: ship.type ?? ship.id,
            name: ship.name,
            size: ship.size,
            ships: [ship],
        }));

    return (
        <div className={`ship-list ${align === 'right' ? 'ship-list-right' : ''}`}>
            {entries.map((entry) => {
                const ships = entry.ships;
                const availableShip = ships.find((ship) => !ship.placed && !isShipSunk(ship));
                const selectedShip = ships.find((ship) => selectedId === ship.id);
                const remainingCount = disablePlaced
                    ? ships.filter((ship) => !ship.placed).length
                    : ships.filter((ship) => !isShipSunk(ship)).length;
                const totalCount = ships.length;
                const completed = remainingCount === 0;
                const targetShip = availableShip ?? selectedShip ?? ships[0];
                const isSelected = ships.some((ship) => selectedId === ship.id);
                const canSelect = !!onSelect && !completed && !!targetShip;
                const canDrag = !!onDragStart && !!availableShip;
                const vis = SHIP_VISUALS[entry.type] ?? DEFAULT_VISUAL;

                return (
                    <div
                        key={grouped ? entry.type : targetShip.id}
                        className={`ship-entry ${completed ? 'ship-entry-completed' : ''} ${isSelected ? 'ship-entry-selected' : ''} ${canSelect ? 'ship-entry-selectable' : ''} ${canDrag ? 'ship-entry-draggable' : ''}`}
                        onClick={() => canSelect && onSelect(targetShip.id)}
                        draggable={false}
                        onMouseDown={(event) => {
                            // [2.2.2a] Bắt đầu kéo tàu chưa đặt từ danh sách vào board.
                            if (canDrag) onDragStart?.(availableShip.id, event);
                        }}
                        onDragEnd={onDragEnd}
                        title={entry.name}
                        style={{ '--ship-c': vis.color }}
                        aria-disabled={completed}
                    >
                        <div className="ship-entry-main">
                            <div className="ship-block-row">
                                <span className="ship-icon">{vis.emoji}</span>
                                {Array.from({ length: entry.size }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`ship-block ${completed ? 'ship-block-completed' : ''}`}
                                        style={completed ? undefined : { borderColor: vis.color, backgroundColor: vis.bgLight }}
                                    />
                                ))}
                            </div>
                            {grouped && (
                                <span className="ship-count">
                                    {remainingCount}/{totalCount}
                                </span>
                            )}
                        </div>
                        <span className="ship-name">{entry.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
