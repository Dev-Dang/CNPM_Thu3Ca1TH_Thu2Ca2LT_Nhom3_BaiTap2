import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameBoard from '../components/GameBoard.jsx';
import { PHASES } from '../constants/gameConstants.js';

vi.mock('../store/index.js', () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: (selector) =>
        selector({
            game: {
                phase: PHASES.PLAYER_TURN,
                playerBoard: [],
                playerFleet: [],
                computerBoard: [],
                computerFleet: [],
                lastAttackResult: null,
                difficulty: 'normal',
                computerTargetQueue: [],
            },
        }),
}));

vi.mock('../components/Grid.jsx', () => ({
    default: () => <div data-testid="grid">Grid</div>,
}));

vi.mock('../components/ShipList.jsx', () => ({
    default: () => <div data-testid="ship-list">ShipList</div>,
}));

vi.mock('../components/AttackToast.jsx', () => ({
    default: () => <div data-testid="attack-toast">AttackToast</div>,
}));

describe('GameBoard Component Testing', () => {
    test('hiển thị bảng của bạn và bảng đối thủ', () => {
        render(<GameBoard />);

        expect(screen.getByText('Bảng Của Bạn')).toBeInTheDocument();
        expect(screen.getByText('Bảng Đối Thủ')).toBeInTheDocument();
        expect(screen.getByText('(Máy Tính)')).toBeInTheDocument();
    });

    test('render 2 Grid component', () => {
        render(<GameBoard />);

        expect(screen.getAllByTestId('grid')).toHaveLength(2);
    });

    test('render 2 ShipList component', () => {
        render(<GameBoard />);

        expect(screen.getAllByTestId('ship-list')).toHaveLength(2);
    });

    test('render AttackToast', () => {
        render(<GameBoard />);

        expect(screen.getByTestId('attack-toast')).toBeInTheDocument();
    });
});