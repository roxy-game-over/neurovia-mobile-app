# Neurovia Mobile App

I am creating a separate Lovable project for the Neurovia mobile app.

The existing Neurovia project already contains a fully built and end-to-end verified mobile app at /app. I want this new project to become the dedicated Neurovia Mobile App project.

IMPORTANT: Do NOT redesign, simplify, or rebuild the product concept from scratch. Recreate the existing mobile app functionality, UX, visual language, flows, and architecture as faithfully as possible.

Here is the exact functionality that already exists and must be transferred/recreated:

AUTHENTICATION

Email sign-up and sign-in

Proper “check your email” confirmation state

Google sign-in

New user profiles automatically receive 500 coins

Authenticated users are routed correctly into onboarding/app

Secure sign-out

ONBOARDING — 4 STEPS

Welcome screen introducing VI

Concerns selection:
Overthinking, Stress, Sleep, and the existing concern options

Goals selection

Journey-start screen

Save selections to the user's profile

Correct routing after onboarding

HOME

Daily check-in

Mood

Sleep

Energy

Save check-in data to the user's account/database

Award +10 coins after completing the check-in

Track the user's streak

Preserve the existing 500 → 510 coin behaviour that has already been verified

PRACTICE
Keep all five existing practices fully functional:

Box Breathing

In 4

Hold 4

Out 6

Rest 4

Animated timer

Grounding 5-4-3-2-1

Tap-to-notice interaction

Circles/interactions

One-line Journal

Private user entry

Save to the user's account

Thought Reframe

Save privately to the user's account

Guided 2-minute Wind-down

Completing a practice awards +20 coins.

GARDEN
Maintain the existing progression system:
Seed → Sprout → Sapling → Flowering → Strong Tree → Blooming → Sanctuary

Progress is based on completed practices

Live progress bar

Correct progression/unlocking logic

Existing progress messaging such as “3 more practices to reach Sprout”

VIA AI COMPANION

Real AI companion chat

Authenticated user experience

Preserve the existing VIA concept, personality, UI and chat flow

Do not replace the AI functionality with a fake/demo chatbot

Use secure backend/API architecture for AI calls

Do not expose API keys or secrets in frontend code

PROFILE

Editable name

Coins

Completed practices

Garden/stage statistics

User concerns

User goals

Dark/light theme toggle

Sign-out

Existing name backfill behaviour for profiles where metadata loads late

CARE & SAFETY
Include the existing Care & Safety section with:

Professional care

Psychologists/psychiatrists marked “coming soon”

Indian crisis resources:

Tele-MANAS — 14416

KIRAN

AASRA

112

Privacy principles

Links to the relevant Neurovia legal/privacy pages

MOBILE UX
The app must feel like a genuine mobile application, not a desktop website squeezed into a phone screen.

Maintain:

Full-screen mobile shell

Existing navigation

Existing spacing, typography, cards, icons and interactions

Smooth transitions/animations

Responsive behaviour

Touch-friendly controls

Existing Neurovia visual identity

Existing VI branding

ROUTING
The dedicated mobile app should use /app/* routes.

The app must have its own mobile shell and must not depend on the website header/footer.

The root website / is a separate Neurovia website and must NOT be recreated, replaced, redirected, or redesigned as part of this project.

DATA & BACKEND
The existing app has already been tested with a real signed-in account.

Preserve the same intended data model and behaviour for:

Users/profiles

Concerns

Goals

Daily check-ins

Mood/sleep/energy

Practices

Journal entries

Thought reframes

Coins

Streaks

Garden progression

AI conversations

IMPORTANT:
Before implementing backend/database integrations, identify which existing integrations, schemas, API endpoints, authentication configuration, environment variables, and secrets need to be transferred from the original project.

Do NOT invent database tables, API keys, credentials, or external services.

If something cannot be automatically transferred from the original project, clearly tell me what I need to provide or configure rather than silently creating a different implementation.

CURRENT VERIFIED STATE
The original implementation was already verified end-to-end:

Sign-up/sign-in tested

Onboarding tested

Daily check-in tested

Coins tested: 500 → 510

Practices tested

Garden progression tested

VIA tested

Profile tested

Safety section tested

/app/* mobile shell tested

I want this new project to reproduce that verified functionality as closely as possible.

IMPORTANT WORKFLOW:
Before making major changes, first create a clear implementation plan and identify:
A. What can be recreated directly from this specification
B. What requires assets/code from the original project
C. What backend/database configuration needs to be transferred
D. What API/environment variables need to be configured
E. What cannot be transferred automatically

Do not publish or deploy anything yet.

First analyse the requirements and tell me what you need from the original Neurovia project to reproduce the app faithfully.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8a62dbf6-c068-4f32-9018-fdb058781a62).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
