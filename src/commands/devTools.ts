import { Server } from "ws";
import type { MessageEvent, WebSocket } from "ws";
import { getProjectCommands } from "../devTools/getProjectCommands";
import { runTerminalCommands } from "../devTools/runTerminalCommands";
import {
  getRemixRootFromFileUri,
  isRemixDir,
  isTSConfigExists,
  openFileInEditor,
  tryReadFile,
  tryReadFilePath,
} from "../utils/file";
import { getWorkspaceUri, joinPath } from "../utils/vscode";
import * as vscode from "vscode";
import { setStatusBarToRunning, setStatusBarToStopped } from "../utils/statusBar";
import { generateRouteFile } from "./generateRouteFile";
import { GeneratorOption } from "../generators";
import { getConfig } from "../config";
import { killtree } from "../devTools/killProcess";

let wss: Server | undefined;
// Create a WebSocket server
const WebSocketServer = Server;

export const startDevTools = async (statusBarItem: vscode.StatusBarItem) => {
  if (wss) {
    wss.clients.forEach((client) => {
      client.close();
    });
    wss.close();
    wss = undefined;
    return setStatusBarToStopped(statusBarItem);
  }
  const config = getConfig();
  const port = config.get<number>("devToolsPort");
  wss = new WebSocketServer({ port: port || 3003 });
  setStatusBarToRunning(statusBarItem);

  const workspaceUri = getWorkspaceUri();
  if (!workspaceUri) {
    return;
  }
  let rootDir = workspaceUri;

  if (!(await isRemixDir(rootDir))) {
    const currentFile = vscode.window.activeTextEditor?.document.uri;

    if (!currentFile) {
      return;
    }
    const remixDir = await getRemixRootFromFileUri(currentFile);
    if (!remixDir) {
      return;
    }
    rootDir = remixDir;
  }

  const isTS = await isTSConfigExists(rootDir);

  // Handle WebSocket connection
  wss.on("connection", (socket: WebSocket) => {
    // Handle messages received from the React app
    socket.onmessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data.toString());

      if (message.type === "plugin") {
        if (message.subtype === "read_file") {
          const file = await tryReadFile(joinPath(rootDir, message.path).path);
          if (file) {
            return socket.send(JSON.stringify({ type: "plugin", subtype: "read_file", error: false, data: file }));
          }
          socket.send(JSON.stringify({ type: "plugin", subtype: "read_file", error: true, data: "File not found" }));
        }
        if (message.subtype === "open_file") {
          try {
            await openFileInEditor(joinPath(rootDir, message.path).path);
            socket.send(JSON.stringify({ type: "plugin", subtype: "open_file", error: false, data: "success" }));
          } catch (err) {
            socket.send(
              JSON.stringify({ type: "plugin", subtype: "open_file", error: true, data: (err as any)?.message }),
            );
          }
        }
        if (message.subtype === "write_file") {
          try {
            const path = await tryReadFilePath(joinPath(rootDir, message.path).path);
            if (path) {
              await vscode.workspace.fs.writeFile(path, Buffer.from(message.data));
            }
          } catch (err) {
            socket.send(
              JSON.stringify({ type: "plugin", subtype: "write_file", error: true, data: (err as any)?.message }),
            );
          }
        }
        if (message.subtype === "delete_file") {
          try {
            const path = await tryReadFilePath(joinPath(rootDir, message.path).path);
            console.log(path);
            if (path) {
              await vscode.workspace.fs.delete(path);
            }
            socket.send(JSON.stringify({ type: "plugin", subtype: "delete_file", error: false, data: "success" }));
          } catch (err) {
            socket.send(
              JSON.stringify({ type: "plugin", subtype: "delete_file", error: true, data: (err as any)?.message }),
            );
          }
        }
      }
      if (message.type === "terminal_command") {
        runTerminalCommands(rootDir, socket, message.command, message.terminalId, wss!);
      }
      if (message.type === "add_route") {
        const path = message.path;
        const options = message.options;
        const generatorOptions = Object.entries(options)
          .map(([key, value]) => {
            if (value) {
              return { key };
            }
          })
          .filter(Boolean) as any as GeneratorOption[];

        await generateRouteFile(joinPath(rootDir, "app", "routes"), "", path, generatorOptions);
      }
      if (message.type === "kill") {
        try {
          await killtree(message.processId);
        } catch (err) {
          // console.log(err);
        }
        socket.send(JSON.stringify({ type: "terminal_command", subtype: "EXIT", terminalId: message.terminalId }));
      }
      if (message.type === "open-vscode") {
        const ext = isTS ? ".tsx" : ".jsx";
        const path = joinPath(rootDir, "app", message.data.route).path;

        try {
          const fileLocation = await tryReadFilePath(path + ext);
          if (fileLocation) {
            await openFileInEditor(fileLocation.path);
            return;
          }

          const fileLocationNew = await tryReadFilePath(path + `/route${ext}`);

          if (fileLocationNew) {
            await openFileInEditor(fileLocationNew.path);
            return;
          }
        } catch (err) {}
        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path + ext));
      }

      if (message.type === "commands") {
        const commands = await getProjectCommands(rootDir);
        socket.send(JSON.stringify({ type: "commands", data: commands }));
      }
      /*  if (message.type === "get_file") {
        const routes = await getAllRemixRoutes(rootDir);
        const path = routes?.find((r) => r.url === message.data)?.path;
        if (!path) {
          socket.send(JSON.stringify({ type: "file", data: "not found" }));
          return;
        }

        const file = await tryReadFile(joinPath(rootDir, "routes", path));
        console.log(file);
        socket.send(JSON.stringify({ type: "file", data: file }));
      } */
      // Perform any necessary actions based on the received message
      // For example, you can send a response back to the React app
      //socket.send(JSON.stringify({ type: "response", data: "Hello from the extension" }));
    };

    // Clean up the WebSocket connection when closed
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  });
  wss.on("error", (err) => {
    console.log("WebSocket error:", err);
  });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log("received: %s", message);
    });
  });
};
