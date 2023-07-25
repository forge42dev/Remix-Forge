import { exec } from "child_process";
import { getWorkspacePath } from "../utils/vscode";
import { WebSocket, WebSocketServer } from "ws";
/** Make this work properly with the remix dev tools so it executes, closes and runs processes */
const executeCommand = (command: string, socket: WebSocket, terminalId: number, wss: WebSocketServer) => {
  const process = exec(command, { cwd: getWorkspacePath(), env: { FORCE_COLOR: "true" } });

  process.on("spawn", () => {
    socket.send(
      JSON.stringify({
        type: "terminal_command",
        terminalId,
        processId: process.pid,
      })
    );
  });
  process.on("error", (error) => {
    socket.send(JSON.stringify({ type: "terminal_command", subtype: "ERROR", terminalId, data: error.message }));
  });
  process?.stdout?.on("data", (data) => {
    socket.send(
      JSON.stringify({
        type: "terminal_command",
        subtype: "DATA",
        terminalId,
        data: data.toString(),
      })
    );
  });

  process?.stderr?.on("data", (data) => {
    socket.send(JSON.stringify({ type: "terminal_command", subtype: "ERROR", terminalId, data: data.toString() }));
  });
  process?.stdout?.on("error", (error) => {
    socket.send(JSON.stringify({ type: "terminal_command", subtype: "ERROR", terminalId, data: error.message }));
  });
  process.on("close", (code) => {
    socket.send(JSON.stringify({ type: "terminal_command", subtype: "CLOSE", terminalId, data: code?.toString() }));
  });
  process.on("exit", (code) => {
    socket.send(JSON.stringify({ type: "terminal_command", subtype: "EXIT", terminalId, data: code?.toString() }));
  });

  wss.on("close", () => {
    process.kill();
  });
};
export const runTerminalCommands = async (
  socket: WebSocket,
  command: string,
  terminalId: number,
  wss: WebSocketServer
) => {
  executeCommand(command, socket, terminalId, wss);
};
