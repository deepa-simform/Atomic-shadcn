import * as vscode from "vscode";

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

// Helper function to get CLI path from settings
function getCLIPath(): string {
  const config = vscode.workspace.getConfiguration("atomicShadcn");
  return config.get("cliPath", "atomic-shadcn");
}

// Helper function to show output channel if enabled
function showOutputIfEnabled() {
  const config = vscode.workspace.getConfiguration("atomicShadcn");
  const shouldShow = config.get("showOutputChannel", true);
  if (shouldShow) {
    outputChannel.show(true);
  }
}

// Helper function to run CLI command
async function runCLICommand(
  command: string,
  args: string[] = []
): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return;
  }

  const cliPath = getCLIPath();
  const fullCommand = `${cliPath} ${command} ${args.join(" ")}`;

  outputChannel.appendLine(`\n> ${fullCommand}`);
  showOutputIfEnabled();

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Atomic Shadcn: ${command}`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: "Running command..." });

      // Create terminal and run command
      const terminal = vscode.window.createTerminal({
        name: "Atomic Shadcn",
        cwd: workspaceRoot,
      });
      terminal.show();
      terminal.sendText(fullCommand);

      // Log to output channel
      outputChannel.appendLine(
        `Command executed in terminal: ${terminal.name}`
      );

      return new Promise<void>((resolve) => {
        // Wait a bit for command to start
        setTimeout(() => {
          vscode.window.showInformationMessage(
            `Atomic Shadcn: ${command} command sent to terminal`
          );
          resolve();
        }, 1000);
      });
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
      "This will uninstall all @radix-ui packages. Component files will remain. Continue?",
      "Yes",
      "No"
    );

    if (confirm === "Yes") {
      outputChannel.appendLine("\n=== Remove All Packages ===");
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
    }
  }
}
