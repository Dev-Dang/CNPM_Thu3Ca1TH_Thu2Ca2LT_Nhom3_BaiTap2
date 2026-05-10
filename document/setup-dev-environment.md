# Thiết Lập Môi Trường Phát Triển (Setup Development Environment)

**Dự án:** Trò chơi Battleship  
**Tài liệu:** DEL-08 — Thiết Lập Môi Trường Phát Triển (Setup Development Environment)  
**Phiên bản:** 1.0  
**Ngày:** 08-05-2026  
**Công nghệ sử dụng (Tech stack):** Vite 8 · React 19 JSX · Redux Toolkit · CSS thường (Global CSS) · React Compiler

---

## 1. Điều Kiện Tiên Quyết (Prerequisites)

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---------|---------------------|---------|
| Node.js | v18.x LTS trở lên | `node --version` |
| npm | v9.x trở lên | `npm --version` |
| Git | bất kỳ phiên bản hiện hành | `git --version` |
| VS Code | bất kỳ phiên bản hiện hành | — |

> **Tải Node.js:** https://nodejs.org (chọn phiên bản **LTS**)

---

## 2. Tải Mã Nguồn Và Cài Đặt (Clone & Install)

```bash
# Clone repository
git clone https://github.com/50nwoS-TVLA/CNPM_Thu3Ca1TH_Thu2Ca2LT_Nhom3_BaiTap2.git
cd CNPM_Thu3Ca1TH_Thu2Ca2LT_Nhom3_BaiTap2

# Cài đặt tất cả dependencies
npm install
```

---

## 3. Chạy Máy Chủ Phát Triển (Development Server)

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173**

> Hot Module Replacement (HMR) hoạt động tự động — lưu file là trình duyệt cập nhật ngay, không cần reload.

---

## 4. Các Lệnh Chạy Dự Án (Scripts)

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Khởi động dev server với HMR |
| `npm run build` | Build production vào thư mục `dist/` |
| `npm run preview` | Xem trước bản build production trên local |
| `npm run lint` | Kiểm tra lỗi ESLint toàn project |

---

## 5. Thư Viện Phụ Thuộc (Dependencies)

### Thư Viện Chạy Ứng Dụng (Runtime Dependencies)

| Package | Version | Mục đích |
|---------|---------|----------|
| `react` | ^19.2.5 | UI framework |
| `react-dom` | ^19.2.5 | React DOM renderer |
| `@reduxjs/toolkit` | ^2.11.2 | State management (game state machine) |
| `react-redux` | ^9.2.0 | React bindings cho Redux |

### Thư Viện Phát Triển (Dev Dependencies)

| Package | Version | Mục đích |
|---------|---------|----------|
| `vite` | ^8.0.10 | Build tool & dev server (dùng Rolldown bundler) |
| `@vitejs/plugin-react` | ^6.0.1 | React plugin cho Vite (Babel/HMR) |
| `@babel/core` | ^7.29.0 | Babel core — cần cho React Compiler |
| `babel-plugin-react-compiler` | ^1.0.0 | React Compiler — tự động tối ưu re-render |
| `@rolldown/plugin-babel` | ^0.2.3 | Rolldown-compatible Babel plugin (Vite 8) |
| `eslint` | ^10.2.1 | Linting (flat config) |
| `@eslint/js` | ^10.0.1 | ESLint built-in JS rules |
| `eslint-plugin-react-hooks` | ^7.1.1 | ESLint rules cho React Hooks |
| `eslint-plugin-react-refresh` | ^0.5.2 | ESLint rules cho React Fast Refresh |
| `globals` | ^17.5.0 | Browser/Node global variables cho ESLint |
| `@types/react` | ^19.2.14 | TypeScript type definitions cho React |
| `@types/react-dom` | ^19.2.3 | TypeScript type definitions cho React DOM |

---

## 6. Tiện Ích VS Code (VS Code Extensions)

Cài qua tab Extensions trong VS Code (`Ctrl+Shift+X`):

| Extension | Extension ID | Mục đích |
|-----------|-------------|---------|
| ES7+ React/Redux Snippets | `dsznajder.es7-react-js-snippets` | Snippet nhanh: `rfce`, `useState`, v.v. |
| Prettier | `esbenp.prettier-vscode` | Auto format code khi lưu |
| ESLint | `dbaeumer.vscode-eslint` | Hiển thị lỗi lint ngay trong editor |
| CSS Modules | `clinyong.vscode-css-modules` | Autocomplete class name trong CSS Modules |

### Tiện Ích Trình Duyệt (Browser Extension)

