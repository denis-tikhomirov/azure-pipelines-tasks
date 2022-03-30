import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';

import * as task from 'azure-pipelines-task-lib/task';
import * as tool from 'azure-pipelines-tool-lib/tool';

/**
 * Checks if the patch field is present in the version specification
 * @param versionSpec version specification
 */
export function isExactVersion(versionSpec: string) {
    const semanticVersion = semver.coerce(versionSpec);
    return semanticVersion && semanticVersion.patch;
} 

interface TaskParameters {
    readonly versionSpec: string;
    readonly addToPath: boolean;
}

export async function useXcodeVersion(parameters: TaskParameters): Promise<void> {
    if (isExactVersion(parameters.versionSpec)) {
        task.warning(task.loc('ExactVersionNotRecommended'));
    }

    // Checks if required Xcode version is presented on agent
    const appFiles: string[] = fs.readdir('/Applications').filter((file) => {
        return file.contains('Xcode');
    });
    const versionRegex = /(Xcode_)([0-9.]+)(.app))/;
    let versions: string[];
    appFiles.forEach(appFile => {
        versions.push(appFile.replace(versionRegex, '$2'));
    });
    const xcodeVersion = tool.evaluateVersions(versions, parameters.versionSpec);

    if (!xcodeVersion) {
        // Fail and list available versions
        throw new Error([
            task.loc('VersionNotFound', parameters.versionSpec),
            task.loc('ListAvailableVersions', '/Applications'),
            versions,
            task.loc('ToolNotFoundMicrosoftHosted', 'Xcode', 'https://aka.ms/hosted-agent-software'),
            task.loc('ToolNotFoundSelfHosted', 'Xcode', 'https://docs.microsoft.com/azure/devops/pipelines/tasks')
        ].join(os.EOL));
    }

    const toolPath: string = path.join('/Applications/Xcode_', xcodeVersion, '.app/Contents/Developer');
    task.execSync('sudo', `xcode-select -s ${toolPath}`); // set required Xcode version 

    task.setVariable('xcodeLocation', toolPath);
    if (parameters.addToPath) {
        tool.prependPath(toolPath);
    }
}
