import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Building2,
  FileText,
  ArrowRight,
  Loader2,
  CreditCard,
  Receipt,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgencyKYC {
  id: string;
  agency_id: string;
  pan_number: string | null;
  pan_verified: boolean | null;
  pan_document_url: string | null;
  gst_number: string | null;
  gst_verified: boolean | null;
  gst_document_url: string | null;
  business_license: string | null;
  license_verified: boolean | null;
  license_document_url: string | null;
  verification_status: string | null;
}

export default function AgencyKYCPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'aadhaar' | 'dl' | 'complete'>('aadhaar');
  const [isVerifying, setIsVerifying] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [kycData, setKycData] = useState<AgencyKYC | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // File upload states
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [dlPreview, setDlPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const dlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      checkAgencyAndKYC();
    }
  }, [user]);

  const checkAgencyAndKYC = async () => {
    try {
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (agencyError) throw agencyError;

      if (!agency) {
        toast.info('Please set up your agency profile first');
        navigate('/agency/setup');
        return;
      }

      setAgencyId(agency.id);

      const { data: kyc, error: kycError } = await supabase
        .from('agency_kyc')
        .select('*')
        .eq('agency_id', agency.id)
        .maybeSingle();

      if (kycError && kycError.code !== 'PGRST116') throw kycError;

      if (kyc) {
        setKycData(kyc as AgencyKYC);
        
        if (kyc.verification_status === 'verified') {
          setStep('complete');
        } else if (kyc.pan_verified && !kyc.gst_verified) {
          setStep('dl');
        } else {
          setStep('aadhaar');
        }
      }
    } catch (error: any) {
      console.error('Error checking agency/KYC:', error);
      toast.error('Failed to load KYC status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, WebP) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = (
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File, documentType: string): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload ${documentType} document`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAadhaarSubmit = async () => {
    if (!aadhaarFile) {
      toast.error('Please upload your Aadhaar photo');
      return;
    }

    setIsVerifying(true);
    setIsUploading(true);

    try {
      // Upload document
      const documentUrl = await uploadFile(aadhaarFile, 'aadhaar');

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('agency_kyc')
        .upsert({
          agency_id: agencyId!,
          pan_number: 'aadhaar_verified',
          pan_verified: true,
          pan_document_url: documentUrl,
          verification_status: 'pending',
        }, {
          onConflict: 'agency_id'
        });

      if (error) throw error;

      toast.success('Aadhaar photo uploaded successfully!');
      setStep('dl');
      await checkAgencyAndKYC();
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
      setIsUploading(false);
    }
  };

  const handleDLSubmit = async () => {
    if (!dlFile) {
      toast.error('Please upload your Driver License photo');
      return;
    }

    setIsVerifying(true);
    setIsUploading(true);

    try {
      // Upload document
      const documentUrl = await uploadFile(dlFile, 'dl');

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('agency_kyc')
        .upsert({
          agency_id: agencyId!,
          gst_number: 'dl_verified',
          gst_verified: true,
          gst_document_url: documentUrl,
          verification_status: 'verified',
        }, {
          onConflict: 'agency_id'
        });

      if (error) throw error;

      toast.success('Driver License photo verified! KYC complete!');
      setStep('complete');
      await checkAgencyAndKYC();
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
      setIsUploading(false);
    }
  };



  const handleContinue = () => {
    navigate('/agency/dashboard');
  };

  const handleAddVehicle = () => {
    navigate('/agency/add-vehicle');
  };

  const FileUploadBox = ({
    file,
    preview,
    onFileSelect,
    onRemove,
    inputRef,
    label,
  }: {
    file: File | null;
    preview: string | null;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="block">{label} <span className="text-destructive">*</span></Label>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={onFileSelect}
        className="hidden"
      />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WebP or PDF (max 5MB)
          </p>
        </div>
      ) : (
        <div className="relative border border-border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Agency KYC Verification" description="Verify your business documents to list vehicles">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Agency KYC Verification" description="Verify your business documents to list vehicles">
        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Agency KYC Verification</h1>
            <p className="mt-2 text-muted-foreground">
              Verify your business documents to list vehicles
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                step === 'aadhaar' ? "bg-primary text-primary-foreground" :
                kycData?.pan_verified ? "bg-success text-white" : "bg-muted text-muted-foreground"
              )}>
                {kycData?.pan_verified ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium text-foreground">Aadhaar Photo</span>
            </div>
            <div className="h-0.5 w-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                step === 'dl' ? "bg-primary text-primary-foreground" :
                kycData?.gst_verified ? "bg-success text-white" : "bg-muted text-muted-foreground"
              )}>
                {kycData?.gst_verified ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-sm font-medium text-foreground">DL Photo</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            {step === 'aadhaar' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upload Aadhaar Photo
                  </h2>
                </div>

                <div className="space-y-4">
                  <FileUploadBox
                    file={aadhaarFile}
                    preview={aadhaarPreview}
                    onFileSelect={(e) => handleFileSelect(e, setAadhaarFile, setAadhaarPreview)}
                    onRemove={() => removeFile(setAadhaarFile, setAadhaarPreview, aadhaarInputRef)}
                    inputRef={aadhaarInputRef}
                    label="Upload Clear Aadhaar Photo"
                  />

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Important: Clear Photo Required
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please upload a clear, well-lit photo of your Aadhaar card. All details should be visible.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleAadhaarSubmit}
                    disabled={isVerifying || isUploading}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Verifying...'}
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

            {step === 'dl' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upload Driving License Photo
                  </h2>
                </div>

                <div className="space-y-4">
                  <FileUploadBox
                    file={dlFile}
                    preview={dlPreview}
                    onFileSelect={(e) => handleFileSelect(e, setDlFile, setDlPreview)}
                    onRemove={() => removeFile(setDlFile, setDlPreview, dlInputRef)}
                    inputRef={dlInputRef}
                    label="Upload Clear Driving License Photo"
                  />

                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Almost Done!
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          After uploading your Driving License photo, your KYC will be complete and you can start listing vehicles.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleDLSubmit}
                    disabled={isVerifying || isUploading}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Verifying...'}
                      </>
                    ) : (
                      <>
                        Complete KYC
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="animate-fade-in text-center py-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Agency Verified!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your agency KYC is complete. You can now list your vehicles on RentKaro.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={handleContinue}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="gap-2"
                    onClick={handleAddVehicle}
                  >
                    Add Vehicle
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By verifying, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
    </DashboardLayout>
  );
}
