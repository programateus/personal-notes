export function getPathSeparator(path: string) {
  return path.includes("\\") ? "\\" : "/";
}

export function joinDirectoryPath(dirPath: string) {
  const sep = getPathSeparator(dirPath);
  return dirPath.endsWith(sep) ? dirPath : `${dirPath}${sep}`;
}

export function trimTrailingPathSeparator(path: string) {
  const sep = getPathSeparator(path);

  if (!path.endsWith(sep)) return path;
  if (/^[A-Za-z]:\\$/.test(path) || path === sep) return path;

  return path.slice(0, -1);
}

export function getParentPath(path: string) {
  const sep = getPathSeparator(path);
  return path.substring(0, path.lastIndexOf(sep));
}
