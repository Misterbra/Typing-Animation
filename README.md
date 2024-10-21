# Typing Video Generator

A React application that generates MP4 videos of text being typed out with a sleek, minimal interface.

## Features

- Real-time text typing animation
- Automatic MP4 video recording
- Responsive design
- Dark mode interface

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
# or
yarn install
```

## Required Dependencies

```json
{
  "dependencies": {
    "typeit": "^8.7.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^13.0.0"
  }
}
```

## Usage

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open http://localhost:3000 in your browser
3. Enter your text in the input field
4. Click "Create Video" to start the typing animation and recording
5. The video will automatically download when complete

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main component
│   │   └── Home.module.css # Styles
│   └── ...
├── public/
└── package.json
```

## License

MIT