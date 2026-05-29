#!/usr/bin/env node
import fs from 'fs';

const backstageJson = JSON.parse(fs.readFileSync('backstage.json', { encoding: 'utf8' }));
const backstageVersion = backstageJson.version;

const backstagePackageJsonUrl = `https://raw.githubusercontent.com/backstage/backstage/refs/tags/v${backstageVersion}/package.json`;
const backstagePackageJson = await fetch(backstagePackageJsonUrl).then(res => res.json());

const versionManifestUrl = `https://raw.githubusercontent.com/backstage/versions/refs/heads/main/v1/releases/${backstageVersion}/manifest.json`;
const versionManifestJson = await fetch(versionManifestUrl).then(res => res.json());

const packageJson = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));

const resolutions = { ...packageJson.resolutions };

for (const pkg of versionManifestJson.packages) {
  if (resolutions[pkg.name] === pkg.version) {
    console.log(`Package ${pkg.name} already has the correct resolution (${pkg.version}), skipping`);
    continue;
  } else if (resolutions[pkg.name]) {
    console.log(`Package ${pkg.name} has a different resolution (${resolutions[pkg.name]}) than the version manifest (${pkg.version}), updating to ${pkg.version}`);
  } else {
    console.log(`Package ${pkg.name} has no resolution, pinning to ${pkg.version}`);
  }
  // We use the exact version from the manifest, not a caret range,
  // to ensure that we are using the exact version that was delivered
  // with the given RHDH version.
  // This is important to avoid accidentally using a newer APIs that
  // are not available in the previously released RHDH version.
  resolutions[pkg.name] = pkg.version;
}

// Fix broken GendocuPublicApis resolution
if (backstagePackageJson.resolutions['GendocuPublicApis']) {
  if (resolutions['GendocuPublicApis'] === backstagePackageJson.resolutions['GendocuPublicApis']) {
    console.log(`GendocuPublicApis resolution is already correct (${resolutions['GendocuPublicApis']}), skipping`);
  } else {
    console.log(`GendocuPublicApis resolution is ${resolutions['GendocuPublicApis']}, but should be ${backstagePackageJson.resolutions['GendocuPublicApis']}, updating`);
    resolutions['GendocuPublicApis'] = backstagePackageJson.resolutions['GendocuPublicApis'];
  }
}

// sort resolutions by name
packageJson.resolutions = Object.entries(resolutions)
  .sort(([a], [b]) => a.localeCompare(b))
  .reduce((acc, [name, version]) => {
    acc[name] = version;
    return acc;
  }, {});

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), { encoding: 'utf8' });
console.log('Updated resolutions in package.json!');