- **Redux DevTools** — [Chrome](https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) / [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

Cho phép xem toàn bộ state, từng action, và time-travel debug.

---

## 7. Cấu Trúc Thư Mục (Project Structure)

```
battle-ship/
├── src/
│   ├── main.jsx            ← entry point — mount React + Redux Provider + import tất cả CSS
│   ├── App.jsx             ← root component, render theo game phase
│   ├── index.css           ← global reset / base styles (body, *, button)
│   ├── styles/             ← tất cả CSS component — tập trung tại đây
│   ├── components/         ← React components (chỉ có .jsx, không có .css)
│   ├── store/              ← Redux store
│   ├── utils/              ← các hàm tiện ích
│   └── constants/
│       └── gameConstants.js ← BOARD_SIZE, PHASES, CELL_STATE, SHIP_TYPES
├── index.html
├── package.json
└── vite.config.js
```

---

## 8. Quy Ước Nhóm (Team Conventions)

### Đặt Tên File (File Naming)

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| React component | PascalCase | `GameBoard.jsx` |
| CSS (trong `styles/`) | kebab-case | `game-board.css` |
| Utility | camelCase | `boardUtils.js` |
| Constants | camelCase | `gameConstants.js` |

### CSS (Global CSS)

CSS global được import tại `main.jsx`.
Các component styles import ngay tại nơi sử dụng.

```jsx
// main.jsx — import CSS global
import './index.css';
// ...

// StartScreen.jsx
import '../styles/start-screen.css';
function StartScreen() {
  return <div className="start-screen">...</div>;
}
```

**Quy tắc đặt tên class** — prefix theo component để tránh xung đột:

| Component | Prefix | Ví dụ |
|-----------|--------|-------|
| `App` | `.app` | `.app` |
| `StartScreen` | `.start-` | `.start-title`, `.start-btn` |
| `StatusBar` | `.status-` | `.status-phase` |

### Redux — Dùng Trong Component (Redux Usage In Components)

```jsx
import { useAppSelector, useAppDispatch } from '../store/index.js';
import { playerAttack } from '../store/gameSlice.js';

function MyComponent() {
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.game.phase);

  const handleAttack = (row, col) => dispatch(playerAttack({ row, col }));
}
```

### Actions — Liên Kết Với Đặc Tả Use Case (Actions Mapping To UC Specs)

| Action | UC | Mô tả |
|--------|----|-------|
| `startGame` | UC-01 | Khởi tạo ván mới, init boards & fleets |
| `placeShip` | UC-02 | Đặt hoặc tái đặt tàu |
| `startBattle` | UC-02→03 | Chuyển phase SETUP → PLAYER_TURN |
| `playerAttack` | UC-03 | Player tấn công ô trên bảng máy tính |
| `computerAttack` | UC-04 | Máy tính tấn công (dispatch sau 500ms delay) |
| `restartGame` | UC-05 | Reset toàn bộ state về ban đầu |

---

## 9. Kiểm Tra Cài Đặt (Verify Installation)

Sau `npm run dev`, kiểm tra:

- [ ] Trang mở tại http://localhost:5173 không có lỗi console
- [ ] Redux DevTools hiển thị action `@@INIT` và initial state
- [ ] `StartScreen` render với nút "Bắt Đầu Ván Mới"
- [ ] Hot reload hoạt động: sửa text trong `StartScreen.jsx` → trình duyệt cập nhật ngay
- [ ] React Compiler hoạt động: không có warning `[ReactCompiler]` trong console (compiler tắt nếu phát hiện vi phạm rules)

---

## 10. Xử Lý Sự Cố (Troubleshooting)

| Vấn đề | Nguyên nhân phổ biến | Giải pháp |
|--------|---------------------|---------|
| `npm install` lỗi ERESOLVE | Node.js version < 18 | Nâng lên Node.js LTS |
| Port 5173 đã bị chiếm | Process khác đang chạy | `npm run dev -- --port 3000` |
| CSS Module class không autocomplete | Extension chưa cài | Cài `clinyong.vscode-css-modules` |
| Redux state không hiện trong DevTools | Extension chưa cài trên browser | Cài Redux DevTools cho Chrome/Firefox |
| `Cannot find module` khi import | Đường dẫn sai hoặc file chưa tồn tại | Kiểm tra path và extension `.js`/`.jsx` |
| ESLint báo lỗi sau khi update | Flat config chưa đúng | Kiểm tra `eslint.config.js` tồn tại ở root |
| React Compiler warning trong console | Component vi phạm Rules of React | Sửa component hoặc tạm tắt compiler trong `vite.config.js` |
