'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-red-600">Error</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button onClick={() => reset()} className="btn-primary">
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
