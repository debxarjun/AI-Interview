# InterviewAI — AI Interview Simulator

A production-quality SaaS-style mock interview platform for students and job seekers. Practice personalized interviews with voice mode, AI evaluation, resume analysis, and gamification.

## Features

- **Landing page** — Hero, features, testimonials, CTA
- **Profile setup** — Name, role, experience, skills, resume upload
- **AI interviews** — Technical, behavioral, situational, HR questions (one at a time)
- **Voice mode** — Text-to-speech questions + speech-to-text answers (Web Speech API)
- **Live interview UI** — Timer, progress, pause, dark/light mode
- **AI evaluation** — Scores, strengths, weaknesses, roadmap, PDF export, LinkedIn share
- **Dashboard** — History, score trends, role filter, XP/levels/badges
- **Resume analysis** — ATS score, missing skills, keywords, improvements
- **Extras** — Company-style interviews (Google, Amazon, etc.), coding mode, optional camera confidence

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion |
| UI | Shadcn-style components, Recharts |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma |
| Auth | Clerk |
| AI | OpenAI GPT-4o-mini |
| Voice | Web Speech API |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — PostgreSQL connection string
- Clerk keys (or leave empty to run without auth in dev)
- `OPENAI_API_KEY` — optional; mock questions/evaluation used when missing

### 3. Database setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                 # Pages & API routes
│   ├── api/             # Interview, resume, dashboard APIs
│   ├── setup/           # Profile setup
│   ├── interview/       # Live interview & results
│   ├── dashboard/       # History & gamification
│   └── resume/          # Resume analysis
├── components/          # UI, landing, layout
├── hooks/               # Speech, interview store
├── lib/                 # OpenAI, Prisma, gamification
└── types/               # Shared TypeScript types
```

## Deployment

1. Deploy to [Vercel](https://vercel.com)
2. Add environment variables in project settings
3. Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
4. Configure Clerk production instance
5. Run `npx prisma migrate deploy` for production DB

## License

MIT
