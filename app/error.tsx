'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button' // Предполагаю, что у вас есть компоненты UI
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логирование ошибки в сервис отчетов об ошибках
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-red-500 text-5xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Что-то пошло не так!</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Произошла ошибка при загрузке этой части страницы. Попробуйте перезагрузить или вернуться позже.
      </p>
      {error.digest && (
        <p className="text-sm text-gray-500 mb-4">
          Код ошибки: {error.digest}
        </p>
      )}
      <Button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </Button>
    </div>
  )
}