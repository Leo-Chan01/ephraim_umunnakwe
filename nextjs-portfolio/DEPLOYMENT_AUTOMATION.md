# Automated Deployment Setup

## Why this exists

The site is a static export (`output: 'export'`). Link-preview crawlers (WhatsApp, X,
LinkedIn, iMessage, Slack) read the raw HTML and **don't run JavaScript**, so a blog
post's `og:image` / `og:title` only exist once the site has been rebuilt with that post.
A post created or edited after the last deploy is served by the `/blog/_/` placeholder.
That page has no post-specific tags, so its link preview shows the generic site title
and no image.

The fix is to rebuild and redeploy automatically whenever a blog post changes.

## How it works

```
Blog editor saves post ─► Supabase trigger (sql/blog_deploy_trigger.sql)
                       ─► GitHub repository_dispatch "blog-updated"
                       ─► .github/workflows/deploy-nextjs.yml (build + Firebase deploy)
```

The workflow also runs on pushes to `main` that touch `nextjs-portfolio/`, and manually
from **Actions → Deploy Next.js portfolio → Run workflow**. A deploy takes a few minutes.

## One-time setup

1. **Firebase service account → GitHub secret**
   - Run `firebase init hosting:github` in `nextjs-portfolio/` (it creates the secret for you), **or**
   - Google Cloud Console → project `phenomenalephraim` → IAM → Service Accounts → create a key
     with the *Firebase Hosting Admin* role, then in the GitHub repo add the JSON as secret
     `FIREBASE_SERVICE_ACCOUNT_PHENOMENALEPHRAIM`.
2. **GitHub token for Supabase**: create a fine-grained token for repo
   `Leo-Chan01/ephraim_umunnakwe` with *Contents: Read and write*.
3. **Supabase trigger**: in the SQL editor, store the token
   (`select vault.create_secret('<token>', 'github_dispatch_token');`), then run
   `sql/blog_deploy_trigger.sql`.
   - Alternative: Dashboard → Database → Webhooks → table `blog_posts`, Insert/Update/Delete,
     HTTP POST `https://api.github.com/repos/Leo-Chan01/ephraim_umunnakwe/dispatches`,
     headers `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`,
     body `{"event_type":"blog-updated"}`.

## Manual deploy

```bash
cd nextjs-portfolio
npm run deploy
```

## After a deploy: refreshing cached previews

Platforms cache a URL's preview. If a link was already shared before the fix, re-share it
with a throwaway query string (e.g. `…/blog/my-post/?v=2`), or re-scrape with the
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (also used by WhatsApp)
or the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

## Preview image size

WhatsApp ignores large `og:image` files (roughly over 300–600 KB). Blog image uploads are
resized to ≤1200px wide and re-encoded as JPEG in the browser (`utils/compressImage.ts`).
1200×630 is the ideal featured-image size.
