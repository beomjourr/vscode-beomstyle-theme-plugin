import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';

suite('BeomStyle Theme Extension Test Suite', () => {
    let clock: sinon.SinonFakeTimers;

    setup(() => {
        // 시간을 고정하기 위한 fake timer 설정
        clock = sinon.useFakeTimers(new Date().getTime());
    });

    teardown(() => {
        clock.restore();
    });

    test('Theme should change based on time', async () => {
        // 테마 설정이 활성화되어 있는지 확인
        const config = vscode.workspace.getConfiguration('beomstyle-theme');
        assert.strictEqual(config.get('autoSwitch'), true);

        // 시간대별 테마 테스트
        const testCases = [
            { hour: 23, expected: 'BeomStyle Night' },  // 밤
            { hour: 7, expected: 'BeomStyle Morning' }, // 아침
            { hour: 14, expected: 'BeomStyle Day' }     // 낮
        ];

        for (const testCase of testCases) {
            // 시간 설정
            const date = new Date();
            date.setHours(testCase.hour);
            clock.setSystemTime(date);

            // 테마 업데이트 기다리기
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 현재 테마 확인
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            assert.strictEqual(currentTheme, testCase.expected);
        }
    });

    test('Toggle auto switch should work', async () => {
        // 자동 전환 토글 테스트
        await vscode.commands.executeCommand('beomstyle-theme.toggleAutoSwitch');
        
        // 설정이 변경되었는지 확인
        const config = vscode.workspace.getConfiguration('beomstyle-theme');
        assert.strictEqual(config.get('autoSwitch'), false);
    });
});