# 📦 Team Installation Guide# 🤝 Sharing Extension with Your Team (No Azure Needed!)



Quick guide for installing Atomic Shadcn extension in your team.## For Team Use - Azure NOT Required!



## 📥 Installation (2 minutes)Azure is only needed for **public marketplace**. For your team, it's super simple!



### Step 1: Download---



Get `atomic-shadcn-0.0.1.vsix` from:## ✅ Method 1: Share VSIX File Directly (Easiest!)

- 📧 Email/Slack from team lead

- 📁 Shared drive: `[INSERT LOCATION]`### You Have the File Already!

- 🔗 GitHub releases: `[INSERT URL]`

**Location:** `/Users/deepa/Documents/untitled folder 2/atomic-shadcn-0.0.1.vsix`

### Step 2: Install

### How to Share:

**Drag & Drop (Easiest):**

1. Open VS Code#### Option A: Email/Slack/Teams

2. Go to Extensions (`Cmd+Shift+X`)```

3. Drag VSIX file into Extensions panel1. Attach atomic-shadcn-0.0.1.vsix to email/message

4. Click **Install**2. Send to team

3. They install it

**Or via Menu:**4. Done! ✅

1. Extensions → `...` → Install from VSIX```

2. Select the VSIX file

3. Reload VS Code#### Option B: Shared Drive

```

### Step 3: Install CLI1. Upload to Google Drive / Dropbox / OneDrive

2. Share link with team

```bash3. They download and install

# Contact IT or team lead for CLI installation```

cd /path/to/atomic-shadcn-cli

sudo npm link#### Option C: Company Server

``````

1. Put VSIX on company file server

Verify: `atomic-shadcn --help`2. Team accesses it like any other file

```

### Step 4: Verify

### Team Installation (Super Easy):

1. Open any project

2. Look for "Atomic Shadcn" in status bar (bottom right)**Method 1: Drag & Drop**

3. Click it → See command menu```

4. ✅ Done!1. Download VSIX file

2. Open VS Code

---3. Drag VSIX file into VS Code Extensions panel

4. Click "Install"

## 🚀 Quick Start5. Done! ✅

```

1. **Click "Atomic Shadcn"** in status bar

2. **Select "Initialize"** → Creates atomic folders**Method 2: Extensions Menu**

3. **Select "Add Component"** → Type "button"```

4. Component installed atomically! 🎉1. Open VS Code

2. Press Cmd+Shift+X (Extensions)

---3. Click "..." (three dots at top)

4. Select "Install from VSIX..."

## 📖 Available Commands5. Choose the VSIX file

6. Click "Install"

| Command | What It Does |```

|---------|--------------|

| **Initialize** | Create atoms/, molecules/, organisms/ |**Method 3: Command Line**

| **Add Component** | Install & organize component |```bash

| **Organize** | Move ui/ files to atomic folders |code --install-extension atomic-shadcn-0.0.1.vsix

| **Remove Packages** | Uninstall npm packages |```

| **Uninstall** | Revert to ui/ structure |

| **Show Mapping** | View component categories |---



---## ✅ Method 2: Private GitHub Repository (Best for Teams!)



## 🔍 Component Categories### Setup (5 minutes):



**Atoms:** button, input, label, checkbox, switch, badge, avatar  ```bash

**Molecules:** alert, dialog, tooltip, popover, dropdown-menu, tabs  cd "/Users/deepa/Documents/untitled folder 2"

**Organisms:** card, form, table, calendar, navigation-menu, sidebar

# 1. Initialize git

---git init

git add .

## 🐛 Troubleshootinggit commit -m "Initial commit: Team extension"



### "Atomic Shadcn" not visible# 2. Create PRIVATE repo on GitHub

- **No folder open?** → File → Open Folder# Go to: https://github.com/new

- **Need reload?** → `Cmd+Shift+P` → "Developer: Reload Window"# Name: atomic-shadcn-extension

# Select: PRIVATE repository ✅

### "command not found: atomic-shadcn"# Click "Create repository"

- **CLI not installed** → Contact team lead

# 3. Push code

### Extension not workinggit remote add origin https://github.com/YOUR_COMPANY/atomic-shadcn-extension.git

- Check Extensions panel → Should be enabledgit branch -M main

- Check Output panel → View → Output → "Atomic Shadcn"git push -u origin main



---# 4. Create release

# Go to repo → Releases → New Release

