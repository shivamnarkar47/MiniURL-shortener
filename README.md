# MiniURL

A modern, sleek URL shortener built with Go and React, featuring a beautiful UI with smooth animations inspired by award-winning web design.

![MiniURL Screenshot](https://via.placeholder.com/1200x630/1a1a2e/iniURL+-+ffffff?text=MModern+URL+Shortener)

## Features

- **Instant URL Shortening** - Transform long URLs into compact, shareable links in seconds
- **Modern UI/UX** - Stunning interface with smooth animations and micro-interactions
- **Responsive Design** - Optimized for all screen sizes and devices
- **Dark Mode Ready** - Built with CSS variables for easy theming
- **Keyboard Shortcuts** - Press `/` to focus the URL input instantly
- **Real-time Feedback** - Toast notifications for all actions
- **Copy to Clipboard** - One-click copy functionality with visual feedback
- **Recent URLs** - View your recently shortened links

## Tech Stack

### Backend
- **Go** - Fast, statically typed compiled language
- **Standard Library** - HTTP server without external frameworks
- **In-Memory Storage** - Thread-safe concurrent storage with RWMutex

### Frontend
- **React 19** - Modern UI library with concurrent features
- **Vite** - Next-generation frontend tooling
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS with modern features
- **Framer Motion** - Production-ready animations
- **React Query** - Server state management
- **Radix UI** - Accessible UI primitives
- **Sonner** - Beautiful, gesture-friendly toast notifications

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0 (for frontend)
- [Go](https://go.dev) >= 1.20 (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MiniURL-shortener.git
cd MiniURL-shortener
```

2. Install frontend dependencies:
```bash
cd miniurl-frontend
bun install
```

3. Start the backend server:
```bash
cd MiniURL
go run main.go
```

4. In a new terminal, start the frontend development server:
```bash
cd miniurl-frontend
bun run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
MiniURL-shortener/
├── MiniURL/                    # Go backend
│   ├── main.go                # Application entry point & CORS middleware
│   ├── handlers/
│   │   └── handler.go         # HTTP handlers for URL operations
│   ├── models/
│   │   └── models.go          # Data models
│   ├── storage/
│   │   └── storage.go         # In-memory storage implementation
│   ├── vercel.json            # Vercel deployment config
│   ├── go.mod                 # Go module definition
│   └── Dockerfile             # Container configuration
│
├── miniurl-frontend/           # React frontend
│   ├── src/
│   │   ├── main.tsx           # Application entry point
│   │   ├── App.tsx            # Root component with layout
│   │   ├── index.css          # Global styles & CSS variables
│   │   ├── api/
│   │   │   └── urlShortner.ts # API client & endpoints
│   │   ├── components/
│   │   │   ├── ShortenForm.tsx    # URL input & submit form
│   │   │   ├── UrlList.tsx        # Recent URLs list
│   │   │   ├── UrlItem.tsx        # Individual URL card
│   │   │   ├── CopyButton.tsx     # Copy to clipboard button
│   │   │   └── ui/               # Reusable UI components
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── card.tsx
│   │   │       ├── label.tsx
│   │   │       ├── alert.tsx
│   │   │       ├── skeleton.tsx
│   │   │       └── sonner.tsx
│   │   ├── hooks/
│   │   │   └── useUrlShortener.ts # React Query hooks
│   │   └── lib/
│   │       └── utils.ts          # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── .github/workflows/
│   └── ping.yml                # GitHub Actions workflow
│
├── tsconfig.json               # Root TypeScript config
├── package.json                # Root package.json (Bun init)
├── index.ts                    # Root entry point
└── README.md                   # This file
```

## API Reference

### Endpoints

#### POST /shorten

Create a new shortened URL.

**Request:**
```json
{
  "original_url": "https://example.com/very/long/url",
  "short_code": "optional-custom-code" // optional
}
```

**Response:**
```json
{
  "original_url": "https://example.com/very/long/url",
  "short_code": "abc123",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### GET /recent

Retrieve recently created URLs.

**Query Parameters:**
- `limit` (optional): Number of URLs to return (default: 10, max: 100)

**Response:**
```json
[
  {
    "original_url": "https://example.com/url1",
    "short_code": "abc123",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "original_url": "https://example.com/url2",
    "short_code": "def456",
    "created_at": "2024-01-15T10:25:00Z"
  }
]
```

#### GET /{short_code}

Redirect to the original URL.

**Response:** HTTP 301 redirect to the original URL.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `8080` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |

### Frontend Environment Variables

Create a `.env` file in `miniurl-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Building for Production

### Frontend

```bash
cd miniurl-frontend
bun run build
```

The built files will be in the `dist/` directory.

### Backend

```bash
cd MiniURL
go build -o miniurl-server main.go
```

## Deployment

### Docker

```bash
cd MiniURL
docker build -t miniurl-backend .
docker run -p 8080:8080 miniurl-backend
```

### Vercel

The frontend can be deployed to Vercel with zero configuration.

### Environment Variables in Production

Set `VITE_API_BASE_URL` to your production backend URL.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) for the beautiful animations
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Awwwards](https://www.awwwards.com/) for design inspiration
