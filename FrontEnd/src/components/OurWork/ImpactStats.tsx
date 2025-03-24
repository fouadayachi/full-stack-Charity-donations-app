import { Heart, Leaf, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

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

// Animation variants for the cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animation for number counting
const numberVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

export function ImpactStats() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial="hidden"
              transition={{ type: "spring", stiffness: 300 }}
              variants={cardVariants}
              viewport={{ once: true }} // Only trigger once
              whileHover={{ scale: 1.05 }} // Add hover animation
              whileInView="visible" // Trigger animation when in view
            >
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              <motion.h3
                className="text-4xl font-bold text-blue-600 mb-3"
                initial="hidden"
                variants={numberVariants}
                viewport={{ once: true }} // Only trigger once
                whileInView="visible" // Trigger animation when in view
              >
                {stat.number}
              </motion.h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {stat.label}
              </h4>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}