# Atomic Shadcn Extension - Usage Guide

## Quick Start

### 1. Install the CLI
The extension requires the atomic-shadcn CLI to be installed globally:

```bash
cd /path/to/atomic-shadcn-cli
sudo npm link
```

Verify installation:
```bash
atomic-shadcn --help
```

### 2. Install the Extension

**Option A: Development (Local)**
1. Open this folder in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window will open with the extension loaded

**Option B: Install VSIX**
1. Run `npm run package` to create a `.vsix` file
2. In VS Code: `Extensions → ... → Install from VSIX...`
3. Select the generated `.vsix` file

### 3. Use the Extension

#### Via Status Bar (Recommended)
- Look for **"Atomic Shadcn"** text in the status bar (bottom right corner)
- Click it to open a quick pick menu with all commands
- Each command has an icon and description

#### Via Command Palette
- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type "Atomic Shadcn"
- Select your desired command from the list

#### Via Context Menu
- Right-click any folder in the Explorer sidebar
- Look for "Atomic Shadcn" commands in the context menu
- Available commands: Initialize, Add Component, Organize Components

## Commands Overview

### Initialize
**Command:** `Atomic Shadcn: Initialize`

Creates the atomic structure:
```
components/
  atoms/
    index.ts
  molecules/
    index.ts
  organisms/
    index.ts
```

**When to use:** Starting a new project or converting existing shadcn setup

---

### Add Component
**Command:** `Atomic Shadcn: Add Component`

1. Prompts for component name (e.g., "button", "dialog")
2. Runs `npx shadcn@latest add <component>`
3. Automatically organizes it into the correct atomic folder
4. Updates all imports

**When to use:** Installing new shadcn components

**Example:**
```
Input: button
Result: components/atoms/button.tsx
```

---

### Organize Components
**Command:** `Atomic Shadcn: Organize Components`

Moves all existing components from `components/ui/` to atomic folders and updates imports.

**When to use:** You have existing shadcn components in `ui/` and want to organize them

**Before:**
```
components/ui/
  button.tsx
  dialog.tsx
  card.tsx
```

**After:**
```
components/
  atoms/button.tsx
  molecules/dialog.tsx
  organisms/card.tsx
```

---

### Remove All Packages
**Command:** `Atomic Shadcn: Remove All Packages`

Two options:
1. **Remove all packages**: Uninstalls all `@radix-ui/*` packages from package.json but keeps component files and atomic structure
2. **Remove specific component**: Deletes a single component file from atomic folders

**When to use:** 
- Cleaning up dependencies while keeping components
- Removing a single component you no longer need

---

### Uninstall
**Command:** `Atomic Shadcn: Uninstall`

Two options:
1. **Complete uninstall**: Moves all components back to `components/ui/`, deletes atomic folders, fixes all imports
2. **Uninstall specific component**: Moves one component back to `ui/`

**When to use:** Reverting back to standard shadcn structure

**After complete uninstall:**
```
components/ui/
  button.tsx
  dialog.tsx
  card.tsx
```

---

### Show Component Mapping
**Command:** `Atomic Shadcn: Show Component Mapping`

Displays the complete classification of components:

```
=== ATOMS (13) ===
button, input, label, checkbox, radio-group, switch, slider, 
badge, avatar, separator, skeleton, progress

=== MOLECULES (19) ===
alert, alert-dialog, dialog, sheet, tooltip, popover, hover-card...

=== ORGANISMS (16) ===
card, form, table, data-table, calendar, date-picker...
```

**When to use:** Learning which components go where

---

## Configuration

Open VS Code Settings (`Cmd+,`) and search for "Atomic Shadcn":

### CLI Path
**Setting:** `atomicShadcn.cliPath`
**Default:** `"atomic-shadcn"`

Change this if:
- CLI is not in your PATH
- You want to use a specific version
- CLI is installed locally in project

**Example:**
```json
{
  "atomicShadcn.cliPath": "/usr/local/bin/atomic-shadcn"
}
```

### Show Output Channel
**Setting:** `atomicShadcn.showOutputChannel`
**Default:** `true`

