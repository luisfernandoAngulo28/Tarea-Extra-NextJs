type CategoryBubbleProps = {
  title: string;
  icon: React.ReactNode;
};

export default function CategoryBubble({ title, icon }: CategoryBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-md transition group-hover:scale-110 group-hover:shadow-lg md:h-20 md:w-20">
        <span className="text-2xl md:text-3xl">{icon}</span>
      </div>
      <p className="text-xs md:text-sm font-medium text-gray-700 text-center">
        {title}
      </p>
    </div>
  );
}
