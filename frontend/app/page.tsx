export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        To place an order, please scan the QR code located on your table.
      </p>
      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
        <span className="text-4xl">📱</span>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">No QR Code? Try Demo Mode:</p>
        <a
          href="/table/1"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Simulate Scan (Table 1)
        </a>
      </div>
    </div>
  );
}
