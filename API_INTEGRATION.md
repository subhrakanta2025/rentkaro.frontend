# Frontend API Integration Guide

## Overview

The frontend has been updated to use the Flask backend API instead of direct Supabase calls. All API requests are now routed through the `apiClient` service.

## Getting Started

### 1. Environment Configuration

Create or update `.env` file in the frontend root:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_FRONTEND_PORT=8080
```

### 2. API Service

The main API client is located at `src/services/api.ts`

```typescript
import { apiClient } from '@/services/api';

// Example usage
const response = await apiClient.login('user@example.com', 'password');
```

### 3. Authentication

#### Sign Up

```typescript
const result = await apiClient.register(
  'user@example.com',
  'password',
  'John Doe',
  '+91 9999999999',
  'customer' // or 'agency'
);

// Token is automatically stored
// Result: { access_token, user: { id, email, role } }
```

#### Sign In

```typescript
const result = await apiClient.login('user@example.com', 'password');

// Token is automatically stored
// Result: { access_token, user: { id, email, role } }
```

#### Logout

```typescript
await apiClient.logout();
// Token is automatically cleared
```

#### Get Current User

```typescript
const result = await apiClient.getCurrentUser();
// Result: { user: { id, email, role, profile: { ... } } }
```

### 4. Authentication Context

The `AuthContext` has been updated to use the API client:

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, profile, userRole, signUp, signIn, signOut, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => signIn(email, password)}>Login</button>;
  }

  return (
    <div>
      Welcome, {profile?.fullName}!
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## API Endpoints Reference

### Users

```typescript
// Get current user profile
await apiClient.getUserProfile();

// Update profile
await apiClient.updateUserProfile({
  fullName: 'John Doe',
  phone: '+91 9999999999',
  avatarUrl: 'https://...'
});

// Get user by ID (public)
await apiClient.getUser(userId);
```

### Vehicles

```typescript
// Get all vehicles (with pagination)
await apiClient.getVehicles({
  page: 1,
  per_page: 12,
  type: 'car',
  location: 'Mumbai'
});

// Get single vehicle
await apiClient.getVehicle(vehicleId);

// Create vehicle
await apiClient.createVehicle({
  make: 'Toyota',
  model: 'Innova',
  year: 2023,
  registrationNumber: 'MH01AB1234',
  vehicleType: 'SUV',
  fuelType: 'petrol',
  dailyRate: 2000,
  location: 'Mumbai',
  images: [{ imageUrl: '...', imageType: 'front', isPrimary: true }],
  documents: [{ documentType: 'registration', documentUrl: '...' }]
});

// Update vehicle
await apiClient.updateVehicle(vehicleId, {
  dailyRate: 2500,
  location: 'Pune'
});

// Update availability
await apiClient.updateVehicleAvailability(vehicleId, true);

// Delete vehicle
await apiClient.deleteVehicle(vehicleId);

// Get owner's vehicles
await apiClient.getOwnerVehicles(ownerId);
```

### Bookings

```typescript
// Get all user bookings
await apiClient.getBookings();

// Get bookings by status
await apiClient.getBookings('confirmed');

// Get single booking
await apiClient.getBooking(bookingId);

// Create booking
await apiClient.createBooking({
  vehicleId: 'vehicle-id',
  agencyId: 'agency-id',
  startDate: '2025-01-15T10:00:00Z',
  endDate: '2025-01-20T10:00:00Z',
  pickupLocation: 'Mumbai Airport',
  dropoffLocation: 'Pune City',
  dailyRate: 2000,
  numberOfDays: 5,
  subtotal: 10000,
  tax: 1000,
  discount: 0,
  totalAmount: 11000,
  securityDeposit: 5000
});

// Update booking status
await apiClient.updateBookingStatus(bookingId, 'confirmed');

// Update payment status
await apiClient.updatePaymentStatus(bookingId, 'completed');

// Cancel booking
await apiClient.cancelBooking(bookingId);
```

### Agencies

```typescript
// Get all agencies
await apiClient.getAgencies({
  page: 1,
  per_page: 10,
  city: 'Mumbai'
});

