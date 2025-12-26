# Frontend API Integration Guide

## Overview
All backend APIs from the Postman collection have been integrated into the React frontend. The integration includes:

### API Client Service (`src/services/api.ts`)
A centralized `APIClient` class that handles all HTTP requests to the backend with:
- Automatic token management (JWT)
- Header injection (Authorization, Content-Type)
- Error handling
- Request/response processing

### Auth Context (`src/contexts/AuthContext.tsx`)
Provides authentication state and methods to React components:
- User state management
- Profile management
- KYC status tracking
- Token lifecycle management

---

## API Methods Available

### 1. Authentication APIs

#### Register User
```typescript
apiClient.register(email, password, fullName, phone, role?)
```
- **Method**: POST `/auth/register`
- **Description**: Register new user and send OTP to email
- **Returns**: User object (not authenticated yet)

#### Activate Account with OTP
```typescript
apiClient.activateAccount(email, otp)
```
- **Method**: POST `/auth/activate`
- **Description**: Activate account with OTP received in email
- **Returns**: User object with activation confirmation

#### Resend OTP
```typescript
apiClient.resendOTP(email)
```
- **Method**: POST `/auth/resend-otp`
- **Description**: Resend OTP if previous one expired
- **Returns**: Success message

#### Login
```typescript
apiClient.login(email, password)
```
- **Method**: POST `/auth/login`
- **Description**: Login and receive JWT token
- **Returns**: User object + access_token
- **Note**: Token automatically stored in localStorage

#### Get Current User
```typescript
apiClient.getCurrentUser()
```
- **Method**: GET `/auth/me`
- **Description**: Get authenticated user info
- **Auth**: Required

#### Logout
```typescript
apiClient.logout()
```
- **Method**: POST `/auth/logout`
- **Description**: Logout user and clear token
- **Auth**: Required

#### Refresh Token
```typescript
apiClient.refreshToken()
```
- **Method**: POST `/auth/refresh`
- **Description**: Refresh expired JWT token
- **Auth**: Required

---

### 2. User APIs

#### Get Profile
```typescript
apiClient.getUserProfile()
```
- **Method**: GET `/users/profile`
- **Auth**: Required

#### Update Profile
```typescript
apiClient.updateUserProfile({ fullName, phone, avatarUrl })
```
- **Method**: PUT `/users/profile`
- **Auth**: Required

#### Get User by ID
```typescript
apiClient.getUser(userId)
```
- **Method**: GET `/users/{userId}`
- **Public**: No auth required

---

### 3. Vehicle APIs

#### Get All Vehicles
```typescript
apiClient.getVehicles({ page, per_page, type, location })
```
- **Method**: GET `/vehicles?page=1&per_page=12&type=SUV&location=Delhi`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 12)
  - `type`: Vehicle type filter (optional)
  - `location`: Location filter (optional)
- **Public**: No auth required

#### Get Vehicle by ID
```typescript
apiClient.getVehicle(vehicleId)
```
- **Method**: GET `/vehicles/{vehicleId}`
- **Public**: No auth required

#### Create Vehicle
```typescript
apiClient.createVehicle(vehicleData)
```
- **Method**: POST `/vehicles`
- **Auth**: Required
- **Body**: Vehicle details (make, model, year, rates, etc.)

#### Update Vehicle
```typescript
apiClient.updateVehicle(vehicleId, vehicleData)
```
- **Method**: PUT `/vehicles/{vehicleId}`
- **Auth**: Required

#### Delete Vehicle
```typescript
apiClient.deleteVehicle(vehicleId)
```
- **Method**: DELETE `/vehicles/{vehicleId}`
- **Auth**: Required

#### Update Availability
```typescript
apiClient.updateVehicleAvailability(vehicleId, isAvailable)
```
- **Method**: PUT `/vehicles/{vehicleId}/availability`
- **Auth**: Required

#### Get Owner Vehicles
```typescript
apiClient.getOwnerVehicles(ownerId)
```
- **Method**: GET `/vehicles/owner/{ownerId}`
- **Public**: No auth required

---

### 4. Booking APIs

#### Get Bookings
```typescript
apiClient.getBookings(status?)
```
- **Method**: GET `/bookings?status=confirmed`
- **Auth**: Required
- **Query Params**:
  - `status`: Filter by status (optional)

#### Get Booking by ID
```typescript
apiClient.getBooking(bookingId)
```
- **Method**: GET `/bookings/{bookingId}`
- **Auth**: Required

#### Create Booking
```typescript
apiClient.createBooking(bookingData)
```
- **Method**: POST `/bookings`
- **Auth**: Required

