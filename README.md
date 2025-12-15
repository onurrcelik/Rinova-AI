# Virtual Staging AI

A modern Next.js application for real estate virtual staging, powered by **fal.ai** and **Flux/Genome** models.

![App Screenshot](public/screenshot_placeholder.jpg)

## Features

- 🤖 **AI-Powered Redesign**: Instantly virtually stage empty rooms using the Nano Banana Pro / Gemini 3 model via fal.ai.
- 🎨 **Style Selection**: Choose from premium styles like Modern, Scandinavian, Industrial, and Bohemian.
- ↔️ **Interactive Comparison**: Real-time "Before vs After" slider to showcase the transformation.
- ⚡ **High Performance**: Built with Next.js 14+ (App Router), Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS, shadcn/ui, Lucide React
- **AI Provider**: [fal.ai](https://fal.ai) (Nano Banana Pro / Gemini 3)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A [fal.ai](https://fal.ai) API key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/virtual-staging-ai.git
    cd virtual-staging-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Copy the example file:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and add your API key:
    ```env
    NEXT_PUBLIC_FAL_KEY=your_fal_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router pages and API routes
├── components/           # React components (UI and Feature-specific)
│   ├── ui/               # shadcn/ui reusable components
│   ├── upload-zone.tsx   # File upload component
│   └── ...
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
