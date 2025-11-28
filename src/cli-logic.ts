import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { execSync } from "child_process";

// Component classification mapping based on atomic design
export const ATOMIC_MAP: { [key: string]: string } = {
  // Atoms (Basic UI elements)
  button: "atoms",
  input: "atoms",
  label: "atoms",
  badge: "atoms",
  switch: "atoms",
  checkbox: "atoms",
  "radio-group": "atoms",
  textarea: "atoms",
  progress: "atoms",
  skeleton: "atoms",
  separator: "atoms",
  avatar: "atoms",
  slider: "atoms",
  toggle: "atoms",

  // Molecules (Combined components)
  dialog: "molecules",
  drawer: "molecules",
  calendar: "molecules",
  tabs: "molecules",
  select: "molecules",
  popover: "molecules",
  "dropdown-menu": "molecules",
  "context-menu": "molecules",
  menubar: "molecules",
  tooltip: "molecules",
  "hover-card": "molecules",
  "alert-dialog": "molecules",
  accordion: "molecules",
  collapsible: "molecules",
  "toggle-group": "molecules",
  "date-picker": "molecules",
  form: "molecules",
  alert: "molecules",
  toast: "molecules",
  sonner: "molecules",
  resizable: "molecules",
  command: "molecules",

  // Organisms (Complex structures)
  card: "organisms",
  table: "organisms",
  "data-table": "organisms",
  sheet: "organisms",
  "navigation-menu": "organisms",
  pagination: "organisms",
  breadcrumb: "organisms",
  sidebar: "organisms",
  carousel: "organisms",
  chart: "organisms",
};

// Special components with multiple exports
export const SPECIAL_EXPORTS: { [key: string]: string[] } = {
  dialog: [
    "Dialog",
    "DialogClose",
    "DialogContent",
    "DialogDescription",
    "DialogFooter",
    "DialogHeader",
    "DialogOverlay",
    "DialogPortal",
    "DialogTitle",
    "DialogTrigger",
  ],
  drawer: [
    "Drawer",
    "DrawerPortal",
    "DrawerOverlay",
    "DrawerTrigger",
    "DrawerClose",
    "DrawerContent",
    "DrawerHeader",
    "DrawerFooter",
    "DrawerTitle",
    "DrawerDescription",
  ],
};

export class AtomicShadcnCLI {
  private projectRoot: string;
  private componentsPath: string;
  private outputChannel: vscode.OutputChannel;

  constructor(projectRoot: string, outputChannel: vscode.OutputChannel) {
    this.projectRoot = projectRoot;
    this.componentsPath = path.join(projectRoot, "src", "components");
    this.outputChannel = outputChannel;
  }

  private log(message: string) {
    this.outputChannel.appendLine(message);
    console.log(message);
  }

  // Setup atomic structure in existing project
  setupAtomicStructure(): void {
    this.log("🚀 Setting up atomic structure...");

    const folders = ["atoms", "molecules", "organisms", "ui"];

    folders.forEach((folder) => {
      const folderPath = path.join(this.componentsPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        this.log(`✅ Created ${folder} folder`);
      }

      // Create index.ts files
      const indexPath = path.join(folderPath, "index.ts");
      if (!fs.existsSync(indexPath) || folder !== "ui") {
        const comment = this.getAtomicComment(folder);
        fs.writeFileSync(indexPath, `${comment}\n\n`);
        this.log(`✅ Created ${folder}/index.ts`);
      }
    });

    // Create main components index
    const mainIndexPath = path.join(this.componentsPath, "index.ts");
    if (!fs.existsSync(mainIndexPath)) {
      const mainIndexContent = `// Main components export
export * from './atoms';
export * from './molecules';  
export * from './organisms';
`;
      fs.writeFileSync(mainIndexPath, mainIndexContent);
      this.log("✅ Created main components/index.ts");
    }

    // Create package.json scripts
    this.setupPackageScripts();

    this.log("🎉 Atomic structure setup complete!");
  }

