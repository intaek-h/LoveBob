export const generateResizedUrl = (url: string, size: "small" | "medium") => {
  if (size === "medium") {
    return url.substring(0, url.lastIndexOf(".")) + "-medium.jpg";
  }

  if (size === "small") {
    return url.substring(0, url.lastIndexOf(".")) + "-small.jpg";
  }

  return url;
};
