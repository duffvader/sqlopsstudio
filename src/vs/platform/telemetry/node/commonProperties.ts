/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Platform from 'vs/base/common/platform';
import * as os from 'os';
import { TPromise } from 'vs/base/common/winjs.base';
import * as uuid from 'vs/base/common/uuid';
import { readFile } from 'vs/base/node/pfs';

// {{SQL CARBON EDIT}}
import product from 'vs/platform/node/product';

export function resolveCommonProperties(commit: string, version: string, machineId: string, installSourcePath: string): TPromise<{ [name: string]: string; }> {
	const result: { [name: string]: string; } = Object.create(null);
	// __GDPR__COMMON__ "common.machineId" : { "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
	result['common.machineId'] = machineId;
	// __GDPR__COMMON__ "sessionID" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['sessionID'] = uuid.generateUuid() + Date.now();
	// __GDPR__COMMON__ "commitHash" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['commitHash'] = commit;
	// __GDPR__COMMON__ "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['version'] = version;
	// __GDPR__COMMON__ "common.osVersion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.osVersion'] = os.release();
	// __GDPR__COMMON__ "common.platform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.platform'] = Platform.Platform[Platform.platform];
	// __GDPR__COMMON__ "common.nodePlatform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.nodePlatform'] = process.platform;
	// __GDPR__COMMON__ "common.nodeArch" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.nodeArch'] = process.arch;
	
	// {{SQL CARBON EDIT}}
	result['common.application.name'] = product.nameLong;

	// dynamic properties which value differs on each call
	let seq = 0;
	const startTime = Date.now();
	Object.defineProperties(result, {
		// __GDPR__COMMON__ "timestamp" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'timestamp': {
			get: () => new Date(),
			enumerable: true
		},
		// __GDPR__COMMON__ "common.timesincesessionstart" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'common.timesincesessionstart': {
			get: () => Date.now() - startTime,
			enumerable: true
		},
		// __GDPR__COMMON__ "common.sequence" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'common.sequence': {
			get: () => seq++,
			enumerable: true
		}
	});

	return readFile(installSourcePath, 'utf8').then(contents => {

		// __GDPR__COMMON__ "common.source" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		result['common.source'] = contents.slice(0, 30);

		return result;
	}, error => {
		return result;
	});
}