import * as vscode from "vscode";
import { AtomicShadcnCLI } from "./cli-logic";

// Output channel for extension logs
let outputChannel: vscode.OutputChannel;

// Status bar item
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log("Atomic Shadcn extension is now active!");

  // Create output channel
  outputChannel = vscode.window.createOutputChannel("Atomic Shadcn");
  context.subscriptions.push(outputChannel);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "$(package) Atomic Shadcn";
  statusBarItem.tooltip = "Click to open Atomic Shadcn commands";
  statusBarItem.command = "atomic-shadcn.showMenu";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register all commands
  context.subscriptions.push(
    vscode.commands.registerCommand("atomic-shadcn.init", initCommand),
    vscode.commands.registerCommand("atomic-shadcn.add", addCommand),
    vscode.commands.registerCommand("atomic-shadcn.organize", organizeCommand),
    vscode.commands.registerCommand("atomic-shadcn.remove", removeCommand),
    vscode.commands.registerCommand(
      "atomic-shadcn.uninstall",
      uninstallCommand
    ),
    vscode.commands.registerCommand("atomic-shadcn.mapping", mappingCommand),
    vscode.commands.registerCommand("atomic-shadcn.debug", debugCommand),
    vscode.commands.registerCommand("atomic-shadcn.showMenu", showQuickMenu)
  );
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

// Helper function to get workspace root
function getWorkspaceRoot(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder open");
    return undefined;
  }
  return workspaceFolders[0].uri.fsPath;
}

// Helper function to get CLI instance
function getCLI(): AtomicShadcnCLI | null {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return null;
  }
  return new AtomicShadcnCLI(workspaceRoot, outputChannel);
}

// Helper function to show output channel if enabled
function showOutputIfEnabled() {
  const config = vscode.workspace.getConfiguration("atomicShadcn");
  const shouldShow = config.get("showOutputChannel", true);
  if (shouldShow) {
    outputChannel.show(true);
  }
}