## 💬 Support# Upload VSIX file

```

**Need help?**

- Slack: `[INSERT CHANNEL]`### Team Access:

- Email: `[INSERT EMAIL]`

- See full docs: `docs/USER_GUIDE.md````bash

# Team members:

---1. Go to: https://github.com/YOUR_COMPANY/atomic-shadcn-extension/releases

2. Download latest VSIX

## ✅ Quick Reference3. Install in VS Code

4. Done!

**Access:** Click "Atomic Shadcn" in status bar (bottom right)  ```

**Or:** `Cmd+Shift+P` → Type "Atomic Shadcn"

### Advantages:

**Requirements:**- ✅ Version control

- VS Code 1.85+- ✅ Only your team can access

- atomic-shadcn CLI installed- ✅ Easy updates (just upload new VSIX)

- Project with shadcn/ui- ✅ Track who downloads



------



*Version 0.0.1 | Last updated: Nov 2025*## ✅ Method 3: Company Internal Package Registry


### Option A: npm Private Registry

```bash
# Setup (company admin)
npm login --registry=https://your-company-registry.com

# Publish extension
npm publish --registry=https://your-company-registry.com

# Team installs
npm install -g @yourcompany/atomic-shadcn-extension
```

### Option B: Artifactory / Nexus

```
1. Upload VSIX to Artifactory
2. Team downloads from company repository
3. Controlled and secure
```

---

## ✅ Method 4: Internal Wiki / Confluence / SharePoint

### Simple Documentation Approach:

**Create page with:**
```markdown
# Atomic Shadcn Extension

## Download
[📥 atomic-shadcn-0.0.1.vsix](link-to-file)

## Installation
1. Download VSIX above
2. In VS Code: Extensions → ... → Install from VSIX
3. Select downloaded file
4. Reload VS Code

## Requirements
- Install CLI: [Instructions](link)

## Support
Contact: your-email@company.com
```

---

## ✅ Method 5: Install Script (Automatic!)

### Create Team Install Script:

**For Mac/Linux (`install.sh`):**
```bash
#!/bin/bash
echo "🚀 Installing Atomic Shadcn Extension..."

# Download from company server / GitHub / shared drive
curl -LO "https://your-company-server.com/atomic-shadcn-0.0.1.vsix"

# Install
code --install-extension atomic-shadcn-0.0.1.vsix

# Install CLI
echo "Installing CLI..."
npm install -g /path/to/atomic-shadcn-cli

echo "✅ Installation complete!"
echo "Reload VS Code to activate extension."
```

**For Windows (`install.ps1`):**
```powershell
Write-Host "🚀 Installing Atomic Shadcn Extension..."

# Download
Invoke-WebRequest -Uri "https://your-server.com/atomic-shadcn-0.0.1.vsix" -OutFile "atomic-shadcn.vsix"

# Install
code --install-extension atomic-shadcn.vsix

Write-Host "✅ Installation complete!"
```

**Team runs:**
```bash
# Mac/Linux
curl -s https://your-server.com/install.sh | bash

# Windows
iwr -useb https://your-server.com/install.ps1 | iex
```

---

## ✅ Method 6: VS Code Settings Sync (Future Updates)

### Setup Recommended Extensions:

**In your team's `.vscode/extensions.json`:**
```json
{
  "recommendations": [
    "atomic-shadcn"
  ],
  "unwantedRecommendations": []
}
```

**Then share VSIX file once**, team installs, and VS Code remembers it!

---

## 📊 Comparison for Team Use

| Method | Setup Time | Best For | Updates |
|--------|-----------|----------|---------|
| **Email VSIX** | 1 min | Small teams (2-5) | Manual |
| **Shared Drive** | 2 min | Medium teams (5-20) | Replace file |
| **Private GitHub** | 5 min | Any size team | New releases |
| **Install Script** | 10 min | Large teams (20+) | Update script |
| **Internal Registry** | 30 min | Enterprise | Automatic |

---

## 🎯 Recommended: Private GitHub Releases

**Why it's best for teams:**
- ✅ Version control
- ✅ Easy to update (just upload new VSIX)
- ✅ Access control (private repo)
- ✅ Release notes for team
- ✅ Free
- ✅ Professional

---

## 🚀 Let's Set It Up Right Now!

### Quick Team Distribution (5 minutes):

**Option 1: Email (Immediate)**
```bash
# 1. Locate VSIX file
ls "/Users/deepa/Documents/untitled folder 2/atomic-shadcn-0.0.1.vsix"

