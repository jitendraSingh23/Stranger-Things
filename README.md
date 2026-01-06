# Stranger Things Alphabet Wall 💡👻

> *"Right here. Right now." - Vecna*

A spooky, interactive web application recreating the iconic alphabet wall from **Stranger Things**. Send messages from the Upside Down using a flickering layout of fairy lights!


## ✨ Features

- **Interactive Message Board**: Type any message, and watch the alphabet lights flicker and spell it out letter by letter.
- **Realistic Visuals**:
  - Authentic "monster" font with unique letter rotations.
  - SVG-drawn wires that connect each bulb realistically, dipping between letters.
  - "Wooden" wall background texture.
- **Shareable Messages**:
  - Messages are encoded into the URL (e.g., `?msg=...`).
  - **Copy Link**: Easily share your spooky messages with friends.
  - Auto-plays the message when a shared link is opened.
- **Spooky Atmosphere**:
  - "Vecna Lives" glowing title using the **Nosifer** font.
  - Random flickering effects (all lights go crazy) before and after message playback.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) 19
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (with some inline styles for dynamic layouts)

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jitendraSingh23/Stranger-Things.git
   cd stranger-things
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 🎮 Usage

1. **Type a Message**: Enter text into the input field at the bottom.
2. **Display Message**: Click "Display Message" or hit Enter.
   - The lights will flicker chaotically first.
   - Then, they will light up one by one to spell your message.
   - Finally, they will flicker again to end the transmission.
3. **Share**: Click the "Copy Link" button to generate a URL with your current message encoded. Send it to a friend!


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Made with 🩸 and 💡 in the Upside Down.*
