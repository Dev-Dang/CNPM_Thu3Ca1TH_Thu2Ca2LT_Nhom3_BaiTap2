import { isShipSunk } from '../utils/fleetConfig.js';
import '../styles/ship-list.css';

// [2.1.2] Visual config cho từng tàu trong danh sách 5 tàu
const SHIP_VISUALS = {
    carrier:    { emoji: '✈️', color: '#1e40af', bgLight: 'rgba(30,64,175,0.12)',   bgPlaced: 'rgba(30,64,175,0.30)'   },
    battleship: { emoji: '⚔️', color: '#374151', bgLight: 'rgba(55,65,81,0.12)',    bgPlaced: 'rgba(55,65,81,0.30)'    },
    cruiser:    { emoji: '🌊', color: '#0d9488', bgLight: 'rgba(13,148,136,0.12)',  bgPlaced: 'rgba(13,148,136,0.30)'  },
    submarine:  { emoji: '🐟', color: '#4d7c0f', bgLight: 'rgba(77,124,15,0.12)',   bgPlaced: 'rgba(77,124,15,0.30)'   },
    destroyer:  { emoji: '⚡', color: '#b45309', bgLight: 'rgba(180,83,9,0.12)',    bgPlaced: 'rgba(180,83,9,0.30)'    },
};

const DEFAULT_VISUAL = { emoji: '🚢', color: '#6377d6', bgLight: 'rgba(99,119,214,0.12)', bgPlaced: 'rgba(99,119,214,0.30)' };

// [2.1.2] Render danh sách 5 tàu Player cần đặt
// [2.1.7] Re-render mỗi khi store update (placed=true → ô tàu đổi màu đậm hơn)
export default function ShipList({ fleet = [], onSelect, selectedId, align = 'left' }) {
    return (
        <div className={`ship-list ${align === 'right' ? 'ship-list-right' : ''}`}>
            {fleet.map((ship) => {
                // [2.1.7] ship.placed=true → tàu đã đặt lên bảng (bgPlaced đậm hơn bgLight)
                const sunk = isShipSunk(ship);
                // [2.1.3] isSelected=true → đang được chọn để đặt
                const isSelected = selectedId === ship.id;
                // [2.1.3] canSelect: có thể click chọn khi có onSelect và tàu chưa bị đánh chìm
                // [2.2.1] tàu đã placed vẫn canSelect=true → Player click để reposition
                const canSelect = !!onSelect && !sunk;
                const vis = SHIP_VISUALS[ship.id] ?? DEFAULT_VISUAL;

                return (
                    // [2.1.3] Player click tàu → onSelect(ship.id) → dispatch(selectShip)
                    // [2.2.1] Nếu tàu đã placed, click lại → reposition (đặt lại vị trí mới)
                    <div
                        key={ship.id}
                        className={`ship-entry ${sunk ? 'ship-entry-sunk' : ''} ${isSelected ? 'ship-entry-selected' : ''} ${canSelect ? 'ship-entry-selectable' : ''}`}
                        onClick={() => canSelect && onSelect(ship.id)}
                        title={ship.name}
                        style={{ '--ship-c': vis.color }}
                    >
                        <div className="ship-block-row">
                            <span className="ship-icon">{vis.emoji}</span>
                            {/* [2.1.2] Render số ô tương ứng kích thước tàu (size=2..5)
                                [2.1.7] placed=true → bgPlaced | chưa đặt → bgLight */}
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