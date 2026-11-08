export function validateConfigValue(value: string): string | null {
  if (!value.trim()) return "Informe um valor para a configuração.";
  if (value.trim().length > 500) return "O valor deve ter no máximo 500 caracteres.";
  return null;
}