  private getAtomicComment(folder: string): string {
    const comments: { [key: string]: string } = {
      atoms:
        "// Atoms - Basic UI building blocks (buttons, inputs, labels, etc.)",
      molecules:
        "// Molecules - Combined atomic components (form fields, dialogs, dropdowns, etc.)",
      organisms:
        "// Organisms - Complex UI structures (cards, tables, navigation, etc.)",
    };
    return comments[folder] || "";
  }

  private setupPackageScripts(): void {
    const packageJsonPath = path.join(this.projectRoot, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      try {
        execSync('npm pkg set scripts.install-component="atomic-shadcn add"', {
          cwd: this.projectRoot,
        });
        execSync('npm pkg set scripts.organize="atomic-shadcn organize"', {
          cwd: this.projectRoot,
        });
        this.log("✅ Added npm scripts to package.json");
      } catch (error) {
        this.log("⚠️  Could not update package.json scripts automatically");
        this.log("📝 Please add these scripts manually:");
        this.log('  "install-component": "atomic-shadcn add"');
        this.log('  "organize": "atomic-shadcn organize"');
      }
    }
  }

  // Install and organize a component
  async installComponent(componentName: string): Promise<void> {
    this.log(`📦 Installing ${componentName}...`);

    try {
      // Install component using shadcn
      execSync(`npx shadcn@latest add ${componentName}`, {
        stdio: "inherit",
        cwd: this.projectRoot,
      });

      // Organize the component
      this.organizeComponents(componentName);
    } catch (error: any) {
      this.log(`❌ Error installing ${componentName}: ${error.message}`);
      throw error;
    }
  }

  // Organize components from ui folder to atomic folders
  organizeComponents(specificComponent?: string): void {
    const uiPath = path.join(this.componentsPath, "ui");

    this.log(`🔍 Checking ui folder at: ${uiPath}`);

    if (!fs.existsSync(uiPath)) {
      this.log("ℹ️  No ui folder found");
      return;
    }

    let files = fs.readdirSync(uiPath).filter((file) => file.endsWith(".tsx"));

    this.log(
      `📁 Found ${files.length} component file(s) in ui folder: ${files.join(
        ", "
      )}`
    );

    // If specific component provided, only organize that one
    if (specificComponent) {
      files = files.filter(
        (file) => file.replace(".tsx", "") === specificComponent
      );
      this.log(`🎯 Organizing specific component: ${specificComponent}`);
    }

    if (files.length === 0) {
      this.log("ℹ️  No components to organize");
      this.cleanupUIFolder();
      return;
    }

    files.forEach((file) => {
      const componentName = file.replace(".tsx", "");
      const targetFolder = ATOMIC_MAP[componentName] || "molecules"; // Default to molecules

      this.moveComponent(file, componentName, targetFolder);
    });

    // Clean up UI folder after moving all components
    this.cleanupUIFolder();

    // Fix imports in all project files after organizing
    this.log(`\n🔄 Updating imports in project files...`);
    this.fixImportsAfterOrganize();
  }

  private cleanupUIFolder(): void {
    const uiPath = path.join(this.componentsPath, "ui");

    if (!fs.existsSync(uiPath)) {
      this.log("ℹ️  UI folder already removed");
      return;
    }

    try {
      const remaining = fs.readdirSync(uiPath);
      this.log(`📋 Checking ui folder contents: ${remaining.join(", ")}`);

      if (remaining.length === 0) {
        fs.rmdirSync(uiPath);
        this.log("🧹 Removed empty ui folder");
      } else {
        // Check if remaining files are only non-component files
        const componentFiles = remaining.filter((file) =>
          file.endsWith(".tsx")
        );
        if (componentFiles.length === 0) {
          this.log("ℹ️  UI folder contains non-component files, keeping it");
          this.log(`📝 Remaining files: ${remaining.join(", ")}`);
        } else {
          this.log(
            `⚠️  UI folder still contains component files: ${componentFiles.join(
              ", "
            )}`
          );
        }
      }
    } catch (error: any) {
      this.log(`⚠️  Could not remove ui folder: ${error.message}`);
      this.log("💡 You can manually remove it if it's empty");
    }
  }

