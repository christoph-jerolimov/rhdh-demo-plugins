#!/usr/bin/env node
import fs from 'fs';

const backstageJson = JSON.parse(
  fs.readFileSync('backstage.json', { encoding: 'utf8' }),
);
const backstageVersion = backstageJson.version;

const versionManifestUrl = `https://raw.githubusercontent.com/backstage/versions/refs/heads/main/v1/releases/${backstageVersion}/manifest.json`;
const versionManifestJson = await fetch(versionManifestUrl).then(res =>
  res.json(),
);

function updateDependencies(dependencies, versionManifest, rangePrefix = '') {
  if (!dependencies) {
    return dependencies;
  }
  for (const packageName of Object.keys(dependencies)) {
    const pinnedVersion = versionManifest.packages.find(
      p => p.name === packageName,
    );
    if (pinnedVersion) {
      if (
        dependencies[packageName] === `${rangePrefix}${pinnedVersion.version}`
      ) {
        console.log(
          `Package ${packageName} already has the correct version (${pinnedVersion.version}), skipping`,
        );
      } else {
        console.log(
          `Package ${packageName} has a different version (${dependencies[packageName]}) than the version manifest (${pinnedVersion.version}), updating to ${rangePrefix}${pinnedVersion.version}`,
        );
        dependencies[packageName] = `${rangePrefix}${pinnedVersion.version}`;
      }
    }
  }
  return dependencies;
}

function updatePackageJson(
  pacakgeJsonFilename,
  versionManifest,
  rangePrefix = '',
) {
  const packageJson = JSON.parse(
    fs.readFileSync(pacakgeJsonFilename, { encoding: 'utf8' }),
  );

  packageJson.dependencies = updateDependencies(
    packageJson.dependencies,
    versionManifest,
    rangePrefix,
  );
  packageJson.devDependencies = updateDependencies(
    packageJson.devDependencies,
    versionManifest,
    rangePrefix,
  );
  packageJson.peerDependencies = updateDependencies(
    packageJson.peerDependencies,
    versionManifest,
    rangePrefix,
  );
  packageJson.optionalDependencies = updateDependencies(
    packageJson.optionalDependencies,
    versionManifest,
    rangePrefix,
  );

  fs.writeFileSync(pacakgeJsonFilename, JSON.stringify(packageJson, null, 2), {
    encoding: 'utf8',
  });
  console.log(`Updated resolutions in ${pacakgeJsonFilename}!`);
}

// We can assume that more package.json files will follow...
updatePackageJson('package.json', versionManifestJson, '~');
