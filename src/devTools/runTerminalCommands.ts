import { exec } from "child_process";
import { WebSocket, WebSocketServer } from "ws";
import { killtree } from "./killProcess";
import { getRootDir } from "../utils/file";
/** Make this work properly with the remix dev tools so it executes, closes and runs processes */
const executeCommand = async (command: string, socket: WebSocket, terminalId: number, wss: WebSocketServer) => {
  const workspacePath = await getRootDir();
  const process = exec(command, { cwd: workspacePath?.fsPath, env: { FORCE_COLOR: "true" } });

  process.on("spawn", () => {
    socket.send(
      JSON.stringify({
        type: "terminal_command",
        terminalId,
        processId: process.pid,
      }),
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
      }),
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

  wss.on("close", async () => {
    try {
      if (process.pid) {
        await killtree(process.pid);
      }
    } catch (err) {
      /* console.log(err); */
    }
  });
};
export const runTerminalCommands = async (
  socket: WebSocket,
  command: string,
  terminalId: number,
  wss: WebSocketServer,
) => {
  await executeCommand(command, socket, terminalId, wss);
};
