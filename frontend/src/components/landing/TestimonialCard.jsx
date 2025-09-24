import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  avatar,
}) {
  return (
    <Card className="p-6 gap-0">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">
            {role} at {company}
          </p>
        </div>
      </div>
    </Card>
  );
}
