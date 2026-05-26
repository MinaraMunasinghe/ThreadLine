export function generateOrderId(): string {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${suffix}`;
}
