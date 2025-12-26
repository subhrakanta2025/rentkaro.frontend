/**
 * API Service for Ride India Rentals
 * Handles all HTTP requests to the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rentkaro-backend-807261496773.us-central1.run.app/api';

class APIClient {
  private token = '';

  constructor() {
    // Prefer persisted login; fall back to session if present
    this.token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
    sessionStorage.setItem('access_token', token);
  }

  getToken(): string {
    return this.token;
  }

  clearToken(): void {
    this.token = '';
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('access_token');
  }

  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private getFormHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {};

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = true
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('[APIClient] Making request to:', url);
    
    const headers = this.getHeaders(includeAuth);
    const config: RequestInit = {
      ...options,
      headers: headers as HeadersInit,
    };

    console.log('[APIClient] Request config:', { method: config.method, headers });
    
    const response = await fetch(url, config);
    console.log('[APIClient] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[APIClient] Error response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[APIClient] Response data:', data);
    return data;
  }

  async post<T>(endpoint: string, body?: FormData | Record<string, any>, includeAuth = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = body instanceof FormData;
    const headers = isFormData ? this.getFormHeaders(includeAuth) : this.getHeaders(includeAuth);

    const config: RequestInit = {
      method: 'POST',
      headers: headers as HeadersInit,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, body?: Record<string, any>, includeAuth = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const config: RequestInit = {
      method: 'PUT',
      headers: headers as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const config: RequestInit = {
      method: 'GET',
      headers: headers as HeadersInit,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const config: RequestInit = {
      method: 'DELETE',
      headers: headers as HeadersInit,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: 'customer' | 'agency' = 'customer'
  ) {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName,
        phone,
        role,
      }),
    }, false);

    return response;
  }

  async activateAccount(email: string, otp: string) {
    return this.request<any>('/auth/activate', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }, false);
  }

  async resendOTP(email: string) {
    return this.request<any>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);
  }

  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);
  }

  async resendPasswordReset(email: string) {
    return this.request('/auth/resend-reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);
  }

  async resetPassword(payload: { token: string; password: string }) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false);
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async refreshToken() {
    const response = await this.request<any>('/auth/refresh', {
      method: 'POST',
    });

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile', { method: 'GET' });
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`, { method: 'GET' }, false);
  }

  // Vehicle endpoints
  async getVehicles(params?: {
    page?: number;
    per_page?: number;
    type?: string;
    location?: string;
    wheelers?: '2' | '4' | '2w' | '4w' | 'two' | 'four';
    search?: string;
  }) {
    const queryString = new URLSearchParams();
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.per_page) queryString.append('per_page', params.per_page.toString());
    if (params?.type) queryString.append('type', params.type);
    if (params?.location) queryString.append('location', params.location);
    if (params?.wheelers) queryString.append('wheelers', params.wheelers);
    if (params?.search) queryString.append('q', params.search);

    const endpoint = queryString.toString() 
      ? `/vehicles?${queryString.toString()}`
      : '/vehicles';

    return this.request(endpoint, { method: 'GET' }, false);
  }

  async getVehicle(vehicleId: string) {
    return this.request(`/vehicles/${vehicleId}`, { method: 'GET' }, false);
  }

  async createVehicle(vehicleData: any) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(vehicleId: string, vehicleData: any) {
    return this.request(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicleAvailability(vehicleId: string, isAvailable: boolean) {
    return this.request(`/vehicles/${vehicleId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  }

  async deleteVehicle(vehicleId: string) {
    return this.request(`/vehicles/${vehicleId}`, { method: 'DELETE' });
  }

  async getOwnerVehicles(ownerId: string) {
    return this.request(`/vehicles/owner/${ownerId}`, { method: 'GET' }, false);
  }

  // Booking endpoints
  async getBookings(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    search?: string;
    vehicleType?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.startDate) query.append('start_date', params.startDate);
    if (params?.endDate) query.append('end_date', params.endDate);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('q', params.search);
    if (params?.vehicleType) query.append('vehicle_type', params.vehicleType);
    const endpoint = query.toString() ? `/bookings?${query.toString()}` : '/bookings';
    return this.request(endpoint, { method: 'GET' });
  }

  async checkVehicleAvailability(vehicleId: string, startDate: string, endDate: string) {
    const query = new URLSearchParams({
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate,
    });
    return this.request(`/bookings/availability?${query.toString()}`, { method: 'GET' });
  }

  async getBooking(bookingId: string) {
    return this.request(`/bookings/${bookingId}`, { method: 'GET' });
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(bookingId: string, paymentStatus: string) {
    return this.request(`/bookings/${bookingId}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
    });
  }

  async cancelBooking(bookingId: string) {
    return this.request(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
  }

  // Payment endpoints (Razorpay)
  async createPaymentOrder(payload: { bookingId: string; amountPaise?: number }) {
    return this.request('/bookings/payment/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyPayment(payload: any) {
    return this.request('/bookings/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async failPayment(payload: any) {
    return this.request('/bookings/payment/fail', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Agency endpoints
  async getAgencies(params?: { page?: number; per_page?: number; city?: string }) {
    const queryString = new URLSearchParams();
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.per_page) queryString.append('per_page', params.per_page.toString());
    if (params?.city) queryString.append('city', params.city);

    const endpoint = queryString.toString()
      ? `/agencies?${queryString.toString()}`
      : '/agencies';

    return this.request(endpoint, { method: 'GET' }, false);
  }

  async getAgency(agencyId: string) {
    return this.request(`/agencies/${agencyId}`, { method: 'GET' }, false);
  }

  async createAgency(agencyData: any) {
    return this.request('/agencies', {
      method: 'POST',
      body: JSON.stringify(agencyData),
    });
  }

  async updateAgency(agencyId: string, agencyData: any) {
    return this.request(`/agencies/${agencyId}`, {
      method: 'PUT',
      body: JSON.stringify(agencyData),
    });
  }

  // KYC endpoints
  async getKYCStatus() {
    return this.request('/kyc/status', { method: 'GET' });
  }

  async submitKYC(kycData: any) {
    return this.request('/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async verifyKYC(kycId: string, verificationData: any): Promise<any> {
    return this.request(`/kyc/verify/${kycId}`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    });
  }

  async getCities(search?: string) {
    const query = search?.trim() ? `?q=${encodeURIComponent(search.trim())}` : '';
    return this.request<{ cities: { id: string; name: string; slug: string }[] }>(
      `/cities${query}`,
      { method: 'GET' },
      false,
    );
  }

  // Catalog endpoints
  async getCatalogBrands(vehicleType?: string) {
    const query = vehicleType ? `?vehicle_type=${encodeURIComponent(vehicleType)}` : '';
    return this.request<{ brands: { id: string; name: string; vehicle_type: string }[] }>(
      `/catalog/brands${query}`,
      { method: 'GET' },
      false,
    );
  }

  async getCatalogModels(brandId: string) {
    return this.request<{ models: { id: string; name: string; brand_id: string }[] }>(
      `/catalog/brands/${brandId}/models`,
      { method: 'GET' },
      false,
    );
  }

  async getAgencyEarnings(range?: 'week' | 'month' | 'year') {
    const query = range ? `?range=${encodeURIComponent(range)}` : '';
    return this.request(
      `/agencies/earnings${query}`,
      { method: 'GET' },
    );
  }
}

export const apiClient = new APIClient();
