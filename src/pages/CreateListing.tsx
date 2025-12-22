import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  X,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Building2,
  Shield,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  listingFormSchema,
  propertyTypes,
  listingTypes,
  completionStatuses,
  furnishingStatuses,
  sellerTypes,
  bangladeshCities,
  dhakaAreas,
  amenitiesList,
} from '@/types/schema';
import {
  getAllCategories,
  getCategoryFilters,
  type ListingCategory,
} from '@/lib/categoryMapping';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type ListingFormData = z.infer<typeof listingFormSchema>;

interface UploadedImage {
  url: string;
  publicId: string;
  file?: File;
}

const steps = [
  { id: 1, title: 'Category & Info', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Property Details', icon: Building2 },
  { id: 4, title: 'Building Details', icon: Building2 },
  { id: 5, title: 'Amenities & Security', icon: Shield },
  { id: 6, title: 'Pricing & Seller', icon: DollarSign },
  { id: 7, title: 'Media & Contact', icon: Phone },
];

function CreateListingContent() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<
    ListingCategory | ''
  >('');
  const [priceType, setPriceType] = useState<'numeric' | 'text'>('numeric');

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    mode: 'onChange', // Validate on change to show errors immediately
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      listingType: 'sale',
      propertyType: 'apartment',
      bedrooms: undefined,
      bathrooms: undefined,
      areaSqFt: undefined,
      address: '',
      city: 'Dhaka',
      district: '',
      area: '',
      amenities: [],
      images: [],
      // New boolean fields
      negotiable: false,
      security24x7: false,
      cctv: false,
      generatorBackup: false,
      fireSafety: false,
      liftAvailable: false,
      isPhoneHidden: false,
      whatsappEnabled: false,
      chatEnabled: true,
    },
  });

  // Upload images to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > 10) {
      toast({
        title: 'Too Many Images',
        description: 'You can upload a maximum of 10 images.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Show persistent upload progress toast with loading indicator
    const uploadToast = toast({
      title: 'Uploading Images...',
      description: `Uploading ${files.length} image(s). Please wait...`,
      duration: Infinity, // Keep toast visible until dismissed
    });

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Upload to server (which uploads to Cloudinary)
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();

      // Add uploaded images to state
      const newImages: UploadedImage[] = data.images.map((img: any) => ({
        url: img.url,
        publicId: img.publicId,
      }));

      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);

      // CRITICAL: Sync with form's images field for validation
      form.setValue(
        'images',
        updatedImages.map(img => img.url),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );

      setUploadProgress(100);

      // Dismiss the loading toast and show success toast
      uploadToast.dismiss();

      toast({
        title: 'Upload Complete!',
        description: `${files.length} image(s) uploaded successfully.`,
        duration: 3000,
      });

      console.log(
        'Images uploaded and synced with form:',
        updatedImages.length
      );
    } catch (error: any) {
      console.error('Upload error:', error);

      // Dismiss the loading toast before showing error
      uploadToast.dismiss();

      toast({
        title: 'Upload Failed',
        description:
          error.message || 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      e.target.value = '';
    }
  };

  // Remove an uploaded image
  const removeImage = async (index: number) => {
    const image = uploadedImages[index];

    try {
      // Delete from Cloudinary
      const token = localStorage.getItem('accessToken');
      if (token && image.publicId) {
        await fetch(
          `/api/upload/images/${encodeURIComponent(image.publicId)}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Remove from state
      const updatedImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(updatedImages);

      // CRITICAL: Sync with form's images field for validation
      form.setValue(
        'images',
        updatedImages.map(img => img.url),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );

      toast({
        title: 'Image Removed',
        description: 'Image deleted successfully.',
      });

      console.log(
        'Image removed and synced with form. Remaining:',
        updatedImages.length
      );
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image.',
        variant: 'destructive',
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Validate current step before moving to next
  const validateStep = async (step: number): Promise<boolean> => {
    let fields: (keyof ListingFormData)[] = [];

    switch (step) {
      case 1: // Category & Core Info
        fields = ['title', 'propertyType', 'listingType'];
        break;
      case 2: // Location
        fields = ['city', 'address'];
        break;
      case 3: // Property Details
        fields = ['areaSqFt'];
        break;
      case 4: // Building Details (all optional)
        return true;
      case 5: // Amenities & Security (all optional)
        return true;
      case 6: // Pricing & Seller
        fields = ['price'];
        break;
      case 7: // Media & Contact
        // Images validation - check both state and form field
        const formImages = form.getValues('images') || [];
        if (uploadedImages.length === 0 || formImages.length === 0) {
          console.error('Image validation failed:', {
            uploadedImagesCount: uploadedImages.length,
            formImagesCount: formImages.length,
          });
          toast({
            title: 'No Images',
            description: 'Please upload at least one image.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
    }

    const result = await form.trigger(fields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validate all steps before final submission
  const validateAllSteps = async (): Promise<boolean> => {
    console.log('Validating all steps...');
    const invalidSteps: number[] = [];

    for (let step = 1; step <= steps.length; step++) {
      const isValid = await validateStep(step);
      if (!isValid) {
        invalidSteps.push(step);
        console.error(`Step ${step} validation failed`);
      }
    }

    if (invalidSteps.length > 0) {
      const firstInvalidStep = invalidSteps[0];
      setCurrentStep(firstInvalidStep);

      toast({
        title: 'Validation Failed',
        description: `Please complete all required fields. Check step ${firstInvalidStep}: ${
          steps[firstInvalidStep - 1].title
        }`,
        variant: 'destructive',
      });

      return false;
    }

    console.log('All steps validated successfully');
    return true;
  };

  const onSubmit = async (data: ListingFormData) => {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data received:', data);
    console.log('Form errors:', form.formState.errors);
    console.log('Uploaded images count:', uploadedImages.length);
    console.log('Form images field:', data.images);
    console.log('Selected amenities:', selectedAmenities);

    // Validate all steps before submission
    const allStepsValid = await validateAllSteps();
    if (!allStepsValid) {
      console.error('Validation failed for one or more steps');
      return;
    }

    // Final validation for images - check both state and form data
    if (
      uploadedImages.length === 0 ||
      !data.images ||
      data.images.length === 0
    ) {
      console.error('No images uploaded:', {
        uploadedImagesCount: uploadedImages.length,
        formImagesCount: data.images?.length || 0,
      });
      toast({
        title: 'No Images',
        description: 'Please upload at least one image.',
        variant: 'destructive',
      });
      setCurrentStep(7);
      return;
    }

    setIsSubmitting(true);
    try {
      const listingData = {
        ...data,
        amenities: selectedAmenities,
        images: uploadedImages.map(img => img.url),
        postedBy: user?.id,
        status: 'pending',
      };

      console.log('=== SUBMITTING TO API ===');
      console.log('Listing data:', JSON.stringify(listingData, null, 2));

      await apiRequest('POST', '/api/listings', listingData);

      console.log('=== SUBMISSION SUCCESSFUL ===');

      toast({
        title: 'Property Listed!',
        description: 'Your property has been submitted for review.',
      });

      // Reset form and clear all states
      form.reset();
      setUploadedImages([]);
      setSelectedAmenities([]);
      setCurrentStep(1);

      queryClient.invalidateQueries({ queryKey: ['/api/listings/my'] });
      setLocation('/dashboard');
    } catch (error: any) {
      console.error('=== SUBMISSION FAILED ===');
      console.error('Error details:', error);

      toast({
        title: 'Error',
        description:
          error.message || 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION ENDED ===');
    }
  };

  // Get validation errors for current step
  const getStepErrors = (step: number): string[] => {
    const errors: string[] = [];
    const formErrors = form.formState.errors;

    switch (step) {
      case 1: // Category & Core Info
        if (formErrors.title)
          errors.push(formErrors.title.message || 'Title error');
        if (formErrors.listingType) errors.push('Listing type is required');
        if (formErrors.propertyType) errors.push('Property type is required');
        break;
      case 2: // Location
        if (formErrors.city)
          errors.push(formErrors.city.message || 'City error');
        if (formErrors.address)
          errors.push(formErrors.address.message || 'Address error');
        break;
      case 3: // Property Details
        if (formErrors.areaSqFt)
          errors.push(formErrors.areaSqFt.message || 'Area error');
        break;
      case 4: // Building Details
        // All optional
        break;
      case 5: // Amenities & Security
        // All optional
        break;
      case 6: // Pricing & Seller
        if (formErrors.price)
          errors.push(formErrors.price.message || 'Price error');
        break;
      case 7: // Media & Contact
        // Only show image error if form has been submitted or user interacted with images
        const images = form.getValues('images') || [];
        if (
          form.formState.isSubmitted &&
          (uploadedImages.length === 0 || images.length === 0)
        ) {
          errors.push('At least one image is required');
        }
        break;
    }

    return errors;
  };

  const currentStepErrors = getStepErrors(currentStep);

  return (
    <div className="bg-muted/30 min-h-screen">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 bg-background ">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-4">
          <Card className="border-2">
            <CardContent className="p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStep} of {steps.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round((currentStep / steps.length) * 100)}% Complete
                  </span>
                </div>
                <Progress
                  value={(currentStep / steps.length) * 100}
                  className="h-2"
                />
              </div>

              {/* Desktop Stepper */}
              <div className="hidden lg:block">
                <div className="flex items-start justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const hasErrors =
                      getStepErrors(step.id).length > 0 && isCurrent;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-1 items-start relative"
                      >
                        <div className="flex flex-col items-center w-full">
                          <div className="relative flex items-center justify-center">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                isCompleted
                                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                  : isCurrent
                                  ? hasErrors
                                    ? 'border-destructive bg-destructive/10 text-destructive'
                                    : 'border-primary bg-primary/10 text-primary shadow-sm'
                                  : 'border-muted-foreground/30 bg-muted text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="h-6 w-6" />
                              ) : hasErrors ? (
                                <AlertCircle className="h-6 w-6" />
                              ) : (
                                <Icon className="h-6 w-6" />
                              )}
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <p
                              className={`text-sm font-semibold ${
                                isCurrent
                                  ? hasErrors
                                    ? 'text-destructive'
                                    : 'text-primary'
                                  : isCompleted
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {step.title}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Current Step
                              </p>
                            )}
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="absolute top-6 left-[calc(50%+24px)] right-0 flex items-center">
                            <div
                              className={`h-0.5 w-full transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-primary'
                                  : 'bg-muted-foreground/20'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Stepper */}
              <div className="lg:hidden">
                <div className="relative flex items-center justify-between px-4">
                  {/* Background Connecting Line */}
                  <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-muted-foreground/20" />

                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const hasErrors =
                      getStepErrors(step.id).length > 0 && isCurrent;

                    return (
                      <div key={step.id} className="relative z-10">
                        {/* Step Icon */}
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background transition-all duration-300 ${
                            isCompleted
                              ? 'border-primary bg-primary text-primary-foreground'
                              : isCurrent
                              ? hasErrors
                                ? 'border-destructive bg-destructive/10 text-destructive'
                                : 'border-primary bg-primary/10 text-primary'
                              : 'border-muted-foreground/30 bg-background text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : hasErrors ? (
                            <AlertCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Icon className="h-3.5 w-3.5" />
                          )}
                        </div>

                        {/* Progress Line Segment */}
                        {index > 0 && isCompleted && (
                          <div
                            className="absolute right-[14px] top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-300"
                            style={{
                              width: `calc((100vw - 4rem) / ${
                                steps.length - 1
                              })`,
                              transform: 'translateY(-50%) translateX(100%)',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Current Step Title */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {steps[currentStep - 1]?.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold md:text-3xl mb-2">
            Post Your Property
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to list your property on Zivio Living
          </p>
        </div>

        {/* Validation Errors Alert */}
        {currentStepErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-1">
                Please fix the following errors:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {currentStepErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, errors => {
              console.error('=== FORM VALIDATION ERRORS ===');
              console.error('Validation errors:', errors);

              toast({
                title: 'Form Validation Failed',
                description: 'Please check all required fields and try again.',
                variant: 'destructive',
              });
            })}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <Card data-testid="step-basic-info">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Luxurious 3BR Apartment in Gulshan"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormDescription>
                          A catchy title helps attract more buyers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-property-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="listingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-listing-type">
                                <SelectValue placeholder="Sale or Rent" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">For Sale</SelectItem>
                              <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="propertySubType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Sub-Type (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Studio, Duplex, Penthouse, etc."
                            {...field}
                            data-testid="input-property-subtype"
                          />
                        </FormControl>
                        <FormDescription>
                          Specify a sub-category like Studio, Duplex, or
                          Penthouse
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your property in detail. Include unique features, nearby amenities, and anything that makes it special."
                            className="min-h-[150px] resize-none"
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Card data-testid="step-location">
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                  <CardDescription>
                    Where is your property located?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Dhaka</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All listings are currently for Dhaka only
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area in Dhaka</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-area">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dhakaAreas.map(area => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="House/Road/Block details"
                            {...field}
                            data-testid="input-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="District name"
                            {...field}
                            data-testid="input-district"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <Card data-testid="step-property-details">
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>Size and specifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="areaSqFt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter area in square feet"
                            {...field}
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? undefined : parseInt(value)
                              );
                            }}
                            data-testid="input-area"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional: Residential Properties Only */}
                  {['apartment', 'house', 'flat'].includes(
                    form.watch('propertyType')
                  ) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ''}
                                onChange={e => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === '' ? undefined : parseInt(value)
                                  );
                                }}
                                data-testid="input-bedrooms"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ''}
                                onChange={e => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === '' ? undefined : parseInt(value)
                                  );
                                }}
                                data-testid="input-bathrooms"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="completionStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Completion Status (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ready">
                                Ready to Move
                              </SelectItem>
                              <SelectItem value="under_construction">
                                Under Construction
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select furnishing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="furnished">
                                Fully Furnished
                              </SelectItem>
                              <SelectItem value="semi_furnished">
                                Semi-Furnished
                              </SelectItem>
                              <SelectItem value="unfurnished">
                                Unfurnished
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="unitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Type (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Penthouse, Ground Floor, Corner Unit"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Special characteristics of this unit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Building Details */}
            {currentStep === 4 && (
              <Card data-testid="step-building-details">
                <CardHeader>
                  <CardTitle>Building Details</CardTitle>
                  <CardDescription>
                    Floor and building information (all optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 5"
                              {...field}
                              onChange={e =>
                                field.onChange(
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalFloors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Floors</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 12"
                              {...field}
                              onChange={e =>
                                field.onChange(
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="parkingCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Spaces</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={e =>
                                field.onChange(
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="balconies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Balconies</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={e =>
                                field.onChange(
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="facing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facing Direction</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., North, South-East"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="servantRoom"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Servant Room</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servantBathroom"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Servant Bathroom</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Amenities & Security */}
            {currentStep === 5 && (
              <Card data-testid="step-amenities-security">
                <CardHeader>
                  <CardTitle>Amenities & Security</CardTitle>
                  <CardDescription>
                    Safety features and amenities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-base font-semibold">
                      Security Features
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="security24x7"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>24/7 Security</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cctv"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>CCTV Surveillance</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="generatorBackup"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Generator Backup</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fireSafety"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Fire Safety System</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="liftAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Lift/Elevator Available</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-base font-semibold">
                      General Amenities
                    </Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {amenitiesList.map(amenity => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                            data-testid={`checkbox-amenity-${amenity
                              .toLowerCase()
                              .replace(/\s+/g, '-')}`}
                          />
                          <Label
                            htmlFor={`amenity-${amenity}`}
                            className="text-sm cursor-pointer"
                          >
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Pricing & Seller */}
            {currentStep === 6 && (
              <Card data-testid="step-pricing-seller">
                <CardHeader>
                  <CardTitle>Pricing & Seller Information</CardTitle>
                  <CardDescription>
                    Set your price and seller details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Type Toggle */}
                  <div className="space-y-2">
                    <Label>Price Type</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="price-numeric"
                          checked={priceType === 'numeric'}
                          onCheckedChange={() => {
                            setPriceType('numeric');
                            form.setValue('price', undefined);
                          }}
                        />
                        <Label
                          htmlFor="price-numeric"
                          className="cursor-pointer"
                        >
                          Enter numeric price
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="price-text"
                          checked={priceType === 'text'}
                          onCheckedChange={() => {
                            setPriceType('text');
                            form.setValue('price', '');
                          }}
                        />
                        <Label htmlFor="price-text" className="cursor-pointer">
                          Enter text (e.g., "Contact for Price")
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (BDT)</FormLabel>
                          <FormControl>
                            {priceType === 'numeric' ? (
                              <Input
                                type="number"
                                placeholder="Enter price"
                                value={
                                  typeof field.value === 'number'
                                    ? field.value
                                    : ''
                                }
                                onChange={e => {
                                  const value = e.target.value;
                                  const val =
                                    value === '' ? undefined : parseInt(value);
                                  field.onChange(val);
                                  // Auto-compute pricePerSqft
                                  if (val) {
                                    const area = form.getValues('areaSqFt');
                                    if (area && area > 0) {
                                      form.setValue(
                                        'pricePerSqft',
                                        Math.round(val / area)
                                      );
                                    }
                                  }
                                }}
                                data-testid="input-price"
                              />
                            ) : (
                              <Input
                                type="text"
                                placeholder="e.g., Contact for Price, Price on Request"
                                value={
                                  typeof field.value === 'string'
                                    ? field.value
                                    : ''
                                }
                                onChange={e => field.onChange(e.target.value)}
                                data-testid="input-price-text"
                              />
                            )}
                          </FormControl>
                          <FormDescription>
                            {priceType === 'numeric'
                              ? form.watch('listingType') === 'rent'
                                ? 'Monthly rent amount'
                                : 'Total sale price'
                              : 'Enter a custom text label for the price'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerSqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per sq ft (Auto-computed)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Auto-calculated"
                              {...field}
                              value={field.value || ''}
                              onChange={e => {
                                const value = e.target.value;
                                field.onChange(
                                  value === '' ? undefined : parseInt(value)
                                );
                              }}
                              data-testid="input-price-per-sqft"
                            />
                          </FormControl>
                          <FormDescription>
                            Calculated automatically, but you can override
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="negotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Price is Negotiable</FormLabel>
                          <FormDescription>
                            Check this if you're open to price negotiations
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sellerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seller Name (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name or company name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seller Type (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="agent">
                                Agent/Broker
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 7: Media & Contact */}
            {currentStep === 7 && (
              <Card data-testid="step-media-contact">
                <CardHeader>
                  <CardTitle>Media & Contact Information</CardTitle>
                  <CardDescription>
                    Upload images and provide contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-xl p-8 text-center">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading || uploadedImages.length >= 10}
                      data-testid="input-images"
                    />
                    <label
                      htmlFor="images"
                      className={`cursor-pointer flex flex-col items-center ${
                        uploadedImages.length >= 10
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="font-medium mb-1">
                        {isUploading
                          ? 'Uploading...'
                          : 'Click to upload images'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB each ({uploadedImages.length}/10
                        uploaded)
                      </p>
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                        >
                          <img
                            src={image.url}
                            alt={`Property ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                              Main Photo
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Tip: Add at least 5 photos. The first photo will be the main
                    image. Images are uploaded to Cloudinary for optimal
                    performance.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="floorPlanUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Plan URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/floorplan.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to floor plan image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to property video tour
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <Label className="mb-3 block text-base font-semibold">
                      Contact Preferences
                    </Label>

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                          </FormControl>
                          <FormDescription>
                            Primary contact number for this listing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-3 sm:grid-cols-3 mt-4">
                      <FormField
                        control={form.control}
                        name="isPhoneHidden"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                Hide Phone Number
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Mask your number
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsappEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                WhatsApp Contact
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Enable WhatsApp
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="chatEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                In-App Chat
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Enable messaging
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
                data-testid="button-prev-step"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2"
                  data-testid="button-next-step"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || uploadedImages.length === 0}
                  className="gap-2"
                  data-testid="button-submit-listing"
                  onClick={e => {
                    console.log('=== SUBMIT BUTTON CLICKED ===');
                    console.log('Is submitting:', isSubmitting);
                    console.log('Images uploaded:', uploadedImages.length);
                    console.log(
                      'Button disabled:',
                      isSubmitting || uploadedImages.length === 0
                    );
                    console.log('Current step:', currentStep);
                    console.log('Form is valid:', form.formState.isValid);
                    console.log('Form errors:', form.formState.errors);
                  }}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function CreateListing() {
  return (
    <ProtectedRoute>
      <CreateListingContent />
    </ProtectedRoute>
  );
}
