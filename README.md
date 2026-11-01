# Printed Sheets Portfolio

A single-page portfolio built with Next.js App Router, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and Lenis. Personal copy and project details live in `data/content.ts` as clearly marked placeholders.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Personalize

1. Replace the placeholder name, bio, projects, jobs, rules, email, and social links in `data/content.ts`.
2. Replace `public/shots/portrait.webp` with your optimized portrait and update `portraitAlt` in `data/content.ts`. Generate a WebP from an image with `node scripts/optimize-portrait.mjs <input-image>`.
3. Replace each project screen mockup with a real screenshot. Keep source images under `public/shots/`; run `npm run shots:generate` to export responsive WebP variants around 384, 640, and 1200 pixels wide from the SVG placeholders.
4. Copy `.env.example` to `.env.local` and set your GitHub values to enable the contribution calendar.

The GitHub token is read only by the server route and is never sent to the browser. Contribution data is cached for one hour. Without credentials, the page displays a setup note rather than fabricated data.

## Checks

```bash
npm run lint
npm run build
```

## Publish with GitHub and Vercel

1. Create an empty repository on GitHub.
2. From this folder, initialize Git if needed, commit the project, and push the default branch:

```bash
git init
git add .
git commit -m "Create portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

3. In Vercel, choose **Add New → Project**, import the GitHub repository, and keep the detected Next.js settings.
4. Add `GITHUB_USERNAME` and `GITHUB_TOKEN` under the Vercel project environment variables if you want the contribution calendar, then deploy.

Future pushes to `main` will trigger Vercel deployments. The repository and Vercel project must be connected using your GitHub account; no credentials or personal facts are included here.
