import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gestor de Solicitudes',
  description: 'Aplicación para gestionar solicitudes internas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}