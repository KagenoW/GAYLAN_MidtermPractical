import InventoryPage from './pages/InventoryPage';

function App() {
  return (
    <div className="min-h-screen bg-[#12151B] text-[#E5E9EF]">
      <header className="border-b border-[#2B323D] bg-[#161A21]">
        <div className="px-4 sm:px-6 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-[#E5E9EF]">
            Tech Gadget Inventory Hub
          </h1>
          <p className="text-sm text-[#8890A0] mt-1">
            Registry and health tracking for engineering and test devices.
          </p>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-[#E2A254] via-[#E2A254]/30 to-transparent" />
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <InventoryPage />
      </main>
    </div>
  );
}

export default App;