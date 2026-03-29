// ─────────────────────────────────────────────────────────────────────────────
// Configuração de extensões de arquivo
// Adicione ou remova extensões neste array para controlar quais arquivos são
// exibidos, criados e renomeados no editor.
// ─────────────────────────────────────────────────────────────────────────────
export const ALLOWED_EXTENSIONS: string[] = ["md"];

// Extensão padrão usada ao criar novos arquivos
export const DEFAULT_EXTENSION = "md";

/**
 * Remove a extensão do nome de exibição se ela estiver na lista de extensões permitidas.
 */
export function stripExtension(name: string): string {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return name;
  const ext = name.slice(lastDot + 1);
  if (ALLOWED_EXTENSIONS.includes(ext)) return name.slice(0, lastDot);
  return name;
}

/**
 * Garante que o nome termine com a extensão padrão.
 * Se já terminar com uma extensão permitida, mantém como está.
 */
export function ensureExtension(name: string): string {
  const trimmed = name.trim();
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot !== -1 && ALLOWED_EXTENSIONS.includes(trimmed.slice(lastDot + 1))) {
    return trimmed;
  }
  return `${trimmed}.${DEFAULT_EXTENSION}`;
}
