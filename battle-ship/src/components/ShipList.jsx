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

export default function ShipList({ fleet = [], onSelect, selectedId, align = 'left' }) {
    return (
        <div className={`ship-list ${align === 'right' ? 'ship-list-right' : ''}`}>
            {fleet.map((ship) => {
                const sunk = isShipSunk(ship);
                const isSelected = selectedId === ship.id;
                const canSelect = !!onSelect && !sunk;
                const vis = SHIP_VISUALS[ship.id] ?? DEFAULT_VISUAL;

                return (
                    <div
                        key={ship.id}
                        className={`ship-entry ${sunk ? 'ship-entry-sunk' : ''} ${isSelected ? 'ship-entry-selected' : ''} ${canSelect ? 'ship-entry-selectable' : ''}`}
                        onClick={() => canSelect && onSelect(ship.id)}
                        title={ship.name}
                        style={{ '--ship-c': vis.color }}
                    >
                        <div className="ship-block-row">
                            <span className="ship-icon">{vis.emoji}</span>
                            {Array.from({ length: ship.size }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`ship-block ${sunk ? 'ship-block-sunk' : ''}`}
                                    style={sunk ? undefined : { borderColor: vis.color, backgroundColor: ship.placed ? vis.bgPlaced : vis.bgLight }}
                                />
                            ))}
                        </div>
                        <span className="ship-name">{ship.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
