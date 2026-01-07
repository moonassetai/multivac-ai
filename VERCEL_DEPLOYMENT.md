# Deploying Multivac AI Landing Page to Vercel

## Quick Deploy (Recommended)

### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd c:\Users\USER\Documents\APPS\Multivac-AI
   vercel --prod
   ```

4. **Follow prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `multivac-ai`
   - Directory: `./public`
   - Override settings: `N`

### Option 2: Vercel Dashboard (No CLI)

1. **Go to:** https://vercel.com/new

2. **Import Git Repository:**
   - Click "Import Project"
   - Select "Import Git Repository"
   - Paste: `https://github.com/moonassetai/multivac-ai`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `public`
   - **Build Command:** (leave empty)
   - **Output Directory:** `.`
   - **Install Command:** (leave empty)

4. **Deploy:**
   - Click "Deploy"
   - Wait 30-60 seconds
   - Your site will be live at: `https://multivac-ai.vercel.app`

## Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain (e.g., `multivac.ai`)
   - Follow DNS configuration instructions

## Environment Variables

No environment variables needed for the landing page (it's static HTML).

## Automatic Deployments

Vercel automatically deploys on every push to `main` branch:
- Push to GitHub → Vercel auto-deploys → Live in ~30 seconds

## Troubleshooting

### Issue: 404 Not Found
**Solution:** Ensure `Root Directory` is set to `public` in Vercel settings

### Issue: Blank Page
**Solution:** Check browser console for errors. Ensure all CDN links (fonts, Font Awesome) are accessible.

### Issue: Slow Loading
**Solution:** Images are loaded from external sources. Consider hosting them in the repo for faster load times.

## Performance Optimization

Current landing page is already optimized:
- ✅ No build step required
- ✅ Pure HTML/CSS/JS (no frameworks)
- ✅ CDN fonts and icons
- ✅ Minimal dependencies
- ✅ Responsive design
- ✅ Scroll animations

## Monitoring

View deployment logs and analytics:
- **Dashboard:** https://vercel.com/dashboard
- **Analytics:** Available on Pro plan
- **Logs:** Real-time in Vercel dashboard

---

**Your landing page is now ready to deploy!** 🚀

Choose Option 1 (CLI) for fastest deployment or Option 2 (Dashboard) for visual setup.
