import * as vscode from 'vscode';
import { FocusEngine } from '../engines/focusEngine';
import { formatMsToMinutesSeconds } from '../utils/timeUtils';

export class StatusBarController implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;
  private disposables: vscode.Disposable[] = [];

  constructor(private readonly focusEngine: FocusEngine) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100 // High priority in status bar
    );
    this.disposables.push(this.statusBarItem);

    // Click opens the Hub
    this.statusBarItem.command = 'devFocus.openInTab';

    // Event listeners
    this.disposables.push(
      this.focusEngine.onSessionTick(payload => {
        this.updateRunningTimer(payload.session.taskTitle, payload.remainingMs);
      })
    );

    this.disposables.push(
      this.focusEngine.onSessionStateChanged(session => {
        this.updateDisplay(session);
      })
    );

    // Initial render
    this.updateDisplay(this.focusEngine.getSession());
    this.statusBarItem.show();
  }

  private updateDisplay(session: ReturnType<FocusEngine['getSession']>): void {
    if (!session || session.state === 'IDLE' || session.state === 'COMPLETED') {
      this.statusBarItem.text = `$(flame) Know`;
      this.statusBarItem.tooltip = 'Know — Click to open';
      this.statusBarItem.backgroundColor = undefined;
      return;
    }

    const projBadge = session.projectName ? ` [${session.projectName}]` : '';

    if (session.state === 'PAUSED') {
      this.statusBarItem.text = `$(debug-pause) Paused: ${session.taskTitle}${projBadge}`;
      this.statusBarItem.tooltip = 'Focus session is paused. Click to open Hub';
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      return;
    }

    if (session.state === 'ACTIVE') {
      this.statusBarItem.text = `$(stopwatch) ${session.taskTitle}${projBadge}`;
      this.statusBarItem.tooltip = `Active Focus: ${session.taskTitle}\nCategory: ${session.category}\nTarget: ${session.targetDurationMinutes}m`;
      this.statusBarItem.backgroundColor = undefined;
    }
  }

  private updateRunningTimer(taskTitle: string, remainingMs: number): void {
    const timeFormatted = formatMsToMinutesSeconds(remainingMs);
    this.statusBarItem.text = `$(stopwatch) ${taskTitle} — ${timeFormatted}`;
    this.statusBarItem.tooltip = `Active Focus: ${taskTitle}\nRemaining Time: ${timeFormatted}`;
    this.statusBarItem.backgroundColor = undefined;
  }

  public dispose(): void {
    this.disposables.forEach(d => d.dispose());
  }
}
