import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('BeomStyle Theme is now active!');

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    let disposable = vscode.commands.registerCommand('beomstyle-theme.toggleAutoSwitch', async () => {
        const config = vscode.workspace.getConfiguration('beomstyle-theme');
        const currentValue = config.get<boolean>('autoSwitch', true);
        
        try {
            await config.update('autoSwitch', !currentValue, vscode.ConfigurationTarget.Global);
            updateStatusBarItem(statusBarItem, !currentValue);
            vscode.window.showInformationMessage(
                `BeomStyle Auto Theme switch is now ${!currentValue ? 'enabled' : 'disabled'}`
            );
        } catch (error) {
            console.error('Failed to update auto switch setting:', error);
        }
    });

    context.subscriptions.push(disposable, statusBarItem);

    updateStatusBarItem(statusBarItem, true);
    
    setThemeBasedOnTime();

    const interval = setInterval(setThemeBasedOnTime, 60000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });
}

function updateStatusBarItem(statusBarItem: vscode.StatusBarItem, enabled: boolean): void {
    statusBarItem.text = enabled ? "$(clock) BeomStyle Auto" : "$(clock) BeomStyle Manual";
    statusBarItem.tooltip = enabled 
        ? "Click to disable automatic theme switching" 
        : "Click to enable automatic theme switching";
    statusBarItem.command = 'beomstyle-theme.toggleAutoSwitch';
    statusBarItem.show();
}

function showGreeting(hour: number): void {
    let message = '';
    
    if (hour >= 22 || hour < 6) {
        message = '이 시간에도 열정적인 당신, 성공이 기다리고 있을 겁니다! ✨';
    }
    else if (hour >= 6 && hour < 12) {
        message = '좋은 아침입니다. 오늘도 좋은 하루 되세요! 🌅';
    }
    else {
        message = '좋은 오후입니다. 남은 시간도 파이팅! 💪';
    }

    vscode.window.showInformationMessage(message);
}

async function setThemeBasedOnTime(): Promise<void> {
    const hour = new Date().getHours();
    let themeName = '';

    if (hour >= 22 || hour < 6) {
        themeName = 'BeomStyle Night';
    }
    else if (hour >= 6 && hour < 12) {
        themeName = 'BeomStyle Morning';
    }
    else {
        themeName = 'BeomStyle Day';
    }

    try {
        const config = vscode.workspace.getConfiguration('workbench');
        await config.update('colorTheme', themeName, vscode.ConfigurationTarget.Global);
        showGreeting(hour);
    } catch (error) {
        console.error('Failed to update theme:', error);
        vscode.window.showErrorMessage('Failed to update theme');
    }
}

export function deactivate() {}