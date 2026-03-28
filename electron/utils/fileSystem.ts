import path from "path";
import fs from "fs";

export type FileNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
};

function sorted(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function readDir(dirPath: string): Promise<FileNode[]> {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  return sorted(
    entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      type: entry.isDirectory() ? "directory" : "file",
    })),
  );
}

export async function readDirRecursive(dirPath: string): Promise<FileNode[]> {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const children = await readDirRecursive(fullPath);
      if (children.length > 0) {
        nodes.push({ name: entry.name, path: fullPath, type: "directory", children });
      }
    } else {
      nodes.push({ name: entry.name, path: fullPath, type: "file" });
    }
  }

  return sorted(nodes);
}
