export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-600 mb-4">Página no encontrada</p>
        <a href="/" className="btn-primary">
          Volver a inicio
        </a>
      </div>
    </div>
  );
}