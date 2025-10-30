# 🚀 QUICK REFERENCE CARD

## 📍 WHERE TO PASTE API KEY

### File Location:
```
backend/.env.template
```

**Copy this file and rename to `.env`, then paste your key:**

```env
PORT=3000
NODE_ENV=development

# PASTE YOUR KEY HERE (after the = sign):
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

CORS_ORIGIN=*
```

**Get API Key:** https://makersuite.google.com/app/apikey

---

## ▶️ HOW TO START

### Terminal 1 - Backend:
```bash
cd "/Users/ankushchaudhary/Desktop/Intro Tool/backend"
npm run dev
```
**Wait for:** `🚀 Server running on http://localhost:3000`

### Terminal 2 - Frontend:
```bash
cd "/Users/ankushchaudhary/Desktop/Intro Tool/frontend"  
npm run dev
```
**Wait for:** `✓ Ready in 2.5s`

### Browser:
Open: **http://localhost:3001**

---

## 🔌 EXTENSION DEPLOYMENT

### Current Setup (Developer Mode):
✅ **You're using this now - perfect for testing!**

**How it works:**
- Loaded "unpacked" in Chrome
- Located at: `chrome://extensions/`
- You can use it right now!

### To Share With Friends:
1. Zip the extension folder
2. Send to them
3. They load it same way (Developer Mode)

### To Publish Publicly:
**See full guide:** `DEPLOYMENT_GUIDE.md`

**Quick version:**
1. Deploy backend to Railway/Render (gets public URL)
2. Update API URL in `extension/popup/popup.js`
3. Create professional icons (16x16, 48x48, 128x128)
4. Pay $5 Chrome Web Store fee
5. Submit extension ZIP
6. Wait 1-3 days for approval

**For Personal Use:** Just keep using Developer Mode! Free and works great.

---

## 📂 KEY FILES

| What | Where |
|------|-------|
| **API Key** | `backend/.env` |
| **Backend Start** | `backend/` → `npm run dev` |
| **Frontend Start** | `frontend/` → `npm run dev` |
| **Extension Folder** | `extension/` |
| **Database** | `backend/data/intros.json` |

---

## 🌐 URLS

| Service | URL |
|---------|-----|
| **Backend API** | http://localhost:3000 |
| **Frontend App** | http://localhost:3001 |
| **Health Check** | http://localhost:3000/health |
| **Chrome Extensions** | chrome://extensions/ |

---

## ✅ TESTING CHECKLIST

- [ ] Copied `.env.template` to `.env` in backend folder
- [ ] Pasted Gemini API key in `.env`
- [ ] Started backend (Terminal 1)
- [ ] Started frontend (Terminal 2)
- [ ] Opened http://localhost:3001 in browser
- [ ] Loaded extension in Chrome
- [ ] Tested on a YouTube video

---

## 🆘 QUICK FIXES

**Backend won't start:**
```bash
# Check if .env file exists
ls backend/.env

# Check if API key is there
cat backend/.env

# Restart
cd backend && npm run dev
```

**Frontend shows "Cannot connect":**
- Make sure backend is running first!
- Check http://localhost:3000/health

**Extension not working:**
- Refresh YouTube page
- Only works on `youtube.com/watch?v=...` URLs
- Check backend is running

---

## 📖 FULL GUIDES

- **Setup:** `START_HERE.md` - Step by step
- **Issues:** `TROUBLESHOOTING.md` - Common problems
- **Deploy:** `DEPLOYMENT_GUIDE.md` - Publishing extension
- **Docs:** `README.md` - Complete documentation

---

## 🎯 NEXT STEPS

1. ✅ Get Gemini API key
2. ✅ Paste in `backend/.env`
3. ✅ Start both servers
4. ✅ Load extension in Chrome
5. ✅ Test on YouTube video
6. 🎉 Enjoy!

---

**Everything is already installed! Just add your API key and start the servers.** 🚀

**Quick Test:**
1. Start backend
2. Start frontend  
3. Visit http://localhost:3001
4. Should see homepage!