// Helper function to run CLI command using embedded logic
async function runCLICommand(
  command: string,
  args: string[] = []
): Promise<void> {
  const cli = getCLI();
  if (!cli) {
    vscode.window.showErrorMessage("No workspace folder open");
    return;
  }

  outputChannel.appendLine(`\n> atomic-shadcn ${command} ${args.join(" ")}`);
  showOutputIfEnabled();

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Atomic Shadcn: ${command}`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: "Running command..." });

      try {
        switch (command) {
          case "init":
            cli.setupAtomicStructure();
            break;

          case "add":
            if (args.length > 0) {
              await cli.installComponent(args[0]);
            } else {
              throw new Error("Component name is required for add command");
            }
            break;

          case "organize":
            cli.organizeComponents(args[0]);
            break;

          case "mapping":
            cli.showMapping();
            break;

          case "debug":
            cli.debug();
            break;

          case "remove":
            if (args.length > 0) {
              await cli.remove(args[0]);
            } else {
              await cli.remove();
            }
            break;

          case "uninstall":
            if (args.length > 0) {
              await cli.uninstallComponent(args[0]);
            } else {
              await cli.uninstall();
            }
            break;

          default:
            throw new Error(`Unknown command: ${command}`);
        }

        vscode.window.showInformationMessage(
          `Atomic Shadcn: ${command} completed successfully!`
        );
      } catch (error: any) {
        const errorMessage = `Failed to run ${command}: ${error.message}`;
        outputChannel.appendLine(`ERROR: ${errorMessage}`);
        vscode.window.showErrorMessage(errorMessage);
        throw error;
      }
    }
  );
}

// Command: Initialize atomic structure
async function initCommand() {
  outputChannel.appendLine("\n=== Initialize Atomic Structure ===");
  await runCLICommand("init");
}

// Command: Add component
async function addCommand() {
  const componentName = await vscode.window.showInputBox({
    prompt: "Enter component name (e.g., button, dialog, card)",
    placeHolder: "button",
    validateInput: (value) => {
      if (!value || value.trim().length === 0) {
        return "Component name is required";
      }
      return null;
    },
  });

  if (componentName) {
    outputChannel.appendLine("\n=== Add Component ===");
    await runCLICommand("add", [componentName.trim()]);
  }
}

// Command: Organize existing components
async function organizeCommand() {
  const confirm = await vscode.window.showWarningMessage(
    "This will organize all components in components/ui/ into atomic folders. Continue?",
    "Yes",
    "No"
  );

  if (confirm === "Yes") {
    outputChannel.appendLine("\n=== Organize Components ===");
    await runCLICommand("organize");
  }
}

// Command: Remove all packages
async function removeCommand() {
  const options = await vscode.window.showQuickPick(
    [
      {
        label: "Remove all packages",
        description:
          "Uninstalls all @radix-ui packages but keeps component files and atomic structure",
        command: "remove",
      },
      {
        label: "Remove specific component",
        description: "Remove a single component file from atomic structure",
        command: "remove-component",
      },
    ],
    {
      placeHolder: "Choose removal option",
    }
  );

  if (!options) {
    return;
  }

  if (options.command === "remove-component") {
    const componentName = await vscode.window.showInputBox({
      prompt: "Enter component name to remove (e.g., button)",
      placeHolder: "button",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Component name is required";
        }
        return null;
      },
    });

    if (componentName) {
      outputChannel.appendLine("\n=== Remove Component ===");
      await runCLICommand("remove", [componentName.trim()]);
    }
  } else {
    const confirm = await vscode.window.showWarningMessage(
      "This will remove atomic-shadcn CLI scripts from package.json (Radix UI dependencies will be preserved). Continue?",
      "Yes",
      "No"
    );

    if (confirm === "Yes") {
      outputChannel.appendLine("\n=== Remove CLI Scripts ===");
      await runCLICommand("remove");
    }
  }
}

// Command: Complete uninstall
async function uninstallCommand() {
  const options = await vscode.window.showQuickPick(
    [
      {
        label: "Complete uninstall",
        description:
          "Move all components back to components/ui/ and delete atomic folders",
        command: "uninstall",
      },
      {
        label: "Uninstall specific component",
        description: "Move a single component back to components/ui/",
        command: "uninstall-component",
      },
    ],
    {
      placeHolder: "Choose uninstall option",
    }
  );

  if (!options) {
    return;
  }

  if (options.command === "uninstall-component") {
    const componentName = await vscode.window.showInputBox({
      prompt: "Enter component name to uninstall (e.g., button)",
      placeHolder: "button",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Component name is required";
        }
        return null;
      },
    });

    if (componentName) {
      outputChannel.appendLine("\n=== Uninstall Component ===");
      await runCLICommand("uninstall", [componentName.trim()]);
    }
  } else {
    const confirm = await vscode.window.showWarningMessage(
      "This will revert the entire atomic structure back to components/ui/. Continue?",
      { modal: true },
      "Yes",
      "No"
    );

    if (confirm === "Yes") {
      outputChannel.appendLine("\n=== Complete Uninstall ===");
      await runCLICommand("uninstall");
    }
  }
}

// Command: Show component mapping
async function mappingCommand() {
  outputChannel.appendLine("\n=== Component Mapping ===");
  await runCLICommand("mapping");
  outputChannel.show();
}

// Command: Debug information
async function debugCommand() {
  outputChannel.appendLine("\n=== Debug Information ===");
  await runCLICommand("debug");
  outputChannel.show();
}

// Command: Show quick menu
async function showQuickMenu() {
  const options = await vscode.window.showQuickPick(
    [
      {
        label: "$(database) Initialize",
        description: "Create atomic structure folders",
        command: "init",
      },
      {
        label: "$(add) Add Component",
        description: "Install and organize a shadcn component",
        command: "add",
      },
      {
        label: "$(folder) Organize",
        description: "Organize existing components into atomic folders",
        command: "organize",
      },
      {
        label: "$(trash) Remove Packages",
        description: "Uninstall @radix-ui packages (keep files)",
        command: "remove",
      },
      {
        label: "$(close-all) Complete Uninstall",
        description: "Revert to components/ui/ structure",
        command: "uninstall",
      },
      {
        label: "$(list-tree) Show Mapping",
        description: "Display component classification",
        command: "mapping",
      },
      {
        label: "$(bug) Debug Info",
        description: "Show debug information and project state",
        command: "debug",
      },
    ],
    {
      placeHolder: "Select an Atomic Shadcn command",
    }
  );

  if (options) {
    switch (options.command) {
      case "init":
        await initCommand();
        break;
      case "add":
        await addCommand();
        break;
      case "organize":
        await organizeCommand();
        break;
      case "remove":
        await removeCommand();
        break;
      case "uninstall":
        await uninstallCommand();
        break;
      case "mapping":
        await mappingCommand();
        break;
      case "debug":
        await debugCommand();
        break;
    }
  }
}
