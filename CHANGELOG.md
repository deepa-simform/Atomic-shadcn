# Change Log

All notable changes to the Atomic Shadcn extension will be documented in this file.

## [0.0.1] - 2024-01-XX

### Added
- Initial release of Atomic Shadcn VS Code extension
- Command palette integration for all CLI commands
- Status bar quick menu with icon
- Context menu support for Explorer
- Output channel for command logs
- Progress notifications for long-running operations
- Configuration settings for CLI path and output preferences
- Six core commands:
  - **Initialize**: Create atomic structure folders
  - **Add Component**: Install and organize shadcn components
  - **Organize Components**: Move ui/ files to atomic folders
  - **Remove All Packages**: Uninstall @radix-ui packages
  - **Uninstall**: Revert to standard ui/ structure
  - **Show Component Mapping**: Display component classification
- Automatic import fixing across project files
- Terminal integration for running CLI commands
- Quick pick menus for component selection
- Comprehensive documentation and usage guide

### Features
- 🎯 Atomic design organization (atoms, molecules, organisms)
- 📦 One-command component installation
- 🔄 Automatic import updates
- 🗑️ Two-way removal system
- 📊 Component mapping visualization
- 🚀 Multiple access methods (palette, status bar, context menu)
- 📝 Real-time output logging

### Requirements
- atomic-shadcn CLI installed globally
- Node.js 14+
- shadcn/ui initialized project

## [Unreleased]

### Planned
- Support for custom component mappings
- Workspace-level configuration
- Component templates
- Batch component installation
- Migration wizard for existing projects
- Extension marketplace publication