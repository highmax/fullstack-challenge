export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
    </div>
  );
}
