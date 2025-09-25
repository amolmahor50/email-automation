import { Star } from "lucide-react";

export default function TestimonialCard({ name, role, company, content }) {
  return (
    <div className="p-6 bg-[#f2f5fa] rounded-3xl">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-500 mb-6 leading-relaxed">{content}</p>
      <div>
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-gray-600 text-sm">
          {role} at {company}
        </p>
      </div>
    </div>
  );
}
