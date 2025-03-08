'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Критическая ошибка!</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            Произошла серьезная ошибка при загрузке приложения. Пожалуйста, попробуйте перезагрузить страницу.
          </p>
          {error?.digest && (
            <p className="text-sm text-gray-500 mb-4">
              Код ошибки: {error.digest}
            </p>
          )}
          <button 
            onClick={() => reset()} 
            className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Перезагрузить страницу
          </button>
        </div>
      </body>
    </html>
  )
}