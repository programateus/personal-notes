export const ALLOWED_EXTENSIONS: string[] = ["md"];

export const DEFAULT_EXTENSION = "md";

export function stripExtension(name: string): string {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return name;
  const ext = name.slice(lastDot + 1);
  if (ALLOWED_EXTENSIONS.includes(ext)) return name.slice(0, lastDot);
  return name;
}

export function ensureExtension(name: string): string {
  const trimmed = name.trim();
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot !== -1 && ALLOWED_EXTENSIONS.includes(trimmed.slice(lastDot + 1))) {
    return trimmed;
  }
  return `${trimmed}.${DEFAULT_EXTENSION}`;
}
