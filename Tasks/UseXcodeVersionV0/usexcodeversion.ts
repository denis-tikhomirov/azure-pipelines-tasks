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

    ///// Following code must be replaced in accordancdance with specific path of Xcode in system - https://github.com/actions/virtual-environments/blob/main/images/macos/macos-11-Readme.md#xcode
    //
    //const toolName: string = 'Xcode';
    //const installDir: string | null = tool.findLocalTool(toolName, parameters.versionSpec);
    //if (!installDir) {
    //    // Fail and list available versions
    //    throw new Error([
    //        task.loc('VersionNotFound', parameters.versionSpec),
    //        task.loc('ListAvailableVersions', task.getVariable('Agent.ToolsDirectory')),
    //        tool.findLocalToolVersions('Ruby'),
    //        task.loc('ToolNotFoundMicrosoftHosted', 'Ruby', 'https://aka.ms/hosted-agent-software'),
    //        task.loc('ToolNotFoundSelfHosted', 'Ruby', 'https://go.microsoft.com/fwlink/?linkid=2005989')
    //    ].join(os.EOL));
    //}
    //
    //const toolPath: string = path.join(installDir, 'bin');
    //
    //// Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
    //// replace that version of ruby so all the correct version of ruby gets selected
    //// replace the default
    //const dest: string = '/usr/bin/ruby';
    //task.execSync('sudo', `ln -sf ${path.join(toolPath, 'ruby')} ${dest}`); // replace any existing
    //
    /////

    task.setVariable('xcodeLocation', toolPath);
    if (parameters.addToPath) {
        tool.prependPath(toolPath);
    }
}
