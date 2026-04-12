import Spinner from './Spinner';

export default function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner className="h-8 w-8 text-blue-600 mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
