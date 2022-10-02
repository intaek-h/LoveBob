function formatBusinessCategory(category: string) {
  if (category.includes("카페")) return "카페";

  return category;
}

export default formatBusinessCategory;
