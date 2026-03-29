import type { FileNodeState } from "./types";

export function updateChildren(
  nodes: FileNodeState[],
  targetPath: string,
  children: FileNodeState[],
): FileNodeState[] {
  return nodes.map((node) => {
    if (node.path === targetPath) return { ...node, children };
    if (node.children !== undefined)
      return { ...node, children: updateChildren(node.children, targetPath, children) };
    return node;
  });
}

export function insertNodeAt(
  nodes: FileNodeState[],
  dirPath: string,
  newNode: FileNodeState,
): FileNodeState[] {
  return nodes.map((node) => {
    if (node.path === dirPath && node.type === "directory") {
      return { ...node, children: [newNode, ...(node.children ?? [])] };
    }
    if (node.children) {
      return { ...node, children: insertNodeAt(node.children, dirPath, newNode) };
    }
    return node;
  });
}

export function removeNodeByPath(nodes: FileNodeState[], targetPath: string): FileNodeState[] {
  return nodes
    .filter((n) => n.path !== targetPath)
    .map((n) =>
      n.children ? { ...n, children: removeNodeByPath(n.children, targetPath) } : n,
    );
}
