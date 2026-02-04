
interface Item {
  name: string;
  quantityNeeded: number;
  quantityDonated: number;
}
interface ItemsListProps {
  items: Item[];
}
export function ItemsList({ items }: ItemsListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const remaining = item.quantityNeeded - item.quantityDonated;
        const percentage = Math.min(
          Math.round((item.quantityDonated / item.quantityNeeded) * 100),
          100,
        );

        return (
          <li
            key={index}
            className="border-b border-gray-100 pb-3 last:border-0"
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-600">
                {remaining} more needed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                }}
               />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
