
import { Check } from "lucide-react";


 function ResultsOverview({event} : {event : any}) {
    
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Event Overview
        </h2>
        <p className="text-gray-600">
          {event.longDescription}
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Key Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event && event.keyAchievements && event.keyAchievements.map((achievement : String, index : number) => (
            <div key={index} className="flex items-start">
              <span className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <Check className="w-4 h-4 text-blue-600" />
              </span>
              <span className="text-gray-700">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultsOverview;
