# Push to GitHub - Authentication Required

Your repository is connected, but you need to authenticate to push. Here are your options:

## Option 1: Personal Access Token (Recommended - Easiest)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Priesmont Website"
   - Select scopes: Check `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push using the token:**
   ```bash
   cd /Users/paco.puylaert/Desktop/Priesmont
   git push -u origin main
   ```
   - When prompted for **Username**: Enter `pacopuylaertfuxia`
   - When prompted for **Password**: Paste your **Personal Access Token** (not your GitHub password)

## Option 2: Use SSH Instead (More Secure)

1. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Optionally set a passphrase
   ```

2. **Add SSH key to GitHub:**
   ```bash
   # Copy your public key
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key and save

3. **Change remote to SSH:**
   ```bash
   cd /Users/paco.puylaert/Desktop/Priesmont
   git remote set-url origin git@github.com:pacopuylaertfuxia/priesmont-website.git
   git push -u origin main
   ```

## Option 3: GitHub Desktop (Easiest GUI Method)

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select `/Users/paco.puylaert/Desktop/Priesmont`
4. Click "Publish repository" button

---

## Quick Command (Option 1 - Token Method)

After creating your token, just run:
```bash
cd /Users/paco.puylaert/Desktop/Priesmont
git push -u origin main
```

Then enter:
- **Username:** `pacopuylaertfuxia`
- **Password:** (paste your personal access token)

---

**Which method do you prefer?** I recommend Option 1 (Personal Access Token) as it's the quickest.

