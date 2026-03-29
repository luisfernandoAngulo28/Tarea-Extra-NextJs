import Image from "next/image";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  actions?: React.ReactNode;
  detailTrigger?: React.ReactNode;
};

export default function ProductCard({
  title,
  description,
  image,
  price,
  rating,
  category,
  actions,
  detailTrigger,
}: ProductCardProps) {
  return (
    <div className="relative group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      {actions && (
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {actions}
        </div>
      )}

      <div className="h-52 flex items-center justify-center bg-gray-50">
        <Image
          src={image}
          alt={title}
          width={220}
          height={220}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="h-40 object-contain"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded w-fit mb-2">
          {category}
        </span>

        <h3 className="font-semibold text-base leading-snug line-clamp-3 text-slate-900 min-h-[3.75rem]">{title}</h3>

        <p className="text-gray-500 text-sm line-clamp-2 mt-2">{description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-blue-600 font-bold text-lg">${price}</span>

          <span className="text-yellow-500 text-sm">⭐ {rating}</span>
        </div>

        {detailTrigger && <div className="mt-4">{detailTrigger}</div>}
      </div>
    </div>
  );
}
