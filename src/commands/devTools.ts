import { Server } from "ws";
import type { MessageEvent, WebSocket } from "ws";
/* import { getAllRemixRoutes } from "../devTools/allRoutes";
import { getProjectCommands } from "../devTools/getProjectCommands";
import { runTerminalCommands } from "../devTools/runTerminalCommands"; */
import { getRootDir, isTSConfigExists, openFileInEditor, tryReadFile, tryReadFilePath } from "../utils/file";
import { joinPath } from "../utils/vscode";
import * as vscode from "vscode";
import { setStatusBarToRunning, setStatusBarToStopped } from "../utils/statusBar";
import { generateRouteFile } from "./generateRouteFile";
import { GeneratorOption } from "../generators";
import { getConfig } from "../config";

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

  const rootDir = getRootDir();
  if (!rootDir) {
    return undefined;
  }

  const isTS = await isTSConfigExists(rootDir);

  // Handle WebSocket connection
  wss.on("connection", (socket: WebSocket) => {
    // Handle messages received from the React app
    socket.onmessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data.toString());

      /* if (message.type === "terminal_command") {
        runTerminalCommands(socket, message.command);
      } */
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
      /* if (message.type === "routes") {
        const routes = await getAllRemixRoutes();
        socket.send(JSON.stringify({ type: "routes", data: routes?.map((route) => route.url) }));
      } */
      /*  if (message.type === "commands") {
        const commands = await getProjectCommands();
        socket.send(JSON.stringify({ type: "commands", data: commands }));
      } */
      /*  if (message.type === "get_file") {
        const routes = await getAllRemixRoutes();
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
