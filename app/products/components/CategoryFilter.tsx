type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

function formatCategoryLabel(category: string) {
  if (category === "all") return "Todos";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
              isActive
                ? "scale-105 border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            }`}
          >
            {formatCategoryLabel(category)}
          </button>
        );
      })}
    </div>
  );
}
