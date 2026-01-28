export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        To place an order, please scan the QR code located on your table.
      </p>
      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-4xl">📱</span>
      </div>
    </div>
  );
}
