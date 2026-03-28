import type { FileNode } from "@/electron";

export function updateChildren(
  nodes: FileNode[],
  targetPath: string,
  children: FileNode[],
): FileNode[] {
  return nodes.map((node) => {
    if (node.path === targetPath) return { ...node, children };
    if (node.children !== undefined)
      return { ...node, children: updateChildren(node.children, targetPath, children) };
    return node;
  });
}
