export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="ap-0">
      <div className="w-14 h-14 bg-[#e6e8ed] rounded-full flex items-center justify-center mb-6">
        <Icon size={20} className="text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