// Get agency details
await apiClient.getAgency(agencyId);

// Create agency
await apiClient.createAgency({
  agencyName: 'Best Rentals',
  businessType: 'partnership',
  registrationNumber: 'REG123',
  gstNumber: 'GST123',
  agencyPhone: '+91 9999999999',
  city: 'Mumbai'
});

// Update agency
await apiClient.updateAgency(agencyId, {
  agencyName: 'Updated Name',
  city: 'Pune'
});
```

### KYC Verification

```typescript
// Get KYC status
await apiClient.getKYCStatus();

// Submit KYC documents
await apiClient.submitKYC({
  aadhaarNumber: '123456789012',
  aadhaarDocumentUrl: 'https://...',
  drivingLicenseNumber: 'DL123',
  dlDocumentUrl: 'https://...',
  dlExpiryDate: '2030-12-31',
  panNumber: 'ABCDE1234F',
  addressProofType: 'voter_id',
  addressProofUrl: 'https://...'
});

// Verify KYC (admin only)
await apiClient.verifyKYC(kycId, {
  aadhaarVerified: true,
  dlVerified: true,
  panVerified: true,
  addressVerified: true,
  verificationStatus: 'verified'
});
```

### Uploads

```typescript
// Upload one or more files (images/pdfs) to GCS
const { urls } = await apiClient.uploadFiles([file1, file2]);
// Returns array of public URLs
```

### Feedbacks

```typescript
// Submit feedback for a booking
await apiClient.submitFeedback({
  bookingId: '<booking-id>',
  rating: 5,
  comment: 'Great experience!'
});

// List feedbacks (optionally filter)
const feedbacks = await apiClient.getFeedbacks({ agency_id: '123' });
```

## Token Management

The API client automatically:

1. **Stores token** in localStorage when logging in
2. **Retrieves token** from localStorage on page load
3. **Includes token** in `Authorization` header for authenticated requests
4. **Clears token** when logging out

### Manual Token Operations

```typescript
// Set token manually
apiClient.setToken(token);

// Get current token
const token = apiClient.getToken();

// Clear token
apiClient.clearToken();
```

## Error Handling

The API client throws errors for failed requests. Handle them in your components:

```typescript
try {
  await apiClient.login(email, password);
} catch (error) {
  console.error('Login failed:', error.message);
  // Display error to user
}
```

In the AuthContext, errors are caught and returned:

```typescript
const { error } = await signIn(email, password);
if (error) {
  // Handle error
}
```

## Migrating Components

To update components that use Supabase:

### Before (Supabase)
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data } = await supabase
  .from('vehicles')
  .select('*')
  .eq('is_available', true);
```

### After (API Client)
```typescript
import { apiClient } from '@/services/api';

const { vehicles } = await apiClient.getVehicles();
```

## Common Patterns

### Fetching Data in Component

```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

export function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { vehicles } = await apiClient.getVehicles();
        setVehicles(vehicles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>{vehicle.make} {vehicle.model}</div>
      ))}
    </div>
  );
}
```

### Form Submission

```typescript
import { useState } from 'react';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function CreateVehicleForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await apiClient.createVehicle(formData);
      toast({ title: 'Vehicle created successfully' });
      // Redirect or refresh list
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* Form fields */}
      <button disabled={loading} type="submit">
        {loading ? 'Creating...' : 'Create Vehicle'}
      </button>
    </form>
  );
}
```

## Production Deployment

Update `.env` for production:

```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_FRONTEND_PORT=80
```

Or use environment-specific .env files:
- `.env.development` - Development settings
- `.env.production` - Production settings

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` in backend `.env` includes frontend URL
- Ensure frontend is running on the configured port

### Token Issues
- Clear localStorage and login again
- Check token expiration in backend config

### API Connection
- Verify backend is running on port 3000
- Check `VITE_API_URL` in frontend `.env`
- Use browser DevTools Network tab to inspect requests

## Next Steps

1. Replace all Supabase imports in components with `apiClient`
2. Remove Supabase client initialization from `src/integrations/supabase/`
3. Test all features with the Flask backend
4. Deploy backend and frontend on separate servers/ports