#### Update Booking Status
```typescript
apiClient.updateBookingStatus(bookingId, status)
```
- **Method**: PUT `/bookings/{bookingId}/status`
- **Auth**: Required
- **Status Options**: pending, confirmed, active, completed, cancelled

#### Update Payment Status
```typescript
apiClient.updatePaymentStatus(bookingId, paymentStatus)
```
- **Method**: PUT `/bookings/{bookingId}/payment-status`
- **Auth**: Required
- **Status Options**: pending, completed, refunded

#### Cancel Booking
```typescript
apiClient.cancelBooking(bookingId)
```
- **Method**: PUT `/bookings/{bookingId}/cancel`
- **Auth**: Required

---

### 5. Agency APIs

#### Get Agencies
```typescript
apiClient.getAgencies({ page, per_page, city })
```
- **Method**: GET `/agencies?page=1&per_page=10&city=Delhi`
- **Public**: No auth required

#### Get Agency by ID
```typescript
apiClient.getAgency(agencyId)
```
- **Method**: GET `/agencies/{agencyId}`
- **Public**: No auth required

#### Create Agency
```typescript
apiClient.createAgency(agencyData)
```
- **Method**: POST `/agencies`
- **Auth**: Required

#### Update Agency
```typescript
apiClient.updateAgency(agencyId, agencyData)
```
- **Method**: PUT `/agencies/{agencyId}`
- **Auth**: Required

---

### 6. KYC APIs

#### Get KYC Status
```typescript
apiClient.getKYCStatus()
```
- **Method**: GET `/kyc/status`
- **Auth**: Required

#### Submit KYC Documents
```typescript
apiClient.submitKYC(kycData)
```
- **Method**: POST `/kyc/submit`
- **Auth**: Required
- **Body**: Aadhaar, DL, PAN, Address proof details

#### Verify KYC (Admin)
```typescript
apiClient.verifyKYC(kycId, verificationData)
```
- **Method**: PUT `/kyc/verify/{kycId}`
- **Auth**: Required (Admin only)

---

## Using with React Components

### Example: Login Component
```tsx
import { useAuth } from '@/contexts/AuthContext';

export function LoginComponent() {
  const { signIn } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Login failed:', error);
    } else {
      // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Example: Registration with OTP
```tsx
import { useAuth } from '@/contexts/AuthContext';

export function RegisterComponent() {
  const { signUp, activateAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' | 'otp'

  const handleRegister = async () => {
    const { error } = await signUp(email, password, fullName, phone);
    if (!error) {
      setStep('otp'); // Show OTP verification screen
    }
  };

  const handleActivate = async () => {
    const { error } = await activateAccount(email, otp);
    if (!error) {
      // Account activated, redirect to login
    }
  };

  return (
    <>
      {step === 'register' ? (
        <div>
          {/* Registration form */}
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div>
          {/* OTP verification form */}
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={handleActivate}>Activate Account</button>
        </div>
      )}
    </>
  );
}
```

### Example: Vehicle Listing
```tsx
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

export function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await apiClient.getVehicles({ 
          page: 1, 
          per_page: 12,
          location: 'Delhi'
        });
        setVehicles(response.vehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vehicle-list">
      {vehicles.map(vehicle => (
        <div key={vehicle.id} className="vehicle-card">
          <h3>{vehicle.make} {vehicle.model}</h3>
          <p>₹{vehicle.dailyRate}/day</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Features

### ✅ Automatic Token Management
- Tokens automatically stored in localStorage
- Tokens automatically injected in Authorization headers
- Token refresh on expiry

### ✅ Error Handling
- Try-catch blocks around API calls
- Meaningful error messages
- Graceful error recovery

### ✅ OTP-Based Registration
- Register → Receive OTP → Activate → Login flow
- OTP resend capability
- Time-based OTP expiry (10 minutes)

### ✅ Complete CRUD Operations
- Create, Read, Update, Delete for all resources
- Pagination support for lists
- Filter and search support

### ✅ Authentication States
- User profile tracking
- KYC verification status
- Role-based access control ready

---

## Configuration

### Environment Variables
```env
# .env or .env.local
VITE_API_URL=http://localhost:3000/api
```

Default value: `http://localhost:3000/api`

---

## Next Steps

1. Create OTP verification page component
2. Add OTP input component for activation flow
3. Update login/register pages to use new methods
4. Create vehicle management pages
5. Implement booking flow UI
6. Add KYC verification forms
7. Build agency management dashboard

All API methods are ready to use! 🚀