Set to `false` if you don't want the output panel to automatically open when running commands.

---

## Troubleshooting

### Extension Not Working
1. Check CLI is installed: `atomic-shadcn --help`
2. Check VS Code Output panel: "Atomic Shadcn" channel
3. Verify workspace folder is open
4. Check extension is enabled in Extensions panel

### CLI Command Not Found
1. Install CLI globally: `sudo npm link` in CLI directory
2. Verify PATH includes npm global bin: `npm bin -g`
3. Update `atomicShadcn.cliPath` setting with full path

### Commands Not Appearing
1. Reload VS Code: `Developer: Reload Window`
2. Check package.json `contributes.commands` section
3. Look for errors in Output → "Extension Host" channel

### Import Fixing Not Working
The CLI searches these folders for imports:
- `src/`
- `app/`
- `pages/`
- `components/`
- `lib/`
- `utils/`
- `hooks/`
- Root directory files

If imports aren't updating, check:
1. Your files are in one of these folders
2. File extensions are `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
3. Output channel shows files being scanned

---

## Workflow Examples

### Example 1: New Project
```
1. npx shadcn@latest init
2. Cmd+Shift+P → "Atomic Shadcn: Initialize"
3. Cmd+Shift+P → "Atomic Shadcn: Add Component" → button
4. Cmd+Shift+P → "Atomic Shadcn: Add Component" → dialog
5. Start using components with atomic imports!
```

### Example 2: Existing Project with 10 Components
```
1. Cmd+Shift+P → "Atomic Shadcn: Initialize"
2. Cmd+Shift+P → "Atomic Shadcn: Organize Components"
3. Check terminal output for import fixing
4. All imports automatically updated!
```

### Example 3: Trying It Out
```
1. Cmd+Shift+P → "Atomic Shadcn: Initialize"
2. Cmd+Shift+P → "Atomic Shadcn: Add Component" → button
3. Use button in your app
4. Don't like it? Cmd+Shift+P → "Atomic Shadcn: Uninstall"
5. Everything reverted!
```

---

## Keyboard Shortcuts (Optional)

You can add custom keyboard shortcuts in VS Code:

1. `Cmd+K Cmd+S` → Open Keyboard Shortcuts
2. Search for "Atomic Shadcn"
3. Add shortcuts for your most-used commands

**Suggested shortcuts:**
- `Cmd+Shift+A I` → Initialize
- `Cmd+Shift+A A` → Add Component
- `Cmd+Shift+A O` → Organize

---

## Development

### Running Extension in Debug Mode
1. Open extension folder in VS Code
2. Press `F5` or Run → Start Debugging
3. New window opens with extension active
4. Set breakpoints in `src/extension.ts`
5. Open Output → "Atomic Shadcn" to see logs

### Making Changes
1. Edit `src/extension.ts`
2. Press `Cmd+Shift+B` to rebuild
3. In Extension Development Host: `Developer: Reload Window`

### Packaging for Distribution
```bash
npm run package
```
Creates `atomic-shadcn-0.0.1.vsix` file

---

## Tips & Tricks

### 1. Quick Access
Keep the status bar icon visible for fastest access to commands

### 2. Use Output Channel
Check "Atomic Shadcn" output channel to see what's happening

### 3. Terminal Integration
Commands run in a named terminal "Atomic Shadcn" - you can reuse it

### 4. Batch Operations
When organizing many components, the organize command handles them all at once

### 5. Safe Experimentation
Use "Uninstall" to revert changes if you want to try the structure out first

---

## Support

For issues, questions, or contributions:
- GitHub Issues: [atomic-shadcn-extension/issues](https://github.com/deepa/atomic-shadcn-extension/issues)
- CLI Issues: [atomic-shadcn-cli/issues](https://github.com/deepa/atomic-shadcn-cli/issues)

---

## Next Steps

1. ✅ Install CLI globally
2. ✅ Install extension
3. ✅ Open your React project in VS Code
4. ✅ Click status bar icon → Initialize
5. ✅ Start adding components!

Happy coding! 🚀
