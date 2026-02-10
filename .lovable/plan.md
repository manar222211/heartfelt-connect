

# LoveVerse — Full Build Plan

## Phase 1: Foundation & Auth
- **Supabase Cloud setup** with database, auth, and storage
- **Multi-step signup flow**: email/password → age validation → education level → relationship goal → gender/interests → personality vibe selector → interest tags with icons
- **User profiles table** with all onboarding data (education, goals, personality, interests)
- **User roles table** (admin, moderator, user) for future moderation dashboard
- **Age safety rules**: prevent underage users from unsafe matching
- **Romantic design system**: neon hearts, soft gradients, smooth animations, light/dark/pink theme switcher, mobile-first responsive layout

## Phase 2: Avatar Creator
- **Avatar customization screen** (shown after signup): skin tone, hair style, eye style, outfit, accessories, mood sticker
- **Random avatar generator** button
- **Save multiple avatars** per user, select active avatar
- **Avatar stored as JSON** in Supabase, displayed across all app sections
- **Default avatar** assigned if user skips customization

## Phase 3: Feed & Posts
- **Feed page** with post cards showing user avatars
- **Post types**: text posts, confessions, anonymous posts (with blurred avatar silhouette)
- **Media uploads**: images/memes via Supabase Storage
- **Interactions**: like, react (emoji reactions), comment, save, report
- **Stories** bar at top of feed
- **Trending section** sidebar/tab
- **Daily challenges** section (AI-generated prompts)
- **Content moderation**: report system with flags stored in database

## Phase 4: Chat System
- **Real-time private messaging** using Supabase Realtime
- **Anonymous chat mode** with blurred avatars
- **Voice messages** uploaded to Supabase Storage
- **Stickers & emoji picker**
- **Virtual gifts** system (sending animated gift cards)
- **In-chat mini-games** launcher
- **AI icebreaker generator** (using Lovable AI) — suggests conversation starters
- **Chat moderation**: profanity filter, report & block system

## Phase 5: Blind Date & AI Matching
- **Blind Date page** with "Find a Match" button
- **AI matchmaking engine** (Lovable AI edge function): matches based on age compatibility, education, personality vibes, interests, with safety rules
- **Anonymous chat session** with matched user (blurred avatars)
- **Icebreaker questions** served by AI at session start
- **Compatibility score** displayed during session
- **Reveal system**: both users must consent to reveal identity (double-consent logic)
- **Session management**: time limits, session history

## Phase 6: Games Zone
- **Truth or Dare** (curated safe questions/dares)
- **Love Quiz** (compatibility questions between two players)
- **Emoji Memory Game** (match emoji pairs)
- **Random Question Generator** (fun/romantic questions)
- **Speed Chat** (timed chat rounds with random users)
- **Game rooms**: public lobbies + private room codes
- **Score tracking** and leaderboards
- **Playable in**: feed, private chats, blind date sessions

## Phase 7: AI Features
- **AI Love Advice Bot** — chatbot page powered by Lovable AI for relationship advice
- **AI Content Moderation** — edge function that scans posts/messages for unsafe content
- **AI Daily Challenges** — generates creative daily romantic/social challenges for the feed
- **AI Game Suggestions** — recommends games based on user mood/match context

## Phase 8: Admin Moderation Dashboard
- **Admin-only dashboard** (role-gated via user_roles table)
- **View & manage reports** (posts, messages, users)
- **Block/suspend users** with reason logging
- **Delete flagged posts**
- **Anonymized chat monitoring** for safety
- **Statistics dashboard**: user count, active users, reports, matches made
- **Moderation action logs**

## Phase 9: Profile & Settings
- **User profile page**: active avatar, bio, personality badges, interests, post history
- **Edit profile**: update preferences, personality, interests
- **Avatar management**: switch between saved avatars
- **Settings page**: theme switcher (light/dark/pink), notification preferences, privacy controls, block list management
- **Account management**: change password, delete account

## Navigation
Bottom navigation bar (mobile) / sidebar (desktop):
**Feed → Blind Date → Chat → Games → Profile**
Plus: Settings accessible from profile, Admin Dashboard accessible for admin roles only

