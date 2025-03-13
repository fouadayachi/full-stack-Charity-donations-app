
const stories = [
  {
    quote:
      "The medical supplies provided helped our entire community stay healthy during difficult times.",
    author: "Sarah Johnson",
    role: "Community Leader",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80",
  },
  {
    quote:
      "Thanks to the environmental cleanup initiative, our children now have a safe place to play.",
    author: "Michael Chen",
    role: "Local Parent",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  },
];

export function SuccessStories() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Success Stories
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img
                    alt={story.author}
                    className="h-full w-full object-cover"
                    src={story.image}
                  />
                </div>
                <div className="p-8 md:w-3/5">
                  <blockquote className="text-gray-600 italic mb-4">
                    &quot;{story.quote}&quot;
                  </blockquote>
                  <div className="font-medium">
                    <div className="text-blue-600">{story.author}</div>
                    <div className="text-gray-500">{story.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
