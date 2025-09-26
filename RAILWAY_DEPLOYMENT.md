# 🚀 Railway پر Deployment کی مکمل Guide

## مرحلہ 1: GitHub پر Upload کریں

1. **GitHub Repository بنائیں:**
   - GitHub.com پر جائیں
   - New Repository بنائیں
   - Repository name: `business-management-app`
   - Public یا Private (آپ کی مرضی)

2. **Code Upload کریں:**
```bash
git init
git add .
git commit -m "Initial commit - Business Management App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/business-management-app.git
git push -u origin main
```

## مرحلہ 2: Supabase Setup

1. **Supabase.com** پر جائیں
2. New Project بنائیں
3. SQL Editor میں جا کر `supabase/migrations/` کی تمام files run کریں
4. Settings > API سے یہ values copy کریں:
   - `Project URL`
   - `anon (public) key`
   - `service_role (secret) key`

## مرحلہ 3: Railway Deployment

1. **Railway.app** پر جائیں
2. GitHub سے Sign up کریں
3. "New Project" > "Deploy from GitHub repo"
4. اپنا repository select کریں

## مرحلہ 4: Environment Variables

Railway dashboard میں Variables tab پر یہ add کریں:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-app-name.up.railway.app
```

## مرحلہ 5: Domain Setup

1. Railway میں Settings > Networking
2. Generate Domain یا Custom Domain add کریں

## 🎉 Complete!

آپ کا app live ہو جائے گا! Railway automatically:
- Build کرے گا
- Deploy کرے گا  
- HTTPS certificate provide کرے گا
- Auto-scaling کرے گا

## 💡 Tips:

- Railway میں free tier $5/month credit ملتا ہے
- Logs Railway dashboard میں دیکھ سکتے ہیں
- کوئی issue ہو تو Redeploy کر سکتے ہیں

---

**کل وقت:** 10-15 منٹ ⏱️
**Cost:** Free (initial credits کے ساتھ)
