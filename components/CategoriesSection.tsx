import * as ScrollArea from "@radix-ui/react-scroll-area";
import CategoryBubble from "./CategoryBubble";
import { Cpu, Gem, Shirt, ShoppingBag, type LucideIcon } from "lucide-react";

type CategoriesSectionProps = {
  categories: string[];
  title?: string;
};

const categoryIconMap: Record<string, LucideIcon> = {
  electronics: Cpu,
  jewelery: Gem,
  "men's clothing": Shirt,
  "women's clothing": ShoppingBag,
};

function formatCategoryLabel(category: string) {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CategoriesSection({
  categories,
  title = "Explorar por categoria",
}: CategoriesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
        {title}
      </h2>
      <ScrollArea.Root className="relative w-full">
        <ScrollArea.Viewport className="w-full overflow-hidden rounded-md">
          <div className="flex w-max min-w-full gap-8 md:gap-12 justify-start md:justify-center pb-2">
            {categories.map((category) => {
              const CategoryIcon = categoryIconMap[category] ?? ShoppingBag;

              return (
                <CategoryBubble
                  key={category}
                  title={formatCategoryLabel(category)}
                  icon={<CategoryIcon aria-hidden="true" strokeWidth={2} />}
                />
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="flex h-2 touch-none select-none bg-gray-200/70 transition-colors"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-400" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-2 touch-none select-none bg-gray-200/70 transition-colors"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-400" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-gray-200/70" />
      </ScrollArea.Root>
    </section>
  );
}
