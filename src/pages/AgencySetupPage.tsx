import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Bike,
  IndianRupee,
  Upload,
  X,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Agency Profile', icon: Building2 },
  { id: 2, name: 'Add Vehicle', icon: Bike },
  { id: 3, name: 'Set Pricing', icon: IndianRupee },
];

const vehicleTypes = ['Scooter', 'Bike', 'Sports Bike', 'Cruiser', 'Electric'];
const fuelTypes = ['Petrol', 'Electric', 'CNG'];
const transmissionTypes = ['Automatic', 'Manual'];

export default function AgencySetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log('AgencySetupPage: Rendering, user:', user?.id);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  // Pre-fill from registration if available
  const pendingData = typeof window !== 'undefined' ? localStorage.getItem('pendingAgencyData') : null;
  const parsedPendingData = pendingData ? JSON.parse(pendingData) : {};

  // Step 1: Agency data
  const [agencyData, setAgencyData] = useState({
    name: parsedPendingData.agencyName || '',
    description: parsedPendingData.description || '',
    address: parsedPendingData.address || '',
    city: parsedPendingData.city || '',
    state: parsedPendingData.state || '',
    phone: '',
    email: '',
  });

  // Clear pending data from localStorage after first load
  useEffect(() => {
    if (pendingData) {
      localStorage.removeItem('pendingAgencyData');
    }
  }, [pendingData]);

  // Step 2: Vehicle data
  const [vehicleData, setVehicleData] = useState({
    name: '',
    brand: '',
    model: '',
    type: '',
    year: new Date().getFullYear(),
    seats: 2,
    transmission: '',
    fuelType: '',
    features: '',
  });

  // Step 2: Vehicle images
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Pricing data
  const [pricingData, setPricingData] = useState({
    pricePerDay: '',
    deposit: '',
    kmLimit: '100',
    extraKmCharge: '5',
  });

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAgencyData({ ...agencyData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPricingData({ ...pricingData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (vehicleImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setVehicleImages([...vehicleImages, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of vehicleImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleStep1Submit = async () => {
    console.log('Step 1 Submit - Creating agency with data:', agencyData);
    if (!agencyData.name || !agencyData.city || !agencyData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('agencies')
        .insert({
          user_id: user!.id,
          name: agencyData.name,
          description: agencyData.description || null,
          address: agencyData.address || null,
          city: agencyData.city,
          state: agencyData.state || null,
          phone: agencyData.phone,
          email: agencyData.email || user?.email,
        })
        .select('id')
        .single();

      if (error) throw error;

      console.log('Agency created successfully:', data.id);
      setAgencyId(data.id);
      toast.success('Agency profile created!');
      setCurrentStep(2);
    } catch (error: any) {
      console.error('Error creating agency:', error);
      toast.error(error.message || 'Failed to create agency profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    console.log('Step 2 Submit - Adding vehicle');
    if (!vehicleData.name || !vehicleData.brand || !vehicleData.model || !vehicleData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (vehicleImages.length === 0) {
      toast.error('Please upload at least one vehicle image');
      return;
    }

    setIsLoading(true);

    try {
      // Upload images
      const imageUrls = await uploadImages();

      // Create vehicle
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          agency_id: agencyId!,
          name: vehicleData.name,
          brand: vehicleData.brand,
          model: vehicleData.model,
          type: vehicleData.type,
          year: vehicleData.year,
          seats: vehicleData.seats,
          transmission: vehicleData.transmission || null,
          fuel_type: vehicleData.fuelType || null,
          features: vehicleData.features ? vehicleData.features.split(',').map(f => f.trim()) : null,
          image_url: imageUrls[0],
          images: imageUrls,
          city: agencyData.city,
          price_per_day: 0, // Will be set in step 3
          is_available: false, // Will be enabled after pricing
        })
        .select('id')
        .single();

      if (error) throw error;

      setVehicleId(data.id);
      toast.success('Vehicle added! Now set your pricing.');
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (!pricingData.pricePerDay) {
      toast.error('Please set a daily rental price');
      return;
    }

    const price = parseFloat(pricingData.pricePerDay);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsLoading(true);

    try {
      // Update vehicle with pricing
      const { error } = await supabase
        .from('vehicles')
        .update({
          price_per_day: price,
          is_available: true,
        })
        .eq('id', vehicleId!);

      if (error) throw error;

      toast.success('Setup complete! Your vehicle is now listed.');
      navigate('/agency/kyc');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save pricing');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Set Up Your Agency</h1>
            <p className="mt-2 text-muted-foreground">
              Complete these steps to start listing vehicles
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.id
                      ? "bg-success text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "mt-2 text-xs font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-16 mx-2 transition-colors",
                    currentStep > step.id ? "bg-success" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            {/* Step 1: Agency Profile */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Agency Profile</h2>
                </div>

                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    Agency Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., City Bike Rentals"
                    value={agencyData.name}
                    onChange={handleAgencyChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell customers about your agency..."
                    value={agencyData.description}
                    onChange={handleAgencyChange}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city" className="mb-2 block">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g., Hyderabad"
                      value={agencyData.city}
                      onChange={handleAgencyChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="mb-2 block">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="e.g., Telangana"
                      value={agencyData.state}
                      onChange={handleAgencyChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="mb-2 block">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Shop/Office address"
                    value={agencyData.address}
                    onChange={handleAgencyChange}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone" className="mb-2 block">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit number"
                      value={agencyData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setAgencyData({ ...agencyData, phone: value });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-2 block">Business Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contact@agency.com"
                      value={agencyData.email}
                      onChange={handleAgencyChange}
                    />
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleStep1Submit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Agency...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: Add Vehicle */}
            {currentStep === 2 && (
              <div className="animate-fade-in space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <Bike className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Add Your First Vehicle</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="vehicleName" className="mb-2 block">
                      Vehicle Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="vehicleName"
                      name="name"
                      placeholder="e.g., Honda Activa 6G"
                      value={vehicleData.name}
                      onChange={handleVehicleChange}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={vehicleData.type}
                      onValueChange={(value) => setVehicleData({ ...vehicleData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="brand" className="mb-2 block">
                      Brand <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="e.g., Honda"
                      value={vehicleData.brand}
                      onChange={handleVehicleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="mb-2 block">
                      Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="model"
                      name="model"
                      placeholder="e.g., Activa 6G"
                      value={vehicleData.model}
                      onChange={handleVehicleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="year" className="mb-2 block">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={vehicleData.year}
                      onChange={(e) => setVehicleData({ ...vehicleData, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Transmission</Label>
                    <Select
                      value={vehicleData.transmission}
                      onValueChange={(value) => setVehicleData({ ...vehicleData, transmission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Fuel Type</Label>
                    <Select
                      value={vehicleData.fuelType}
                      onValueChange={(value) => setVehicleData({ ...vehicleData, fuelType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="mb-2 block">
                    Vehicle Photos <span className="text-destructive">*</span>
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {imagePreviews.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload up to 5 images (max 5MB each)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-20 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.length < 5 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {imagePreviews.length}/5 photos uploaded
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="features" className="mb-2 block">Features (comma separated)</Label>
                  <Input
                    id="features"
                    name="features"
                    placeholder="e.g., USB charging, Mobile holder, Helmet"
                    value={vehicleData.features}
                    onChange={handleVehicleChange}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={goBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleStep2Submit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Set Pricing */}
            {currentStep === 3 && (
              <div className="animate-fade-in space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Set Your Pricing</h2>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      {imagePreviews[0] ? (
                        <img src={imagePreviews[0]} alt="Vehicle" className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <Bike className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{vehicleData.name}</p>
                      <p className="text-sm text-muted-foreground">{vehicleData.brand} {vehicleData.model}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pricePerDay" className="mb-2 block">
                    Daily Rental Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="pricePerDay"
                      name="pricePerDay"
                      type="number"
                      min="0"
                      placeholder="e.g., 350"
                      className="pl-8"
                      value={pricingData.pricePerDay}
                      onChange={handlePricingChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the base price per day (excluding GST)
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="deposit" className="mb-2 block">Security Deposit</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="deposit"
                        name="deposit"
                        type="number"
                        min="0"
                        placeholder="e.g., 1000"
                        className="pl-8"
                        value={pricingData.deposit}
                        onChange={handlePricingChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="kmLimit" className="mb-2 block">Daily KM Limit</Label>
                    <div className="relative">
                      <Input
                        id="kmLimit"
                        name="kmLimit"
                        type="number"
                        min="0"
                        placeholder="e.g., 100"
                        value={pricingData.kmLimit}
                        onChange={handlePricingChange}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">km</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="extraKmCharge" className="mb-2 block">Extra KM Charge</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="extraKmCharge"
                      name="extraKmCharge"
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      className="pl-8"
                      value={pricingData.extraKmCharge}
                      onChange={handlePricingChange}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/km</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Almost there!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        After this, you'll complete KYC verification and your vehicle will be live.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={goBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleStep3Submit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete & Continue to KYC
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
