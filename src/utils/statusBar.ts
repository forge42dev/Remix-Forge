import * as vscode from "vscode";
import { generateCommand } from "./vscode";

export const createStatusBar = () => {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(play) Remix Dev Tools";
  statusBarItem.tooltip = "Click to start Remix Dev Tools";
  statusBarItem.command = generateCommand("devTools"); // Command to be executed when the button is clicked
  // Simulating a state change (e.g., button is running)

  return statusBarItem;
};

export const setStatusBarToRunning = (statusBarItem: vscode.StatusBarItem) => {
  statusBarItem.text = "$(stop) Remix Dev Tools";
  statusBarItem.tooltip = "Click to stop Remix Dev Tools";
};

export const setStatusBarToStopped = (statusBarItem: vscode.StatusBarItem) => {
  statusBarItem.text = "$(play) Remix Dev Tools";
  statusBarItem.tooltip = "Click to start Remix Dev Tools";
};
