import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const orderedLayers = ['contracts', 'tokens', 'interaction', 'primitives', 'patterns', 'assemblies', 'compositions', 'apps'];
const packageLayers = new Set([...orderedLayers.filter((layer) => layer !== 'apps'), 'genesis']);
const internalPrefix = '@neobrutalism-lab/';

function targetNameFromSpecifier(specifier) {
  if (!specifier.startsWith(internalPrefix)) return null;
  const remainder = specifier.slice(internalPrefix.length);
  return remainder.split('/')[0] || null;
}

export function validateDependencyPair(source, target) {
  if (!packageLayers.has(source) && source !== 'apps') return [`unknown source layer ${source}`];
  if (!packageLayers.has(target)) return [`unknown internal package ${target}`];

  if (source === 'genesis') {
    return ['contracts', 'tokens', 'genesis'].includes(target)
      ? []
      : [`genesis may only depend on contracts or tokens; found ${target}`];
  }

  if (target === 'genesis') {
    return [`${source} cannot depend on genesis; governance is a proposal sidecar, not a runtime UI layer`];
  }

  if (source === 'apps') return [];

  const sourceIndex = orderedLayers.indexOf(source);
  const targetIndex = orderedLayers.indexOf(target);
  return targetIndex <= sourceIndex ? [] : [`${source} cannot depend on ${target}; dependency direction is lower-layer only`];
}

function normalizeImport(item) {
  return typeof item === 'string' ? { specifier: item, file: 'source import' } : item;
}

export function validateBoundaryModel(model) {
  const errors = [];
  for (const pkg of model.packages ?? []) {
    if (!packageLayers.has(pkg.name) && pkg.name !== 'apps') errors.push(`unknown source layer ${pkg.name}`);
    for (const dependency of pkg.manifestDependencies ?? []) {
      const target = targetNameFromSpecifier(dependency);
      if (target === null) continue;
      const pairErrors = validateDependencyPair(pkg.name, target);
      errors.push(...pairErrors.map((error) => `manifest ${pkg.name}: ${error}`));
    }

    for (const rawImport of pkg.imports ?? []) {
      const item = normalizeImport(rawImport);
      const target = targetNameFromSpecifier(item.specifier);
      if (target === null) continue;
      const pairErrors = validateDependencyPair(pkg.name, target);
      errors.push(...pairErrors.map((error) => `${item.file}: ${error}`));
    }
  }
  return { ok: errors.length === 0, errors };
}

function extractInternalImports(source, file) {
  const imports = [];
  const patterns = [
    /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](@neobrutalism-lab\/[^'"]+)['"]/gu,
    /import\(\s*['"](@neobrutalism-lab\/[^'"]+)['"]\s*\)/gu,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) imports.push({ specifier: match[1], file });
    }
  }
  return imports;
}

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(target));
    else if (/\.(?:[cm]?[jt]sx?)$/u.test(entry.name)) files.push(target);
  }
  return files;
}

function manifestInternalDependencies(manifest) {
  const groups = [manifest.dependencies, manifest.devDependencies, manifest.peerDependencies, manifest.optionalDependencies];
  return [...new Set(groups.flatMap((group) => group ? Object.keys(group) : []).filter((name) => name.startsWith(internalPrefix)))];
}

async function packageBoundaryRecord(directory, layerName) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  const sourceDirectory = path.join(directory, 'src');
  let sourceFiles = [];
  try {
    sourceFiles = await collectSourceFiles(sourceDirectory);
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  }
  const imports = [];
  for (const file of sourceFiles) {
    imports.push(...extractInternalImports(await readFile(file, 'utf8'), file));
  }
  return {
    name: layerName,
    manifestDependencies: manifestInternalDependencies(manifest),
    imports,
  };
}

export async function readRepositoryBoundaryModel(root = '.') {
  const records = [];
  const packageEntries = await readdir(path.join(root, 'packages'), { withFileTypes: true });
  for (const entry of packageEntries) {
    if (!entry.isDirectory()) continue;
    const layer = entry.name;
    if (!packageLayers.has(layer)) {
      records.push({ name: layer, manifestDependencies: [], imports: [] });
      continue;
    }
    records.push(await packageBoundaryRecord(path.join(root, 'packages', layer), layer));
  }

  try {
    const appEntries = await readdir(path.join(root, 'apps'), { withFileTypes: true });
    for (const entry of appEntries) {
      if (!entry.isDirectory()) continue;
      records.push(await packageBoundaryRecord(path.join(root, 'apps', entry.name), 'apps'));
    }
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  }
  return { packages: records };
}

export async function validateRepositoryBoundaries(root = '.') {
  return validateBoundaryModel(await readRepositoryBoundaryModel(root));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await validateRepositoryBoundaries(process.argv[2] ?? '.');
    if (!result.ok) {
      for (const error of result.errors) console.error(`boundaries:error ${error}`);
      process.exitCode = 1;
    } else {
      console.log('boundaries:ok');
    }
  } catch (error) {
    console.error(`boundaries:error ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
