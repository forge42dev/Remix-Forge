import { Server } from "ws";
import type { MessageEvent, WebSocket } from "ws";
/* import { getAllRemixRoutes } from "../devTools/allRoutes";
import { getProjectCommands } from "../devTools/getProjectCommands";
import { runTerminalCommands } from "../devTools/runTerminalCommands"; */
import { getRootDir, openFileInEditor, tryReadFile, tryReadFilePath } from "../utils/file";
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
        const path = joinPath(rootDir, "app", message.data.route).path + ".tsx";

        try {
          const ts = await tryReadFilePath(joinPath(rootDir, "app", message.data.route).path + ".tsx");
          if (ts) {
            await openFileInEditor(ts.path);
            return;
          }

          const tsNew = await tryReadFilePath(joinPath(rootDir, "app", message.data.route).path + "/route.tsx");

          if (tsNew) {
            await openFileInEditor(tsNew.path);
            return;
          }
        } catch (err) {}
        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path));
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
