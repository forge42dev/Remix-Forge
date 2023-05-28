import * as vscode from "vscode";

export const commandWithLoading = async (title: string, action: (...args: any[]) => Promise<void> | void) => {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: title,
      cancellable: false,
    },
    async (progress) => {
      // Show initial notification
      progress.report({ increment: 0, message: "" });

      // Animate loading state
      const loadingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frameIndex = 0;

      const animateLoading = setInterval(() => {
        progress.report({ increment: 0, message: `${loadingFrames[frameIndex]}` });
        frameIndex = (frameIndex + 1) % loadingFrames.length;
      }, 50);

      await action();
      // Stop the loading animation
      clearInterval(animateLoading);

      // Update notification when process is finished
      progress.report({ increment: 100, message: "" });
    }
  );
};
