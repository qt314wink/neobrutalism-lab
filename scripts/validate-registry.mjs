import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function validateRegistry(registry) {
  const errors = [];
  const nodeIds = new Set();
  const edgeIds = new Set();
  const relationKinds = new Set(registry.relationKinds ?? []);

  for (const node of registry.nodes ?? []) {
    if (nodeIds.has(node.id)) errors.push(`duplicate node id: ${node.id}`);
    nodeIds.add(node.id);
  }

  for (const edge of registry.edges ?? []) {
    if (edgeIds.has(edge.id)) errors.push(`duplicate edge id: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.from)) errors.push(`edge ${edge.id} unknown from node: ${edge.from}`);
    if (!nodeIds.has(edge.to)) errors.push(`edge ${edge.id} unknown to node: ${edge.to}`);
    if (!relationKinds.has(edge.kind)) errors.push(`edge ${edge.id} unknown relation kind: ${edge.kind}`);
  }

  return { ok: errors.length === 0, errors };
}

export async function validateRegistryFile(path = 'registry/system-graph.json') {
  const raw = await readFile(path, 'utf8');
  const registry = JSON.parse(raw);
  return validateRegistry(registry);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await validateRegistryFile(process.argv[2]);
    if (!result.ok) {
      for (const error of result.errors) console.error(`registry:error ${error}`);
      process.exitCode = 1;
    } else {
      console.log('registry:ok');
    }
  } catch (error) {
    console.error(`registry:error ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
