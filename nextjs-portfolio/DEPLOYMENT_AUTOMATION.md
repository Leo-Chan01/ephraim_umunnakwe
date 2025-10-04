# Automated Deployment Setup

## Option 1: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  repository_dispatch:
    types: [data-updated]
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: phenomenalephraim
```

2. Add Supabase webhook:
   - Go to Supabase Dashboard > Database > Webhooks
   - Create webhook for your tables
   - URL: `https://api.github.com/repos/Leo-Chan01/ephraim_umunnakwe/dispatches`
   - Add GitHub token in headers

## Option 2: Manual Deploy Script

Create a simple script to redeploy:
```bash
#!/bin/bash
cd /path/to/your/project
npm run build
firebase deploy --only hosting
```

## Option 3: Vercel (Alternative)

If you switch to Vercel:
- Automatic deploys on git push
- Webhook support for data changes
- Better Next.js integration
