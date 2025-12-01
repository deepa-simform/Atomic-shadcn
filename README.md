# Atomic Shadcn

> Organize [shadcn/ui](https://ui.shadcn.com/) components using atomic design principles

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/deepa-simform/Adomic-shadcn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A VS Code extension that helps you organize shadcn/ui components into **atoms**, **molecules**, and **organisms** following atomic design principles.

![Demo](docs/demo.gif)

## ✨ Features

- 🎯 **Atomic Organization** - Automatically categorize components
- 📦 **Smart Installation** - Install components with auto dependency injection
- 🔄 **Auto Import Fixing** - Updates all imports automatically across your project
- 🗑️ **Component Removal** - Remove specific components with dependency cleanup
- 🔙 **Component Uninstall** - Move components back to ui/ folder
- 📊 **Component Mapping** - Visual component classification
- 🚀 **Multiple Access** - Status bar, command palette, context menus
- ✅ **Package.json Updates** - Automatic dependency management
- 🔧 **NPM Install** - Automatic installation of required packages

## 📦 Installation

### For Your Team

1. **Download:** [atomic-shadcn-0.0.1.vsix](https://github.com/deepa-simform/Adomic-shadcn/releases/download/v0.0.1/atomic-shadcn-0.0.1.vsix)
2. **Install in VS Code:**
   - Open Extensions (`Cmd+Shift+X`)
   - Click `...` → Install from VSIX
   - Select the downloaded file
3. **Reload VS Code**

**Or visit:** [Releases Page](https://github.com/deepa-simform/Adomic-shadcn/releases/latest)

### Requirements

- VS Code 1.85.0 or higher
- Node.js and npm installed
- A project with shadcn/ui configured

## 🚀 Quick Start

1. **Open your project** with shadcn/ui
2. **Click "Atomic Shadcn"** in status bar (bottom right)
3. **Select "Initialize"** - creates atomic folders
4. **Select "Add Component"** - installs and organizes
5. **Done!** Components are organized atomically

## 📖 Usage

### Status Bar (Fastest)
Click **"Atomic Shadcn"** in the status bar → Select command from menu

### Command Palette
Press `Cmd+Shift+P` → Type "Atomic Shadcn" → Select command

### Available Commands

| Command | Description |
|---------|-------------|
| **Initialize** | Create atoms/, molecules/, organisms/ folders |
| **Add Component** | Install shadcn component and organize |
| **Organize** | Move existing ui/ components to atomic folders |
| **Remove Packages** | Uninstall npm packages, keep files |
| **Uninstall** | Revert to standard ui/ structure |
| **Show Mapping** | Display component classification |

## 📂 Component Organization

### Atoms (Basic Building Blocks)
`button`, `input`, `label`, `checkbox`, `switch`, `badge`, `avatar`, `separator`

### Molecules (Simple Combinations)
`alert`, `dialog`, `sheet`, `tooltip`, `popover`, `dropdown-menu`, `select`, `tabs`

### Organisms (Complex Components)
`card`, `form`, `table`, `calendar`, `navigation-menu`, `breadcrumb`, `sidebar`

## 🛠️ Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch

# Package
npm run package

# Debug
Press F5 in VS Code
```

## 📚 Documentation

- **[Team Installation Guide](docs/TEAM_INSTALLATION.md)** - Share with your team
- **[User Guide](docs/USER_GUIDE.md)** - Detailed usage instructions
- **[Development Guide](docs/DEVELOPMENT_SUMMARY.md)** - Architecture & code docs
- **[Publishing Guide](docs/PUBLISHING_GUIDE.md)** - Marketplace publishing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Credits

Built with [atomic-shadcn-cli](https://github.com/deepa/atomic-shadcn-cli) and [shadcn/ui](https://ui.shadcn.com/)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/deepa/atomic-shadcn-extension/issues)
- **Questions**: Contact your team lead

---

Made with ❤️ for better component organization

## Extension Settings

This extension contributes the following settings:

- `atomicShadcn.cliPath`: Path to the atomic-shadcn CLI (default: `"atomic-shadcn"` for global installation)
- `atomicShadcn.showOutputChannel`: Show output channel when running commands (default: `true`)

## Component Classification

Components are organized into three categories:

### Atoms (Basic Building Blocks)
button, input, label, checkbox, radio-group, switch, slider, badge, avatar, separator, skeleton, progress

### Molecules (Simple Combinations)
alert, alert-dialog, dialog, sheet, tooltip, popover, hover-card, dropdown-menu, menubar, context-menu, select, combobox, command, toggle, toggle-group, aspect-ratio, collapsible, accordion, tabs

### Organisms (Complex Components)
card, form, table, data-table, calendar, date-picker, carousel, navigation-menu, pagination, breadcrumb, toast, sonner, drawer, resizable, scroll-area, sidebar, chart, input-otp

## Workflow Examples

### Starting a New Project
1. Initialize shadcn: `npx shadcn@latest init`
2. Run **Atomic Shadcn: Initialize** to create atomic folders
3. Run **Atomic Shadcn: Add Component** to install components atomically

### Organizing Existing Project
1. Run **Atomic Shadcn: Initialize** to create atomic structure
2. Run **Atomic Shadcn: Organize Components** to move ui/ files
3. Check imports - they're automatically updated!

### Removing Components
- **Remove Packages**: Uninstalls @radix-ui packages but keeps component files and structure
- **Complete Uninstall**: Moves everything back to ui/, deletes atomic folders, fixes all imports

## Known Issues

- Extension requires atomic-shadcn CLI to be installed globally
- Terminal output may not show real-time progress for long-running commands
- Context menu items appear on all folders (filtering in progress)

## Release Notes

### 1.0.0 (Major Release)
- ✨ **Automatic Dependency Injection** - Components now auto-add required dependencies to package.json
- 📦 **NPM Install Integration** - Automatic npm install after adding components
- 🗑️ **Enhanced Component Removal** - Remove specific components with full cleanup (files, exports, imports, dependencies)
- 🔙 **Component Uninstall** - Move individual components back to ui/ folder with import updates
- ✅ **Export Management** - Automatic export updates in all index files
- 🔄 **Comprehensive Import Fixing** - Updates imports across entire project for all operations
- 📝 **Detailed Logging** - Enhanced output with verification steps
- 🐛 **Bug Fixes** - Fixed various issues with package.json updates and import handling

### 0.0.1 (Initial Release)
- Command palette integration for all CLI commands
- Status bar quick menu
- Context menu support
- Output channel for command logs
- Progress notifications
- Configuration settings
- Automatic import fixing
- Component classification mapping

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Package extension
npm run package

# Run extension in debug mode
Press F5 in VS Code
```

## Contributing

Issues and pull requests are welcome! Please see the [contributing guidelines](CONTRIBUTING.md).

## License

MIT

## Credits

Built on top of [atomic-shadcn-cli](https://github.com/deepa/atomic-shadcn-cli) and [shadcn/ui](https://ui.shadcn.com/).

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
