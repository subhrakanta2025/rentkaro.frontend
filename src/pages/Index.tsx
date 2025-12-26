import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TopAgencies } from '@/components/home/TopAgencies';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleCarousel } from '@/components/vehicles/VehicleCarousel';

const Index = () => {
  try {
    const { data: vehicles = [], isLoading, error, isError } = useVehicles();

    console.log('[Index] vehicles:', vehicles);
    console.log('[Index] isLoading:', isLoading);
    console.log('[Index] isError:', isError);
    console.log('[Index] error:', error);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          
          {/* API Status Display */}
          <div className="container py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">🔍 API Status:</h3>
              <p className="text-sm mb-1">Loading: {isLoading ? 'Yes ⏳' : 'No ✓'}</p>
              <p className="text-sm mb-1">Has Error: {isError ? 'Yes ❌' : 'No ✓'}</p>
              <p className="text-sm mb-1">Vehicles Count: {vehicles?.length || 0}</p>
              {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                  <p className="text-sm font-semibold text-red-800">Error:</p>
                  <pre className="text-xs text-red-700 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                </div>
              )}
              {!isLoading && !isError && vehicles && vehicles.length > 0 && (
                <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                  <p className="text-sm font-semibold text-green-800">✓ API Response Success!</p>
                  <pre className="text-xs text-green-700 overflow-auto max-h-40">{JSON.stringify(vehicles.slice(0, 2), null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="container flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-lg">Loading vehicles from API...</p>
              <p className="text-sm text-muted-foreground">Fetching from: http://localhost:3000/api/vehicles</p>
            </div>
          ) : isError ? (
            <div className="container py-12">
              <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-800 mb-4">❌ API Error</h2>
                <p className="text-red-700 mb-4">Failed to fetch vehicles from the backend API.</p>
                <div className="bg-white p-4 rounded border border-red-200">
                  <p className="font-semibold mb-2">Error Details:</p>
                  <pre className="text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                </div>
                <div className="mt-4 text-sm text-red-600">
                  <p>• Check if backend is running on http://localhost:3000</p>
                  <p>• Check browser console for more details (F12)</p>
                  <p>• Check network tab for failed requests</p>
                </div>
              </div>
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <FeaturedVehicles />
          ) : (
            <div className="container text-center py-12">
              <div className="max-w-xl mx-auto bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">⚠️ No Vehicles Found</h2>
                <p className="text-yellow-700 mb-4">The API returned successfully but no vehicles are available.</p>
                <div className="bg-white p-4 rounded border border-yellow-200 text-left">
                  <p className="font-semibold mb-2">API Response:</p>
                  <p className="text-sm">Vehicles Array Length: {vehicles?.length || 0}</p>
                  <p className="text-sm">Is Array: {Array.isArray(vehicles) ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <VehicleCarousel />
            </div>
          )}
          
          <HowItWorks />
          <TopAgencies />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('[Index] Render Error:', error);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">💥 Component Error</h1>
            <p className="text-red-700 mb-4">An error occurred while rendering the page.</p>
            <div className="bg-white p-4 rounded border border-red-200">
              <pre className="text-sm overflow-auto">{error instanceof Error ? error.message : String(error)}</pre>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
};

export default Index;
