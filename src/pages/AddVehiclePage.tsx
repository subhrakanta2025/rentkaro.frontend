import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';
import {
  Car,
  Bike,
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ImagePlus,
  Trash2,
  FileText,
  Shield,
  Check,
  ChevronsUpDown,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface VehicleForm {
  type: 'bike' | 'car';
  brand: string;
  model: string;
  color: string;
  year: string;
  registration_number: string;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'cng';
  seats: string;
  price_per_day: string;
  price_per_week?: string;
  city: string;
  features: string;
  name?: string;
  publish?: boolean;
  displacement?: string;
  top_speed?: string;
  fuel_capacity?: string;
  weight?: string;
  mileage?: string;
  late_fee_per_hr?: string;
  excess_per_km?: string;
}

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // 1: type/basic, 2: specs/pricing, 3: images, 4: documents (submit)

  const [formData, setFormData] = useState<VehicleForm>({
    type: 'bike',
    brand: '',
    model: '',
    color: '',
    year: new Date().getFullYear().toString(),
    registration_number: '',
    transmission: 'manual',
    fuel_type: 'petrol',
    seats: '2',
    price_per_day: '',
    city: '',
    features: '',
    price_per_week: '',
    publish: false,
    name: '',
    displacement: '',
    top_speed: '',
    fuel_capacity: '',
    weight: '',
    mileage: '',
    late_fee_per_hr: '',
    excess_per_km: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [rcDocument, setRcDocument] = useState<File | null>(null);
  const [insuranceDocument, setInsuranceDocument] = useState<File | null>(null);
  const [rcPreview, setRcPreview] = useState<string>('');
  const [insurancePreview, setInsurancePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Always start with true
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agencyCity, setAgencyCity] = useState<string>(''); // Agency's location for pickup
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [brands, setBrands] = useState<{ id: string; name: string; vehicle_type: string }[]>([]);
  const [models, setModels] = useState<{ id: string; name: string; brand_id: string }[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  const colorOptions = [
    'Black', 'White', 'Silver', 'Grey', 'Red', 'Blue', 'Green', 'Yellow',
    'Orange', 'Brown', 'Beige', 'Gold', 'Purple', 'Pearl White', 'Metallic Grey',
  ];

  const loadBrands = async (vehicleType: string) => {
    try {
      const resp = await apiClient.getCatalogBrands(vehicleType);
      setBrands(resp.brands || []);
    } catch (e) {
      console.error('Failed to load brands', e);
      setBrands([]);
    }
  };

  const loadModels = async (brandId: string) => {
    if (!brandId) {
      setModels([]);
      return;
    }
    try {
      const resp = await apiClient.getCatalogModels(brandId);
      setModels(resp.models || []);
    } catch (e) {
      console.error('Failed to load models', e);
      setModels([]);
    }
  };

  useEffect(() => {
    loadBrands(formData.type);
  }, [formData.type]);

  useEffect(() => {
    if (!formData.brand) {
      setSelectedBrandId('');
      setModels([]);
      return;
    }
    const matched = brands.find((b) => b.name.toLowerCase() === formData.brand.toLowerCase());
    if (matched && matched.id !== selectedBrandId) {
      setSelectedBrandId(matched.id);
    }
  }, [formData.brand, brands]);

  useEffect(() => {
    loadModels(selectedBrandId);
  }, [selectedBrandId]);

  useEffect(() => {
    fetchAgency();
    if (isEditing) {
      fetchVehicle();
    }
  }, [user, id]);

  const fetchAgency = async () => {
    try {
      const profileResp: any = await apiClient.getUserProfile();
      const agencyIdFromBackend = profileResp?.agencyStatus?.agencyId || profileResp?.agencyDetails?.id || null;
      if (agencyIdFromBackend) {
        setAgencyId(agencyIdFromBackend);
        // Fetch agency details to get location
        try {
          const agencyResp: any = await apiClient.getAgency(agencyIdFromBackend);
          const city = agencyResp?.agency?.city || agencyResp?.agency?.location || '';
          setAgencyCity(city);
          // Auto-set city in form
          if (city && !formData.city) {
            setFormData(prev => ({ ...prev, city }));
          }
        } catch (e) {
          console.error('Failed to fetch agency details:', e);
        }
        return agencyIdFromBackend;
      }
      setAgencyId(null);
      return null;
    } catch (error) {
      console.error('Error in fetchAgency (backend):', error);
      setAgencyId(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  const fetchVehicle = async () => {
    if (!id) return;
    try {
      const resp: any = await apiClient.getVehicle(id);
      const data = resp?.vehicle;
      if (!data) throw new Error('Vehicle not found');

      setFormData({
        name: data.name,
        type: (data.vehicleType || 'car') as 'bike' | 'car',
        brand: data.make,
        model: data.model,
        color: data.color || '',
        year: data.year?.toString() || '',
        registration_number: data.registrationNumber || '',
        transmission: (data.transmission || 'manual') as 'manual' | 'automatic',
        fuel_type: (data.fuelType || 'petrol') as 'petrol' | 'diesel' | 'electric' | 'cng',
        seats: data.seatingCapacity?.toString() || '2',
        price_per_day: data.dailyRate?.toString() || '',
        price_per_week: data.weeklyRate?.toString() || '',
        city: data.location || '',
        features: '',
        publish: data.isAvailable === true,
      });

      if (data.documents) {
        data.documents.forEach((doc: any) => {
          if (doc.documentType === 'registration') setRcPreview(doc.documentUrl);
          if (doc.documentType === 'insurance') setInsurancePreview(doc.documentUrl);
        });
      }

      if (data.images) {
        const imgs = data.images.map((i: any) => i.imageUrl).filter(Boolean);
        setExistingImages(imgs);
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast.error('Failed to load vehicle');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB.`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'rc' | 'insurance') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'rc') {
      setRcDocument(file);
      setRcPreview(file.name);
    } else {
      setInsuranceDocument(file);
      setInsurancePreview(file.name);
    }

    toast.success(`${type === 'rc' ? 'RC' : 'Insurance'} document uploaded`);
  };

  const removeDocument = (type: 'rc' | 'insurance') => {
    if (type === 'rc') {
      setRcDocument(null);
      setRcPreview('');
    } else {
      setInsuranceDocument(null);
      setInsurancePreview('');
    }
  };

  const uploadDocument = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append('files', file, file.name);
      const resp = await apiClient.post('/uploads', fd);
      if (resp && (resp as any).files && (resp as any).files.length) {
        return (resp as any).files[0].url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of images) {
      try {
        const fd = new FormData();
        fd.append('files', file, file.name);
        const resp = await apiClient.post('/uploads', fd);
        if (resp && (resp as any).files && (resp as any).files.length) {
          urls.push((resp as any).files[0].url);
        }
      } catch (e) {
        console.error('Backend upload failed:', e);
      }
    }

    return urls;
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1: // Vehicle Type & Basic Details
        return !!(formData.brand && formData.model && formData.color && formData.year && formData.registration_number);
      case 2: // Specifications & Pricing
        return !!(formData.transmission && formData.fuel_type && formData.price_per_day && formData.price_per_week);
      case 3: // Documents - allow progression; enforce at final submit
        return true;
      case 4: // Images
        return images.length > 0 || existingImages.length > 0;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error('Please complete all required fields in this step');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure we have an agency id; try fetching again before failing
    let resolvedAgencyId = agencyId;
    if (!resolvedAgencyId) {
      resolvedAgencyId = await fetchAgency();
      if (!resolvedAgencyId) {
        toast.error('Agency not found. Please complete agency setup first.', {
          action: {
            label: 'Setup Now',
            onClick: () => navigate('/agency/setup'),
          },
        });
        return;
      }
    }

    if (!formData.brand || !formData.model || !formData.price_per_day || !formData.price_per_week) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Use agency's city as location
    const vehicleCity = formData.city || agencyCity;

    if (!formData.registration_number) {
      toast.error('Registration number is required');
      return;
    }

    if (images.length === 0 && existingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!rcDocument && !rcPreview) {
      toast.error('Please upload RC document');
      return;
    }

    if (!insuranceDocument && !insurancePreview) {
      toast.error('Please upload Insurance document');
      return;
    }

    setIsLoading(true);

    try {
      // Upload new images
      const newImageUrls = await uploadImages();
      const allImages = [...existingImages, ...newImageUrls];

      // Upload documents
      let rcUrl = rcPreview;
      let insuranceUrl = insurancePreview;

      if (rcDocument) {
        const uploadedRcUrl = await uploadDocument(rcDocument, 'rc');
        if (uploadedRcUrl) rcUrl = uploadedRcUrl;
      }

      if (insuranceDocument) {
        const uploadedInsuranceUrl = await uploadDocument(insuranceDocument, 'insurance');
        if (uploadedInsuranceUrl) insuranceUrl = uploadedInsuranceUrl;
      }

      const vehicleData = {
        agency_id: resolvedAgencyId,
        // Vehicle display name is generated from brand + model if not provided
        name: formData.name && formData.name.length ? formData.name : `${formData.brand} ${formData.model}`,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: parseInt(formData.year) || null,
        registration_number: formData.registration_number.toUpperCase(),
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        seats: parseInt(formData.seats) || null,
        price_per_day: parseFloat(formData.price_per_day),
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        weekly_rate: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        city: vehicleCity,
        specifications: {
          displacement: formData.displacement || null,
          top_speed: formData.top_speed || null,
          fuel_capacity: formData.fuel_capacity || null,
          weight: formData.weight || null,
          late_fee_per_hr: formData.late_fee_per_hr ? parseFloat(formData.late_fee_per_hr) : null,
          excess_per_km: formData.excess_per_km ? parseFloat(formData.excess_per_km) : null,
        },
        // also include mileage at top-level for compatibility with backend schema
        mileage: formData.mileage ? parseFloat(formData.mileage.toString().replace(/[^0-9.]/g, '')) : null,
        image_url: allImages[0] || null,
        images: allImages,
        rc_document_url: rcUrl,
        insurance_document_url: insuranceUrl,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        is_available: !!formData.publish,
      };

      // Always use backend API
      const backendPayload = {
        agencyId: resolvedAgencyId,
        make: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || null,
        registrationNumber: formData.registration_number.toUpperCase(),
        vehicleType: formData.type,
        fuelType: formData.fuel_type,
        transmission: formData.transmission,
        color: formData.color,
        mileage: formData.mileage ? parseFloat(formData.mileage.toString().replace(/[^0-9.]/g, '')) : null,
        seatingCapacity: parseInt(formData.seats) || null,
        dailyRate: parseFloat(formData.price_per_day),
        weeklyRate: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        monthlyRate: null,
        securityDeposit: 0,
        location: vehicleCity,
        displacement: formData.displacement || null,
        topSpeed: formData.top_speed || null,
        fuelCapacity: formData.fuel_capacity || null,
        weight: formData.weight || null,
        lateFeePerHr: formData.late_fee_per_hr ? parseFloat(formData.late_fee_per_hr) : null,
        excessPerKm: formData.excess_per_km ? parseFloat(formData.excess_per_km) : null,
        timings: '7:00 AM - 10:00 PM',
        isAvailable: !!formData.publish,
        images: allImages.map((url, idx) => ({ imageUrl: url, imageType: idx === 0 ? 'primary' : 'gallery', isPrimary: idx === 0 })),
        documents: [
          { documentType: 'registration', documentUrl: rcUrl },
          { documentType: 'insurance', documentUrl: insuranceUrl },
        ],
      };

      try {
        if (isEditing) {
          await apiClient.updateVehicle(id!, backendPayload);
          toast.success('Vehicle updated successfully!');
        } else {
          await apiClient.createVehicle(backendPayload);
          toast.success('Vehicle added successfully!');
        }
      } catch (e: any) {
        console.error('Backend vehicle create/update failed:', e);
        throw e;
      }

      navigate('/agency/dashboard');
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(error.message || 'Failed to save vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardLayout title={isEditing ? 'Edit Vehicle' : 'Add Vehicle'} description="Add a new vehicle to your listings">
      <div className="container-dashboard">
        <div className="mx-auto max-w-xl">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  currentStep === step
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step
                    ? "bg-success text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div className={cn(
                    "h-0.5 w-16 mx-2 transition-colors",
                    currentStep > step ? "bg-success" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your vehicle details' : 'List a new vehicle for rent'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Vehicle Type & Basic Details */}
            {currentStep === 1 && (
              <>
                {/* Vehicle Type */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Vehicle Type</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-colors",
                        formData.type === 'bike'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setFormData({ ...formData, type: 'bike' })}
                    >
                      <Bike className={cn("h-8 w-8", formData.type === 'bike' ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium text-foreground">Bike</span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-colors",
                        formData.type === 'car'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setFormData({ ...formData, type: 'car' })}
                    >
                      <Car className={cn("h-8 w-8", formData.type === 'car' ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium text-foreground">Car</span>
                    </button>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Basic Details</h2>
                  <div className="space-y-4">
                    {/* Brand - Searchable */}
                    <div>
                      <Label>Brand <span className="text-destructive">*</span></Label>
                      <Popover open={openBrand} onOpenChange={setOpenBrand}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBrand}
                            className="w-full justify-between mt-1"
                          >
                            {formData.brand || "Select brand..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search brand..." value={brandSearch} onValueChange={setBrandSearch} />
                            <CommandList>
                              <CommandEmpty>No brand found.</CommandEmpty>
                              <CommandGroup>
                                {brands
                                  .filter((brand) => brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
                                  .map((brand) => (
                                  <CommandItem
                                    key={brand.id}
                                    value={brand.name}
                                    onSelect={() => {
                                      setFormData({ ...formData, brand: brand.name, model: '' });
                                      setSelectedBrandId(brand.id);
                                      setBrandSearch('');
                                      setOpenBrand(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.brand === brand.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {brand.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Model - Searchable (depends on brand) */}
                    <div>
                      <Label>Model <span className="text-destructive">*</span></Label>
                      <Popover open={openModel} onOpenChange={setOpenModel}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openModel}
                            className="w-full justify-between mt-1"
                            disabled={!formData.brand}
                          >
                            {formData.model || "Select model..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search model..." value={modelSearch} onValueChange={setModelSearch} />
                            <CommandList>
                              <CommandEmpty>No model found.</CommandEmpty>
                              <CommandGroup>
                                {models
                                  .filter((model) => model.name.toLowerCase().includes(modelSearch.toLowerCase()))
                                  .map((model) => (
                                  <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => {
                                      setFormData({ ...formData, model: model.name });
                                      setModelSearch('');
                                      setOpenModel(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.model === model.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {model.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Color - Searchable */}
                    <div>
                      <Label>Color <span className="text-destructive">*</span></Label>
                      <Popover open={openColor} onOpenChange={setOpenColor}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openColor}
                            className="w-full justify-between mt-1"
                          >
                            {formData.color || "Select color..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search color..." />
                            <CommandList>
                              <CommandEmpty>No color found.</CommandEmpty>
                              <CommandGroup>
                                {colorOptions.map((color) => (
                                  <CommandItem
                                    key={color}
                                    value={color}
                                    onSelect={() => {
                                      setFormData({ ...formData, color });
                                      setOpenColor(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.color === color ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {color}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
                        <Input id="year" name="year" type="number" placeholder="2024" value={formData.year} onChange={handleChange} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="registration_number">Registration Number <span className="text-destructive">*</span></Label>
                        <Input 
                          id="registration_number" 
                          name="registration_number" 
                          placeholder="e.g., MH12AB1234" 
                          value={formData.registration_number} 
                          onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                          className="mt-1" 
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Vehicle Name is autogenerated from brand+model; removed input per request */}

                    <div>
                      <Label htmlFor="seats">Seats</Label>
                      <Input id="seats" name="seats" type="number" placeholder="2" value={formData.seats} onChange={handleChange} className="mt-1" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Specifications & Pricing & Location */}
            {currentStep === 2 && (
              <>
                {/* Specifications */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transmission">Transmission</Label>
                      <select
                        id="transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fuel_type">Fuel Type</Label>
                      <select
                        id="fuel_type"
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="cng">CNG</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="displacement">Displacement</Label>
                      <Input id="displacement" name="displacement" placeholder="e.g., 125 cc" value={formData.displacement} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="top_speed">Top Speed</Label>
                      <Input id="top_speed" name="top_speed" placeholder="e.g., 100 kmph" value={formData.top_speed} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="fuel_capacity">Fuel Capacity</Label>
                      <Input id="fuel_capacity" name="fuel_capacity" placeholder="e.g., 11 L" value={formData.fuel_capacity} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <Input id="weight" name="weight" placeholder="e.g., 120 kg" value={formData.weight} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input id="mileage" name="mileage" placeholder="e.g., 60 kmpl or 80 kmph" value={formData.mileage} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="late_fee_per_hr">Late Fee (₹/hr)</Label>
                      <Input id="late_fee_per_hr" name="late_fee_per_hr" placeholder="e.g., 100" value={formData.late_fee_per_hr} onChange={handleChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="excess_per_km">Excess Charge (₹/km)</Label>
                      <Input id="excess_per_km" name="excess_per_km" placeholder="e.g., 4" value={formData.excess_per_km} onChange={handleChange} className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_per_day">Price per Day (₹) <span className="text-destructive">*</span></Label>
                      <Input
                        id="price_per_day"
                        name="price_per_day"
                        type="number"
                        placeholder="500"
                        value={formData.price_per_day}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_per_week">Price per Week (₹) <span className="text-destructive">*</span></Label>
                      <Input
                        id="price_per_week"
                        name="price_per_week"
                        type="number"
                        placeholder="3000"
                        value={formData.price_per_week}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  {/* Pickup Location Info */}
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Pickup Location:</span>
                      <span className="font-medium text-foreground">{agencyCity || 'Based on agency address'}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 ml-6">
                      Vehicle pickup location is automatically set from your agency profile
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="features">Features (comma separated)</Label>
                    <Textarea
                      id="features"
                      name="features"
                      placeholder="Helmet included, USB charger, Mobile holder"
                      value={formData.features}
                      onChange={handleChange}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: Document Verification */}
            {currentStep === 3 && (
              <>
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Vehicle Images</h2>
                  <p className="text-sm text-muted-foreground mb-4">Upload at least one clear photo of the vehicle (front view preferred)</p>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Current Images</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img src={url} alt={`Vehicle ${index + 1}`} className="w-full h-20 object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {previewUrls.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">New Images (preview)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}

            {/* STEP 4: Vehicle Images */}
            {currentStep === 4 && (
              <>
                {/* Document Verification */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Document Verification</h2>
                  <p className="text-sm text-muted-foreground mb-4">Upload RC and Insurance documents to verify your vehicle</p>
                  
                  <div className="space-y-4">
                    {/* RC Document */}
                    <div>
                      <Label>RC (Registration Certificate) <span className="text-destructive">*</span></Label>
                      <div className="mt-2">
                        {rcPreview ? (
                          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="text-sm text-foreground">{rcPreview.split('/').pop() || 'RC Document'}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument('rc')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Upload RC Document</p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentChange(e, 'rc')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Insurance Document */}
                    <div>
                      <Label>Insurance Document <span className="text-destructive">*</span></Label>
                      <div className="mt-2">
                        {insurancePreview ? (
                          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              <span className="text-sm text-foreground">{insurancePreview.split('/').pop() || 'Insurance Document'}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument('insurance')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Shield className="h-6 w-6 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Upload Insurance Document</p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentChange(e, 'insurance')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 4: final submit (documents step is the last step) */}

            <div className="mt-4 mb-4">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!formData.publish}
                  onChange={(e) => setFormData({ ...formData, publish: e.target.checked })}
                  className="h-5 w-5 rounded border-input"
                />
                <span className="text-sm font-medium">List this vehicle for rent</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">When checked, the vehicle will be available for booking immediately after saving.</p>
            </div>

            {/* Navigation and Submit Buttons */}
            <div className="flex gap-4 justify-between">
              {currentStep > 1 && currentStep < totalSteps && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep < totalSteps && (
                <Button 
                  type="button" 
                  variant="hero" 
                  onClick={goToNextStep}
                  className={`flex-1 gap-2 ${currentStep === 1 ? 'ml-auto' : ''}`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              {currentStep === totalSteps && (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={goToPreviousStep}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
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
                        {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                className={`flex-1 ${currentStep === totalSteps ? 'hidden' : ''}`}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}