# 2. Send email with:
Subject: New Atomic Shadcn Extension
Body: 
  Hi Team,
  
  Attached is our new extension for organizing shadcn components.
  
  Installation:
  1. Download attachment
  2. VS Code → Extensions → ... → Install from VSIX
  3. Select the file
  4. Reload VS Code
  
  Documentation: [link]
  Support: [your-email]
```

**Option 2: Slack/Teams (Immediate)**
```
1. Upload VSIX to channel
2. Pin message with installation instructions
3. Team downloads and installs
```

---

## 📋 Team Installation Guide

**Create this document for your team:**

```markdown
# Atomic Shadcn Extension - Team Installation

## Step 1: Download Extension

Get the file from:
- [ ] Email attachment
- [ ] Slack #tools channel
- [ ] Company drive: /shared/tools/vscode-extensions/
- [ ] GitHub: https://github.com/company/atomic-shadcn/releases

## Step 2: Install in VS Code

### Easy Method (Drag & Drop):
1. Download `atomic-shadcn-0.0.1.vsix`
2. Open VS Code
3. Open Extensions panel (Cmd+Shift+X)
4. Drag VSIX file into Extensions panel
5. Click "Install"

### Traditional Method:
1. Open VS Code
2. Press `Cmd+Shift+X` (Extensions)
3. Click `...` → "Install from VSIX..."
4. Select downloaded VSIX file
5. Click "Open"

## Step 3: Install CLI (Required)

```bash
# Contact IT or run:
npm install -g /path/to/atomic-shadcn-cli
```

## Step 4: Verify Installation

1. Open VS Code
2. Open any project
3. Look for "Atomic Shadcn" in status bar (bottom right)
4. Click it to see commands
5. ✅ Working!

## Troubleshooting

### Extension doesn't appear
- Reload VS Code: Cmd+Shift+P → "Developer: Reload Window"
- Check Extensions panel - should be listed

### "Command not found: atomic-shadcn"
- CLI not installed
- Contact: [IT-support-email]

## Support

- Questions: [your-email] or #dev-tools Slack
- Issues: [GitHub issues link or internal ticket system]
```

---

## 🔄 Updating Extension for Team

### When you release v0.0.2:

**Method 1: Email New VSIX**
```
Subject: Atomic Shadcn Extension v0.0.2 Update

Hi Team,

New version available with [features].

Installation:
1. Uninstall old version (optional)
2. Install new VSIX (attached)

Changes:
- [feature 1]
- [bug fix]
```

**Method 2: GitHub Release**
```bash
# Create new release
git tag v0.0.2
git push --tags

# Upload new VSIX
# Team downloads latest
```

**Method 3: Auto-Update Script**
```bash
# Team runs:
./update-extension.sh

# Script downloads latest and installs
```

---

## 💡 Pro Tips

### 1. Central Documentation
Create one place for:
- Latest VSIX download
- Installation guide
- CLI setup
- Support contact

### 2. Onboarding Checklist
Add to new developer onboarding:
- [ ] Install Atomic Shadcn extension
- [ ] Install CLI
- [ ] Test with demo project

### 3. Version Tracking
Keep changelog so team knows what changed:
```
v0.0.2 - Added organize command
v0.0.1 - Initial release
```

---

## ✅ Complete Team Setup Checklist

- [ ] Package extension (you did this! ✅)
- [ ] Choose distribution method (email, GitHub, shared drive)
- [ ] Write installation guide
- [ ] Test installation on one teammate's machine
- [ ] Distribute to entire team
- [ ] Provide support channel
- [ ] Plan for updates

---

## 🎊 Summary

**For your team - NO Azure needed!**

**Easiest:**
1. Email VSIX file
2. Team installs from file
3. Done in 5 minutes! ✅

**Most Professional:**
1. Create private GitHub repo
2. Upload VSIX as release
3. Team downloads from releases page
4. Easy to update

**Most Automated:**
1. Create install script
2. Team runs one command
3. Everything installed automatically

---

## 🚀 Want Me To Help?

I can help you:
- [ ] Create team installation guide
- [ ] Set up private GitHub repo
- [ ] Write install script
- [ ] Create distribution email template
- [ ] Set up update process

**Or just email the VSIX file right now!** It's already ready to share. 📧

What works best for your team? 🎯
