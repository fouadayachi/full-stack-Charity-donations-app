
import { Heart, Leaf, ShoppingBag } from "lucide-react";
const stats = [
  {
    icon: <Heart className="text-blue-600" size={40} />,
    number: "5,000+",
    label: "People Helped",
    description: "Through healthcare initiatives",
  },
  {
    icon: <Leaf className="text-blue-600" size={40} />,
    number: "100+",
    label: "Places Cleaned",
    description: "Environmental restoration",
  },
  {
    icon: <ShoppingBag className="text-blue-600" size={40} />,
    number: "10,000+",
    label: "Supplies Provided",
    description: "Food and clothing distributed",
  },
];

export function ImpactStats() {

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-blue-600 mb-3">
                {stat.number}
              </h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {stat.label}
              </h4>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
