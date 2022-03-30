import * as path from 'path';
import * as task from 'azure-pipelines-task-lib/task';
import * as telemetry from 'azure-pipelines-tasks-utility-common/telemetry'
import { useXcodeVersion } from './usexcodeversion';

(async () => {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));
        
        // Check if this is running on Mac and fail the task if not
        if (os.platform() !== 'darwin') {
            throw new Error(tl.loc('DarwinOnly'));
        }
        
        const versionSpec = task.getInput('versionSpec', true);
        const addToPath = task.getBoolInput('addToPath', true);
        await useXcodeVersion({
            versionSpec,
            addToPath
        });

        task.setResult(task.TaskResult.Succeeded, '');
        telemetry.emitTelemetry('TaskHub', 'UseXcodeVersionV0', {
            versionSpec,
            addToPath
        });
    } catch (error) {
        task.setResult(task.TaskResult.Failed, error.message);
    }
})();
