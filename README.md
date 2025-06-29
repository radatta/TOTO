# Toto – Personalized AI Learning Companion

> Empowering students on the autism spectrum with bite-sized, emotionally aware lessons and gamified rewards.

---

## 1. Overview

- **Goal:** Deliver a friendly, interactive learning system that breaks down educational content into manageable steps, presented conversationally with high emotional intelligence.
- **Audience:** Students on the autism spectrum, special-education teachers, therapists, and caregivers looking for adaptive learning aids.
- **Problem Solved:** Traditional e-learning often overlooks neurodiverse needs. Toto combines empathic voice interaction with incremental instruction and rewards to keep learners engaged and motivated.

## 2. Features

- 🗣 **Conversational lessons** – AI presents concepts in short, digestible steps tailored to the learner.
- 🧩 **Gamified rewards** – built-in matching game reinforces progress and sustains motivation.
- 🎙 **Real-time voice interaction** powered by Hume EVI with mute/un-mute and call controls.
- 🤗 **Emotion-aware responses** – leverage prosody & (soon) facial expression analysis to adjust teaching style.
- 💬 **Visual transcript** with clear separation of user vs. assistant messages.
- ⚡ **Accessible UI** – keyboard navigable, responsive, and minimal cognitive load.
- 🔒 **Secure auth** – server-side token generation keeps API keys safe.

## 3. Tech Stack

- **Framework / Runtime:** Next.js 14 (App Router, Server & Client Components)
- **Language:** TypeScript & React 18
- **AI / LLM:** `@humeai/voice`, `@humeai/voice-react`, OpenAI (gpt-4o) _(planned)_
- **Styling:** Tailwind CSS v3, Radix UI, CVA, clsx
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **State & Utilities:** Hume `useVoice` hook, Remeda, ts-pattern
- **Package Manager:** Bun
- **Architecture Highlights:**
  - Server-only utility (`utils/getHumeAccessToken.ts`) isolates credential usage.
  - Dynamic import disables SSR for audio-only client components.
  - Strict ESLint + Prettier + Tailwind plugin keep the codebase consistent.

## 4. How It Works (Flow)

1. User navigates to `/hume` route.
2. The **server component** calls `getHumeAccessToken()` which exchanges your `HUME_API_KEY` & `HUME_CLIENT_SECRET` for a short-lived JWT.
3. Token is passed as a prop to the **`<Chat>` client component**.
4. Inside `Chat`, `VoiceProvider` from `@humeai/voice-react` initialises a WebSocket connection once the user presses **Start Call**.
5. `useVoice` context streams messages & audio events which power:
   - `<Messages>` – renders the transcript.
   - `<Controls>` – handles mute / end call & shows mic FFT.
6. When the conversation ends, resources are released and the UI resets.

> 🧩 **Reward Loop:** After a lesson sequence, Toto launches a simple matching game to reinforce the concept and award points. _(Prototype in progress – see Future Improvements.)_

## 5. Setup & Installation

### Prerequisites

- **Bun** ≥ 1.1 (`curl -fsSL https://bun.sh/install | bash`)
- A **Hume AI** account with an _API Key_ and _Client Secret_.

### Steps

```bash
# 1. Clone
git clone https://github.com/radatta/TOTO && cd TOTO

# 2. Install dependencies (blazing fast!)
bun install

# 3. Configure environment variables
cp .env.local.example .env.local  # create file if example is missing
# then edit .env.local and add:
# HUME_API_KEY=pk_...your_key...
# HUME_CLIENT_SECRET=sk_...your_secret...

# 4. Run in development
bun run dev   # or bunx next dev

# 5. Open
open http://localhost:3000/hume
```

> **Note:** On first run, the browser will ask for microphone permissions.

## 6. Usage Examples

- **Start a conversation:** Navigate to `/hume`, click _Start Call_, speak, and watch the transcript populate in real time.
- **Mute / Un-mute:** Toggle the microphone icon – the FFT bar will freeze when muted.
- **End Call:** Hit the red _End Call_ button to terminate the WebSocket and reset the UI.

```tsx
// Programmatic example – send a system prompt on connect
import { useVoice } from "@humeai/voice-react";
...
const { connect, send } = useVoice();
await connect();
send("You are a helpful assistant – keep replies short.");
```

## 7. Project Structure

```
├── app/               # Next.js App Router routes
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Landing page
│   └── hume/          # EVI experience
│       ├── page.tsx   # Fetches token & mounts <Chat>
│       └── layout.tsx # Section-specific layout (optional)
├── components/        # Reusable React components
│   ├── Chat.tsx       # Core client wrapper around <VoiceProvider>
│   ├── Messages.tsx   # Transcript list
│   ├── Controls.tsx   # Call controls & mic FFT visualiser
│   ├── StartCall.tsx  # Intro overlay button
│   └── ui/            # Radix-based primitives (Button, Toggle, Toast)
├── utils/
│   ├── getHumeAccessToken.ts # Server-only token fetch logic
│   └── index.ts             # Shared helpers (class names, colours)
├── public/            # Static assets
└── tailwind.config.ts # Design system configuration
```

## 8. Challenges & Learnings

- **Server ⇄ Client boundaries:** Passing auth tokens securely required careful separation of server-only code.
- **Web Audio & FFT:** Visualising live mic data while maintaining 60 FPS taught valuable performance tuning tricks.
- **App Router migration:** Leveraged new Next.js 14 features (server actions, streaming) and learned their caveats.

## 9. Future Improvements

- 📊 **Emotion dashboard:** Render real-time charts of detected prosody & facial expressions.
- 🛡 **Auth layer:** Protect the `/hume` route behind login.
- 🌐 **i18n & TTS selection:** Allow switching languages / voices on the fly.
- 🚀 **CI/CD:** GitHub Actions workflow for lint, test, and Vercel preview deploys.
- 🧠 **Adaptive curriculum:** Fine-tune lesson difficulty based on real-time emotion signals.
- 🎮 **Expanded game library:** Add sequencing and memory games to diversify rewards.
- 👀 **Facial expression analysis:** Integrate Hume's Expression Measurement API for richer feedback.
- 🔊 **Text-to-speech variety:** Support multiple voices & languages.

## 10. Credits & Inspiration

- Built during the **UC BERKELEY** **AI Hackathon 2024** – see full story on [Devpost](https://devpost.com/software/toto-jlw31n?ref_content=my-projects-tab&ref_feature=my_projects)
- Based on the official [Hume EVI Next.js Starter](https://github.com/humeai/hume-evi-next-js-starter).
- Iconography by [Lucide](https://lucide.dev/).
- Animated UI patterns inspired by [Framer Motion](https://www.framer.com/motion/).

---

> Built with ❤️, caffeine, and a passion for inclusive education.
