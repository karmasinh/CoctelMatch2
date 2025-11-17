export function buildImageUrl(path) {
  const base = process.env.REACT_APP_API_URL;
  if (!path || typeof path !== "string") return "/images/Pattern.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}/${path}`;
}