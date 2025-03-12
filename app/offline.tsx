export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Вы не подключены к интернету</h1>
      <p className="mb-6">Проверьте ваше соединение и попробуйте снова</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Обновить страницу
      </button>
    </div>
  );
} 