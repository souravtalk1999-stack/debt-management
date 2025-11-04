export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Debt Management
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-lg text-center mb-4">
            Welcome to your Debt Management application
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Track, manage, and pay off your debts with ease
          </p>
        </div>
      </main>
    </div>
  );
}
