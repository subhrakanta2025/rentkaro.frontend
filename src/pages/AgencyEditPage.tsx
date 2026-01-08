import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import {
  Building2,
  Phone,
  Mail,
  Loader2,
  Save,
  ArrowLeft,
} from 'lucide-react';
import LocationPickerMap from '@/components/LocationPickerMap';

interface AgencyFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
}

export default function AgencyEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<AgencyFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (id) {
      fetchAgencyDetails();
    }
  }, [id]);

  const fetchAgencyDetails = async () => {
    try {
      const resp: any = await apiClient.getAgency(id!);
      const agency = resp?.agency;
      if (agency) {
        setFormData({
          name: agency.agencyName || '',
          description: agency.description || '',
          address: agency.address || '',
          city: agency.city || '',
          state: agency.state || '',
          postalCode: agency.postalCode || '',
          phone: agency.agencyPhone || '',
          email: agency.agencyEmail || '',
          latitude: agency.latitude?.toString() || '',
          longitude: agency.longitude?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
      toast.error('Failed to load agency details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (lat: string, lng: string, address?: string, city?: string, state?: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      ...(address && { address }),
      ...(city && { city }),
      ...(state && { state }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.updateAgency(id!, {
        agencyName: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        city: formData.city,
        state: formData.state || null,
        postalCode: formData.postalCode || null,
        agencyPhone: formData.phone,
        agencyEmail: formData.email || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      toast.success('Agency profile updated successfully!');
      navigate('/agency/dashboard');
    } catch (error: any) {
      console.error('Error updating agency:', error);
      toast.error(error.message || 'Failed to update agency');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout title="Edit Agency" description="Update your agency details">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Agency Profile" description="Update your agency details">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-2"
          onClick={() => navigate('/agency/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Agency Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., City Bike Rentals"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell customers about your agency..."
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: value });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@agency.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location with Map */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Location & Address</h2>
            
            <div className="space-y-4">
              {/* Location Picker Map */}
              <LocationPickerMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
              />
              
              {/* Address Fields */}
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Shop/Office address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g., Hyderabad"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="e.g., Telangana"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="e.g., 500001"
                    value={formData.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setFormData({ ...formData, postalCode: value });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/agency/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
