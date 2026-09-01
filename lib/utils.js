export function formatSum(n) {
  return (
    Math.round(n || 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
  );
}
