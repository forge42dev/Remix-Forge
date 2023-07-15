import { exec } from "child_process";
import { getWorkspacePath } from "../utils/vscode";
import { WebSocket } from "ws";
/** Make this work properly with the remix dev tools so it executes, closes and runs processes */
const executeCommand = (command: string, socket: WebSocket) => {
  const process = exec(command, { cwd: getWorkspacePath() });
  process.on("error", (error) => {
    console.log("error", error);
    socket.send(JSON.stringify({ type: "terminal_command", data: error.message }));
  });
  process?.stdout?.on("data", (data) => {
    console.log("data", data);
    socket.send(JSON.stringify({ type: "terminal_command", data: data.toString() }));
  });
  process.on("close", (code) => {
    socket.send(JSON.stringify({ type: "terminal_command", data: code?.toString() }));
    console.log("close", code);
  });
  process.on("exit", (code) => {
    socket.send(JSON.stringify({ type: "terminal_command", data: code?.toString() }));
    console.log("exit", code);
  });
  socket.on("close", () => {
    process.kill();
  });
};
export const runTerminalCommands = async (socket: WebSocket, command: string) => {
  executeCommand(command, socket);
};