  private moveComponent(
    file: string,
    componentName: string,
    targetFolder: string
  ): void {
    const sourcePath = path.join(this.componentsPath, "ui", file);
    const targetPath = path.join(this.componentsPath, targetFolder, file);

    this.log(`🚚 Moving: ${sourcePath} → ${targetPath}`);

    // Ensure target folder exists
    const targetFolderPath = path.join(this.componentsPath, targetFolder);
    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, { recursive: true });
      this.log(`📁 Created target folder: ${targetFolder}`);
    }

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      this.log(`⚠️  Source file not found: ${sourcePath}`);
      return;
    }

    // Move the file
    try {
      fs.renameSync(sourcePath, targetPath);
      this.log(`📁 Moved ${componentName} → ${targetFolder}/`);

      // Update exports with special handling for multi-export components
      this.updateExports(targetFolder, componentName);
    } catch (error: any) {
      this.log(`❌ Error moving ${componentName}: ${error.message}`);
    }
  }

  private updateExports(targetFolder: string, componentName: string): void {
    const indexPath = path.join(this.componentsPath, targetFolder, "index.ts");

    // Ensure index file exists
    if (!fs.existsSync(indexPath)) {
      const comment = this.getAtomicComment(targetFolder);
      fs.writeFileSync(indexPath, `${comment}\n\n`);
    }

    let content = fs.readFileSync(indexPath, "utf8");

    // Check if component has special exports (like Dialog, Drawer)
    if (SPECIAL_EXPORTS[componentName]) {
      const exports = SPECIAL_EXPORTS[componentName];
      const exportStatement = `export {\n  ${exports.join(
        ",\n  "
      )},\n} from "./${componentName}";`;

      // Check if exports already exist
      if (!content.includes(`from "./${componentName}"`)) {
        fs.appendFileSync(indexPath, `${exportStatement}\n`);
        this.log(
          `📝 Updated ${targetFolder}/index.ts with special exports for ${componentName}`
        );
      } else {
        this.log(
          `ℹ️  Exports for ${componentName} already exist in ${targetFolder}/index.ts`
        );
      }
    } else {
      // Regular export
      const exportStatement = `export * from './${componentName}';`;
      if (!content.includes(exportStatement)) {
        fs.appendFileSync(indexPath, `${exportStatement}\n`);
        this.log(
          `📝 Updated ${targetFolder}/index.ts exports for ${componentName}`
        );
      } else {
        this.log(
          `ℹ️  Export for ${componentName} already exists in ${targetFolder}/index.ts`
        );
      }
    }
  }

  // Show component mapping
  showMapping(): void {
    this.log("\n📋 Component Classification Mapping:\n");

    this.log("⚛️  ATOMS (Basic Elements):");
    Object.entries(ATOMIC_MAP)
      .filter(([_, folder]) => folder === "atoms")
      .forEach(([component, _]) => this.log(`   • ${component}`));

    this.log("\n🧬 MOLECULES (Combined Components):");
    Object.entries(ATOMIC_MAP)
      .filter(([_, folder]) => folder === "molecules")
      .forEach(([component, _]) => this.log(`   • ${component}`));

    this.log("\n🦠 ORGANISMS (Complex Structures):");
    Object.entries(ATOMIC_MAP)
      .filter(([_, folder]) => folder === "organisms")
      .forEach(([component, _]) => this.log(`   • ${component}`));

    this.log("\n💡 Default: Unknown components → molecules/");
    this.log("\n🔧 Special Multi-Export Components:");
    Object.keys(SPECIAL_EXPORTS).forEach((comp) => {
      this.log(`   • ${comp} → ${SPECIAL_EXPORTS[comp].length} exports`);
    });
  }

  // Debug command to check current state
  debug(): void {
    this.log("🔍 Debug Information:\n");
    this.log(`📍 Working Directory: ${this.projectRoot}`);
    this.log(`📁 Components Path: ${this.componentsPath}`);
    this.log(
      `📂 Components Path Exists: ${fs.existsSync(this.componentsPath)}`
    );

    // Check if we're in the right kind of project
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8")
        );
        this.log(
          `📦 Project Type: ${
            packageJson.dependencies?.react ? "React" : "Non-React"
          }`
        );
        this.log(
          `📦 Has shadcn: ${
            packageJson.dependencies?.["@radix-ui/react-dialog"] ? "Yes" : "No"
          }`
        );
      } catch (e) {
        this.log(`📦 Could not read package.json`);
      }
    }

    const uiPath = path.join(this.componentsPath, "ui");
    this.log(`📂 UI Folder Path: ${uiPath}`);
    this.log(`📂 UI Folder Exists: ${fs.existsSync(uiPath)}`);

    if (fs.existsSync(uiPath)) {
      const files = fs.readdirSync(uiPath);
      this.log(`📋 UI Folder Contents: ${files.join(", ")}`);

      // Show .tsx files specifically
      const tsxFiles = files.filter((f) => f.endsWith(".tsx"));
      this.log(`📄 TSX Components: ${tsxFiles.length} files`);
      tsxFiles.forEach((file) => this.log(`   • ${file}`));
    } else {
      this.log(`❌ UI folder not found!`);

      // Try alternative paths
      const altPaths = [
        path.join(this.projectRoot, "components", "ui"),
        path.join(this.projectRoot, "app", "components", "ui"),
        path.join(this.projectRoot, "lib", "components", "ui"),
      ];

      this.log(`🔍 Checking alternative paths:`);
      altPaths.forEach((altPath) => {
        const exists = fs.existsSync(altPath);
        this.log(`   ${altPath}: ${exists ? "✅" : "❌"}`);
        if (exists) {
          const files = fs
            .readdirSync(altPath)
            .filter((f) => f.endsWith(".tsx"));
          this.log(`     Components: ${files.join(", ")}`);
        }
      });
    }

    ["atoms", "molecules", "organisms"].forEach((folder) => {
      const folderPath = path.join(this.componentsPath, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        this.log(`📁 ${folder}/ contents: ${files.join(", ")}`);
      } else {
        this.log(`📁 ${folder}/ folder: Not found`);
      }
    });
  }

  private fixImportsAfterOrganize(): void {
    const rootPath = this.projectRoot;

    // Check multiple common directories
    const searchPaths: string[] = [];
    const possiblePaths = [
      path.join(rootPath, "src"),
      path.join(rootPath, "app"),
      path.join(rootPath, "pages"),
      path.join(rootPath, "lib"),
      path.join(rootPath, "utils"),
      path.join(rootPath, "hooks"),
      rootPath,
    ];

    possiblePaths.forEach((searchPath) => {
      if (fs.existsSync(searchPath)) {
        searchPaths.push(searchPath);
      }
    });

    if (searchPaths.length === 0) {
      this.log(`   ℹ️  No common folders found`);
      return;
    }

    this.log(
      `   📂 Searching in: ${searchPaths
        .map((p) => path.relative(rootPath, p) || ".")
        .join(", ")}`
    );

    let filesUpdated = 0;
    let filesScanned = 0;

    // Recursively find all .tsx, .ts, .jsx, .js files
    const findFiles = (dir: string, fileList: string[] = []): string[] => {
      if (!fs.existsSync(dir)) {
        return fileList;
      }

      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);

        try {
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            // Skip node_modules, .next, and components folder
            if (
              file !== "node_modules" &&
              file !== ".next" &&
              file !== "components"
            ) {
              findFiles(filePath, fileList);
            }
          } else if (/\.(tsx?|jsx?)$/.test(file)) {
            fileList.push(filePath);
          }
        } catch (error) {
          // Skip files we can't access
        }
      });

      return fileList;
    };

    let allFiles: string[] = [];
    searchPaths.forEach((searchPath) => {
      if (fs.existsSync(searchPath)) {
        allFiles = allFiles.concat(findFiles(searchPath));
      }
    });

    this.log(`   🔍 Scanning ${allFiles.length} files for imports...`);

    allFiles.forEach((filePath) => {
      try {
        let content = fs.readFileSync(filePath, "utf8");
        const originalContent = content;
        filesScanned++;

        // Pattern 1: from "@/components/ui/button" -> "@/components/atoms/button"
        content = content.replace(
          /from\s+["']@\/components\/ui\/([^"']+)["']/g,
          (match, componentName) => {
            const targetFolder = ATOMIC_MAP[componentName] || "molecules";
            return `from "@/components/${targetFolder}/${componentName}"`;
          }
        );

        // Pattern 2: from '../components/ui/button' (relative specific imports)
        content = content.replace(
          /from\s+["'](\.\.\/)+(components\/)?ui\/([^"']+)["']/g,
          (match, dots, comp, componentName) => {
            const targetFolder = ATOMIC_MAP[componentName] || "molecules";
            return `from "@/components/${targetFolder}/${componentName}"`;
          }
        );

        // Pattern 3: from './ui/button' (same-level relative imports)
        content = content.replace(
          /from\s+["']\.\/(ui)\/([^"']+)["']/g,
          (match, ui, componentName) => {
            const targetFolder = ATOMIC_MAP[componentName] || "molecules";
            return `from "@/components/${targetFolder}/${componentName}"`;
          }
        );

        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          filesUpdated++;
          const relativePath = path.relative(this.projectRoot, filePath);
          this.log(`   ✅ Updated imports in ${relativePath}`);
        }
      } catch (error: any) {
        this.log(`   ❌ Error updating ${filePath}: ${error.message}`);
      }
    });

    this.log(`   📊 Scanned ${filesScanned} files`);
    if (filesUpdated === 0) {
      this.log(`   ℹ️  No ui imports found to update`);
      this.log(
        `   💡 Tip: Make sure you're using imports like: import { Button } from "@/components/ui/button"`
      );
    } else {
      this.log(`   ✅ Updated ${filesUpdated} file(s)`);
    }
  }

  // Remove atomic-shadcn CLI scripts from package.json (NOT Radix packages)
  async remove(componentName?: string): Promise<void> {
    if (componentName) {
      // Remove specific component file
      await this.removeComponent(componentName);
    } else {
      // Remove only CLI scripts, not dependencies
      await this.removeCliScripts();
    }
  }

  private async removeComponent(componentName: string): Promise<void> {
    this.log(`🗑️ Removing component: ${componentName}`);

    // Find the component in atomic folders
    const atomicFolders = ["atoms", "molecules", "organisms"];
    let componentFound = false;

    for (const folder of atomicFolders) {
      const folderPath = path.join(this.componentsPath, folder);
      if (fs.existsSync(folderPath)) {
        const componentFile = path.join(folderPath, `${componentName}.tsx`);
        if (fs.existsSync(componentFile)) {
          fs.unlinkSync(componentFile);
          componentFound = true;
          this.log(`   ✅ Removed ${componentName}.tsx from ${folder}/`);
          break;
        }
      }
    }

    // Also check original ui folder
    const originalPath = path.join(this.componentsPath, `${componentName}.tsx`);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
      componentFound = true;
      this.log(`   ✅ Removed ${componentName}.tsx from ui/`);
    }

    if (!componentFound) {
      this.log(`   ❌ Component ${componentName} not found`);
      return;
    }

    // Update index.ts to remove the component export
    await this.updateIndexAfterRemoval(componentName);

    // Uninstall npm dependencies for this component
    await this.uninstallDependencies(componentName);
  }

  private async removeCliScripts(): Promise<void> {
    this.log(`🧹 Removing atomic-shadcn CLI scripts from package.json`);
    this.log(`   ℹ️ NOTE: This will NOT remove Radix UI dependencies`);

    const packageJsonPath = path.join(this.projectRoot, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      this.log(`   ❌ package.json not found`);
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      let scriptsRemoved = 0;

      // Only remove atomic-shadcn related scripts
      if (packageJson.scripts) {
        const atomicShadcnScripts = [
          "install-component",
          "organize",
          "add-component",
          "atomic-init",
          "atomic-add",
          "atomic-organize",
        ];

        atomicShadcnScripts.forEach((script) => {
          if (packageJson.scripts[script]) {
            delete packageJson.scripts[script];
            scriptsRemoved++;
            this.log(`   🗑️ Removed script: ${script}`);
          }
        });
      }

      if (scriptsRemoved > 0) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        this.log(
          `   ✅ Removed ${scriptsRemoved} atomic-shadcn script(s) from package.json`
        );
        this.log(`   ✅ Radix UI dependencies preserved`);
      } else {
        this.log(`   ℹ️ No atomic-shadcn scripts found to remove`);
      }
    } catch (error: any) {
      this.log(`   ❌ Error updating package.json: ${error.message}`);
    }
  }

  private async updateIndexAfterRemoval(componentName: string): Promise<void> {
    const indexPath = path.join(this.componentsPath, "index.ts");

    if (!fs.existsSync(indexPath)) {
      return;
    }

    try {
      let content = fs.readFileSync(indexPath, "utf8");
      const originalContent = content;

      // Remove export lines for this component
      const exportPattern = new RegExp(
        `export\\s*\\{[^}]*\\b${componentName}[^}]*\\}\\s*from\\s*["'][^"']*["'];?\n?`,
        "gi"
      );
      content = content.replace(exportPattern, "");

      // Also remove any direct exports
      const directExportPattern = new RegExp(
        `export\\s*\\*\\s*from\\s*["'][^"']*/${componentName}["'];?\n?`,
        "gi"
      );
      content = content.replace(directExportPattern, "");

      if (content !== originalContent) {
        fs.writeFileSync(indexPath, content);
        this.log(`   ✅ Updated index.ts exports`);
      }
    } catch (error: any) {
      this.log(`   ⚠️ Could not update index.ts: ${error.message}`);
    }
  }

  // Uninstall npm dependencies for a specific component
  private async uninstallDependencies(componentName: string): Promise<void> {
    const dependencyMap: { [key: string]: string[] } = {
      'dialog': ['@radix-ui/react-dialog'],
      'drawer': ['vaul'],
      'calendar': ['react-day-picker', 'date-fns'],
      'select': ['@radix-ui/react-select'],
      'tooltip': ['@radix-ui/react-tooltip'],
      'popover': ['@radix-ui/react-popover'],
      'dropdown-menu': ['@radix-ui/react-dropdown-menu'],
      'context-menu': ['@radix-ui/react-context-menu'],
      'menubar': ['@radix-ui/react-menubar'],
      'toast': ['@radix-ui/react-toast'],
      'tabs': ['@radix-ui/react-tabs'],
      'accordion': ['@radix-ui/react-accordion'],
      'alert-dialog': ['@radix-ui/react-alert-dialog'],
      'hover-card': ['@radix-ui/react-hover-card'],
      'navigation-menu': ['@radix-ui/react-navigation-menu'],
      'progress': ['@radix-ui/react-progress'],
      'radio-group': ['@radix-ui/react-radio-group'],
      'slider': ['@radix-ui/react-slider'],
      'switch': ['@radix-ui/react-switch'],
      'checkbox': ['@radix-ui/react-checkbox'],
      'separator': ['@radix-ui/react-separator'],
      'collapsible': ['@radix-ui/react-collapsible'],
      'toggle': ['@radix-ui/react-toggle'],
      'toggle-group': ['@radix-ui/react-toggle-group'],
      'avatar': ['@radix-ui/react-avatar'],
      'carousel': ['embla-carousel-react'],
      'chart': ['recharts'],
      'sonner': ['sonner'],
      'form': ['react-hook-form', '@hookform/resolvers', 'zod'],
      'date-picker': ['react-day-picker', 'date-fns']
    };

    const deps = dependencyMap[componentName];

    if (deps && deps.length > 0) {
      this.log(`\n📦 Uninstalling dependencies for ${componentName}...`);
      this.log(`   Packages: ${deps.join(', ')}`);

      try {
        const { execSync } = require('child_process');
        const depsString = deps.join(' ');
        
        execSync(`npm uninstall ${depsString}`, {
          cwd: this.projectRoot,
          stdio: 'pipe'
        });

        this.log(`✅ Dependencies removed from package.json`);
        this.log(`⚠️  Note: Check if other components use these packages!`);

      } catch (error: any) {
        this.log(`❌ Error uninstalling dependencies: ${error.message}`);
        this.log(`💡 Manual removal: npm uninstall ${deps.join(' ')}`);
      }
    } else {
      this.log(`\n📦 No specific dependencies to uninstall for ${componentName}`);
    }
  }

  // Complete uninstall - move components back and remove atomic structure
  async uninstall(): Promise<void> {
    this.log(`🔄 Uninstalling atomic structure...`);
    this.log(`⚠️  This will:`);
    this.log(`   • Move all components from atoms/molecules/organisms back to ui/`);
    this.log(`   • Delete atomic folder structure`);
    this.log(`   • Revert to original shadcn/ui setup`);

    const uiPath = path.join(this.componentsPath, "ui");
    
    // Create ui folder if it doesn't exist
    if (!fs.existsSync(uiPath)) {
      fs.mkdirSync(uiPath, { recursive: true });
      this.log(`📁 Created ui/ folder`);
    }

    const atomicFolders = ["atoms", "molecules", "organisms"];
    let componentsMovedBack = 0;

    // Move all components back to ui/ folder
    atomicFolders.forEach(folder => {
      const folderPath = path.join(this.componentsPath, folder);
      
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        
        files.forEach(file => {
          // Only move .tsx files (not index.ts)
          if (file.endsWith('.tsx')) {
            const sourcePath = path.join(folderPath, file);
            const destPath = path.join(uiPath, file);
            
            try {
              // Check if file already exists in ui/
              if (fs.existsSync(destPath)) {
                this.log(`⚠️  Skipped ${file} (already exists in ui/)`);
              } else {
                fs.copyFileSync(sourcePath, destPath);
                this.log(`📦 Moved ${folder}/${file} → ui/${file}`);
                componentsMovedBack++;
              }
            } catch (error: any) {
              this.log(`❌ Error moving ${file}: ${error.message}`);
            }
          }
        });
      }
    });

    // Delete atomic folders
    this.log(`\n🗑️  Removing atomic folders...`);
    atomicFolders.forEach(folder => {
      const folderPath = path.join(this.componentsPath, folder);
      
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true, force: true });
          this.log(`✅ Deleted ${folder}/`);
        } catch (error: any) {
          this.log(`❌ Error deleting ${folder}/: ${error.message}`);
        }
      }
    });

    // Remove CLI scripts from package.json
    await this.removeCliScripts();
    
    // Fix imports in all project files
    this.log(`\n🔄 Updating imports in project files...`);
    this.fixImportsAfterUninstall();
    
    this.log(`\n✅ Atomic structure uninstalled successfully!`);
    this.log(`📊 Summary:`);
    this.log(`   • ${componentsMovedBack} components moved back to ui/`);
    this.log(`   • ${atomicFolders.length} atomic folders removed`);
    this.log(`   • package.json scripts cleaned`);
    this.log(`   • Import statements updated`);
    this.log(`\n💡 Your project is back to original shadcn/ui structure`);
    this.log(`   Import components like: import { Button } from '@/components/ui/button'`);
  }

  private async generateOriginalIndex(): Promise<void> {
    const indexPath = path.join(this.componentsPath, "index.ts");

    // Get all component files in ui/ folder
    const componentFiles = fs
      .readdirSync(this.componentsPath)
      .filter(
        (file) =>
          (file.endsWith(".tsx") || file.endsWith(".ts")) && file !== "index.ts"
      )
      .sort();

    let indexContent = "// Component exports\n";

    for (const file of componentFiles) {
      const componentName = path.basename(file, path.extname(file));
      const filePath = path.join(this.componentsPath, file);

      try {
        const content = fs.readFileSync(filePath, "utf8");
        // Try to extract exports, fallback to simple export
        indexContent += `export * from "./${componentName}";\n`;
      } catch (error) {
        // If we can't read the file, use a simple export
        indexContent += `export * from "./${componentName}";\n`;
      }
    }

    fs.writeFileSync(indexPath, indexContent);
    this.log(`   ✅ Restored original index.ts`);
  }

  // Fix imports after uninstall - convert atomic imports back to ui imports
  private fixImportsAfterUninstall(): void {
    const rootPath = this.projectRoot;
    
    // Check multiple common directories
    const searchPaths: string[] = [];
    const possiblePaths = [
      path.join(rootPath, "src"),
      path.join(rootPath, "app"),
      path.join(rootPath, "pages"),
      path.join(rootPath, "lib"),
      path.join(rootPath, "utils"),
      path.join(rootPath, "hooks"),
      rootPath,
    ];
    
    possiblePaths.forEach((searchPath) => {
      if (fs.existsSync(searchPath)) {
        searchPaths.push(searchPath);
      }
    });
    
    if (searchPaths.length === 0) {
      this.log(`   ℹ️  No common folders found`);
      return;
    }

    this.log(`   📂 Searching in: ${searchPaths.map(p => path.relative(rootPath, p) || ".").join(", ")}`);

    let filesUpdated = 0;
    let filesScanned = 0;

    // Recursively find all .tsx, .ts, .jsx, .js files
    const findFiles = (dir: string, fileList: string[] = []): string[] => {
      if (!fs.existsSync(dir)) {return fileList;}
      
      try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          
          try {
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
              // Skip certain folders but search others
              const skipFolders = ['node_modules', '.next', '.git', 'dist', 'build'];
              if (!skipFolders.includes(file)) {
                findFiles(filePath, fileList);
              }
            } else if (/\.(tsx?|jsx?)$/.test(file)) {
              fileList.push(filePath);
            }
          } catch (error) {
            // Skip files we can't access
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
      
      return fileList;
    };

    let allFiles: string[] = [];
    searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        allFiles = allFiles.concat(findFiles(searchPath));
      }
    });
    
    this.log(`   🔍 Scanning ${allFiles.length} files for imports...`);
    
    allFiles.forEach(filePath => {
      try {
        let content = fs.readFileSync(filePath, "utf8");
        const originalContent = content;
        filesScanned++;
        
        // Pattern 1: from "@/components/atoms/button" -> "@/components/ui/button"
        content = content.replace(
          /from\s+["']@\/components\/(atoms|molecules|organisms)\/([^"']+)["']/g,
          (match, folder, component) => {
            return `from "@/components/ui/${component}"`;
          }
        );
        
        // Pattern 2: from "@/components/atoms" -> "@/components/ui"
        content = content.replace(
          /from\s+["']@\/components\/(atoms|molecules|organisms)["']/g,
          (match, folder) => {
            return `from "@/components/ui"`;
          }
        );
        
        // Pattern 3: from '../components/atoms/button' (relative)
        content = content.replace(
          /from\s+["'](\.\.\/)+(components\/)?(atoms|molecules|organisms)\/([^"']+)["']/g,
          (match, dots, comp, folder, component) => {
            return `from "@/components/ui/${component}"`;
          }
        );
        
        // Pattern 4: from './atoms/button' (same-level)
        content = content.replace(
          /from\s+["']\.\/(atoms|molecules|organisms)\/([^"']+)["']/g,
          (match, folder, component) => {
            return `from "@/components/ui/${component}"`;
          }
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          filesUpdated++;
          const relativePath = path.relative(this.projectRoot, filePath);
          this.log(`   ✅ Updated imports in ${relativePath}`);
        }
      } catch (error: any) {
        this.log(`   ❌ Error updating ${filePath}: ${error.message}`);
      }
    });
    
    this.log(`   📊 Scanned ${filesScanned} files`);
    if (filesUpdated === 0) {
      this.log(`   ℹ️  No atomic imports found to update`);
    } else {
      this.log(`   ✅ Updated ${filesUpdated} file(s)`);
    }
  }
}
