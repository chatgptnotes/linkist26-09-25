'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingCart, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const cardConfigSchema = z.object({
  // Mandatory fields
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(25, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(25, 'Last name too long'),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  mobile: z.string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true; // Allow empty
      // Remove all non-digit characters to check actual number length
      const digitsOnly = val.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }, 'Please enter a valid mobile number (10-15 digits)')
    .refine((val) => {
      if (!val || val === '') return true; // Allow empty
      // Allow digits, spaces, hyphens, plus sign, and parentheses
      return /^[\d\s\-\+\(\)]+$/.test(val);
    }, 'Mobile number contains invalid characters'),
  email: z.string().email('Please enter a valid email address'),
  
  // Optional fields
  whatsapp: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  
  // Address fields (optional)
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  
  // Other fields
  quantity: z.number().min(1, 'Minimum 1 card required').max(10, 'Maximum 10 cards allowed'),
  agreeToPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the data policy to proceed'
  })
});

type CardConfig = z.infer<typeof cardConfigSchema>;

export default function ConfigurePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Mobile verification state
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [mobileVerificationSent, setMobileVerificationSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileVerificationLoading, setMobileVerificationLoading] = useState(false);
  const [mobileVerificationError, setMobileVerificationError] = useState('');
  
  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardConfig>({
    resolver: zodResolver(cardConfigSchema),
    defaultValues: {
      quantity: 1,
      agreeToPolicy: false,
    },
  });

  const watchedValues = watch();

  // Load existing configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        console.log('Loading existing config:', config);
        
        // Pre-fill form with existing data
        if (config.firstName) setValue('firstName', config.firstName);
        if (config.lastName) setValue('lastName', config.lastName);
        if (config.title) setValue('title', config.title);
        if (config.company) setValue('company', config.company);
        if (config.email) setValue('email', config.email);
        if (config.website) setValue('website', config.website);
        if (config.linkedin) setValue('linkedin', config.linkedin);
        if (config.instagram) setValue('instagram', config.instagram);
        if (config.twitter) setValue('twitter', config.twitter);
        if (config.quantity) setValue('quantity', config.quantity);
        if (config.agreeToPolicy) setValue('agreeToPolicy', config.agreeToPolicy);
        
        // Handle mobile number (extract country code and number)
        if (config.mobile) {
          const mobileParts = config.mobile.split(' ');
          if (mobileParts.length >= 2) {
            setCountryCode(mobileParts[0]);
            setValue('mobile', mobileParts.slice(1).join(' '));
          } else {
            setValue('mobile', config.mobile);
          }
        }
        
        // Handle WhatsApp
        if (config.whatsapp) {
          setValue('whatsapp', config.whatsapp);
          setSameAsMobile(config.whatsapp === config.mobile);
        }
        
        // Load images
        if (config.profileImage) setProfileImage(config.profileImage);
        if (config.backgroundImage) setBackgroundImage(config.backgroundImage);
        
        // Set mobile verification status
        if (config.mobileVerified) setMobileVerified(config.mobileVerified);
        
        console.log('✅ Form pre-filled with existing data');
      } catch (error) {
        console.error('Error loading existing config:', error);
      }
    }
  }, [setValue]);

  // Handle "Same as mobile" toggle
  const handleSameAsMobileToggle = () => {
    setSameAsMobile(!sameAsMobile);
    if (!sameAsMobile && watchedValues.mobile) {
      setValue('whatsapp', watchedValues.mobile);
    } else {
      setValue('whatsapp', '');
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImage(null);
  };

  // Remove background image
  const removeBackgroundImage = () => {
    setBackgroundImage(null);
  };

  // Mobile verification handlers
  const handleMobileVerify = async () => {
    const mobileValue = watchedValues.mobile;
    if (!mobileValue) {
      setMobileVerificationError('Please enter a mobile number first');
      return;
    }

    // Combine country code with mobile number
    const fullMobileNumber = `${countryCode} ${mobileValue}`;

    setMobileVerificationLoading(true);
    setMobileVerificationError('');

    try {
      const response = await fetch('/api/send-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: fullMobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setMobileVerificationSent(true);
        console.log('Mobile OTP sent:', data.devOtp); // For development
      } else {
        setMobileVerificationError(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Mobile verification error:', error);
      setMobileVerificationError('Network error. Please try again.');
    } finally {
      setMobileVerificationLoading(false);
    }
  };

  const handleMobileOtpVerify = async () => {
    if (!mobileOtp) {
      setMobileVerificationError('Please enter the verification code');
      return;
    }

    setMobileVerificationLoading(true);
    setMobileVerificationError('');

    try {
      // Use the same full mobile number format as when sending OTP
      const fullMobileNumber = `${countryCode} ${watchedValues.mobile}`;
      
      const response = await fetch('/api/verify-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: fullMobileNumber, 
          otp: mobileOtp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMobileVerified(true);
        setMobileVerificationSent(false);
        setMobileOtp('');
      } else {
        setMobileVerificationError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Mobile OTP verification error:', error);
      setMobileVerificationError('Network error. Please try again.');
    } finally {
      setMobileVerificationLoading(false);
    }
  };

  const handleBypassVerification = () => {
    setMobileVerified(true);
    setMobileVerificationSent(false);
    setMobileOtp('');
    setMobileVerificationError('');
  };

  const onSubmit = async (data: CardConfig) => {
    setIsSubmitting(true);
    try {
      // Store card configuration
      const cardConfig = {
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        company: data.company,
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        email: data.email,
        website: data.website,
        linkedin: data.linkedin,
        instagram: data.instagram,
        twitter: data.twitter,
        profileImage: profileImage,
        backgroundImage: backgroundImage,
        quantity: data.quantity,
        mobileVerified: mobileVerified,
        // Store full mobile number with country code (if provided)
        mobile: watchedValues.mobile ? `${countryCode} ${watchedValues.mobile}` : null,
      };

      // Save to Supabase database
      const response = await fetch('/api/save-card-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardConfig),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Card configuration saved:', result.configId);
        
        // Also save to localStorage for compatibility
        const localConfig = {
          ...cardConfig,
          fullName: `${data.firstName} ${data.lastName}`,
          timestamp: new Date().toISOString(),
          status: 'draft',
          configId: result.configId, // Store the Supabase ID
        };
        localStorage.setItem('cardConfig', JSON.stringify(localConfig));
        
        // Show success toast
        showToast('Card configuration saved successfully!', 'success');
        
        // Navigate to proof approval page
        router.push('/nfc/proof-approval');
      } else {
        console.error('Failed to save card configuration:', result.error);
        showToast('Failed to save card configuration. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Exact Figma Design */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Linkist" className="h-8" />
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <button className="text-gray-600 hover:text-gray-900 font-medium">About</button>
              <button className="text-gray-600 hover:text-gray-900 font-medium">Support</button>
              <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <button className="btn-primary">Order Now</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Exact Figma Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Card</h1>
            <p className="text-gray-600 mb-6">
              Enter your details to create a live preview. Fields marked with <span className="text-red-500">*</span> are required for card printing.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields - MANDATORY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Jane"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Title and Company - MANDATORY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Founder & CEO"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('company')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Linkist Inc."
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                  )}
                </div>
              </div>

              {/* Mobile Number - OPTIONAL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="flex">
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-l focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-gray-50 min-w-[80px]"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+1">🇨🇦 +1</option>
                    <option value="+7">🇷🇺 +7</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+30">🇬🇷 +30</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+40">🇷🇴 +40</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+45">🇩🇰 +45</option>
                    <option value="+46">🇸🇪 +46</option>
                    <option value="+47">🇳🇴 +47</option>
                    <option value="+48">🇵🇱 +48</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+53">🇨🇺 +53</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+90">🇹🇷 +90</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+93">🇦🇫 +93</option>
                    <option value="+94">🇱🇰 +94</option>
                    <option value="+95">🇲🇲 +95</option>
                    <option value="+98">🇮🇷 +98</option>
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+218">🇱🇾 +218</option>
                    <option value="+220">🇬🇲 +220</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+222">🇲🇷 +222</option>
                    <option value="+223">🇲🇱 +223</option>
                    <option value="+224">🇬🇳 +224</option>
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+226">🇧🇫 +226</option>
                    <option value="+227">🇳🇪 +227</option>
                    <option value="+228">🇹🇬 +228</option>
                    <option value="+229">🇧🇯 +229</option>
                    <option value="+230">🇲🇺 +230</option>
                    <option value="+231">🇱🇷 +231</option>
                    <option value="+232">🇸🇱 +232</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+235">🇹🇩 +235</option>
                    <option value="+236">🇨🇫 +236</option>
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+238">🇨🇻 +238</option>
                    <option value="+239">🇸🇹 +239</option>
                    <option value="+240">🇬🇶 +240</option>
                    <option value="+241">🇬🇦 +241</option>
                    <option value="+242">🇨🇬 +242</option>
                    <option value="+243">🇨🇩 +243</option>
                    <option value="+244">🇦🇴 +244</option>
                    <option value="+245">🇬🇼 +245</option>
                    <option value="+246">🇮🇴 +246</option>
                    <option value="+248">🇸🇨 +248</option>
                    <option value="+249">🇸🇩 +249</option>
                    <option value="+250">🇷🇼 +250</option>
                    <option value="+251">🇪🇹 +251</option>
                    <option value="+252">🇸🇴 +252</option>
                    <option value="+253">🇩🇯 +253</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+257">🇧🇮 +257</option>
                    <option value="+258">🇲🇿 +258</option>
                    <option value="+260">🇿🇲 +260</option>
                    <option value="+261">🇲🇬 +261</option>
                    <option value="+262">🇾🇹 +262</option>
                    <option value="+263">🇿🇼 +263</option>
                    <option value="+264">🇳🇦 +264</option>
                    <option value="+265">🇲🇼 +265</option>
                    <option value="+266">🇱🇸 +266</option>
                    <option value="+267">🇧🇼 +267</option>
                    <option value="+268">🇸🇿 +268</option>
                    <option value="+269">🇰🇲 +269</option>
                    <option value="+290">🇸🇭 +290</option>
                    <option value="+291">🇪🇷 +291</option>
                    <option value="+297">🇦🇼 +297</option>
                    <option value="+298">🇫🇴 +298</option>
                    <option value="+299">🇬🇱 +299</option>
                    <option value="+350">🇬🇮 +350</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+352">🇱🇺 +352</option>
                    <option value="+353">🇮🇪 +353</option>
                    <option value="+354">🇮🇸 +354</option>
                    <option value="+355">🇦🇱 +355</option>
                    <option value="+356">🇲🇹 +356</option>
                    <option value="+357">🇨🇾 +357</option>
                    <option value="+358">🇫🇮 +358</option>
                    <option value="+359">🇧🇬 +359</option>
                    <option value="+370">🇱🇹 +370</option>
                    <option value="+371">🇱🇻 +371</option>
                    <option value="+372">🇪🇪 +372</option>
                    <option value="+373">🇲🇩 +373</option>
                    <option value="+374">🇦🇲 +374</option>
                    <option value="+375">🇧🇾 +375</option>
                    <option value="+376">🇦🇩 +376</option>
                    <option value="+377">🇲🇨 +377</option>
                    <option value="+378">🇸🇲 +378</option>
                    <option value="+380">🇺🇦 +380</option>
                    <option value="+381">🇷🇸 +381</option>
                    <option value="+382">🇲🇪 +382</option>
                    <option value="+383">🇽🇰 +383</option>
                    <option value="+385">🇭🇷 +385</option>
                    <option value="+386">🇸🇮 +386</option>
                    <option value="+387">🇧🇦 +387</option>
                    <option value="+389">🇲🇰 +389</option>
                    <option value="+420">🇨🇿 +420</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+423">🇱🇮 +423</option>
                    <option value="+500">🇫🇰 +500</option>
                    <option value="+501">🇧🇿 +501</option>
                    <option value="+502">🇬🇹 +502</option>
                    <option value="+503">🇸🇻 +503</option>
                    <option value="+504">🇭🇳 +504</option>
                    <option value="+505">🇳🇮 +505</option>
                    <option value="+506">🇨🇷 +506</option>
                    <option value="+507">🇵🇦 +507</option>
                    <option value="+508">🇵🇲 +508</option>
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+590">🇬🇵 +590</option>
                    <option value="+591">🇧🇴 +591</option>
                    <option value="+592">🇬🇾 +592</option>
                    <option value="+593">🇪🇨 +593</option>
                    <option value="+594">🇬🇫 +594</option>
                    <option value="+595">🇵🇾 +595</option>
                    <option value="+596">🇲🇶 +596</option>
                    <option value="+597">🇸🇷 +597</option>
                    <option value="+598">🇺🇾 +598</option>
                    <option value="+599">🇧🇶 +599</option>
                    <option value="+670">🇹🇱 +670</option>
                    <option value="+672">🇦🇶 +672</option>
                    <option value="+673">🇧🇳 +673</option>
                    <option value="+674">🇳🇷 +674</option>
                    <option value="+675">🇵🇬 +675</option>
                    <option value="+676">🇹🇴 +676</option>
                    <option value="+677">🇸🇧 +677</option>
                    <option value="+678">🇻🇺 +678</option>
                    <option value="+679">🇫🇯 +679</option>
                    <option value="+680">🇵🇼 +680</option>
                    <option value="+681">🇼🇫 +681</option>
                    <option value="+682">🇨🇰 +682</option>
                    <option value="+683">🇳🇺 +683</option>
                    <option value="+684">🇦🇸 +684</option>
                    <option value="+685">🇼🇸 +685</option>
                    <option value="+686">🇰🇮 +686</option>
                    <option value="+687">🇳🇨 +687</option>
                    <option value="+688">🇹🇻 +688</option>
                    <option value="+689">🇵🇫 +689</option>
                    <option value="+690">🇹🇰 +690</option>
                    <option value="+691">🇫🇲 +691</option>
                    <option value="+692">🇲🇭 +692</option>
                    <option value="+850">🇰🇵 +850</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+853">🇲🇴 +853</option>
                    <option value="+855">🇰🇭 +855</option>
                    <option value="+856">🇱🇦 +856</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+886">🇹🇼 +886</option>
                    <option value="+960">🇲🇻 +960</option>
                    <option value="+961">🇱🇧 +961</option>
                    <option value="+962">🇯🇴 +962</option>
                    <option value="+963">🇸🇾 +963</option>
                    <option value="+964">🇮🇶 +964</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+967">🇾🇪 +967</option>
                    <option value="+968">🇴🇲 +968</option>
                    <option value="+970">🇵🇸 +970</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+972">🇮🇱 +972</option>
                    <option value="+973">🇧🇭 +973</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+975">🇧🇹 +975</option>
                    <option value="+976">🇲🇳 +976</option>
                    <option value="+977">🇳🇵 +977</option>
                    <option value="+992">🇹🇯 +992</option>
                    <option value="+993">🇹🇲 +993</option>
                    <option value="+994">🇦🇿 +994</option>
                    <option value="+995">🇬🇪 +995</option>
                    <option value="+996">🇰🇬 +996</option>
                    <option value="+998">🇺🇿 +998</option>
                  </select>
                  <input
                    {...register('mobile')}
                    className="flex-1 px-3 py-2 border-l-0 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter mobile number (10-15 digits)"
                    disabled={mobileVerified}
                  />
                  <button 
                    type="button"
                    onClick={handleMobileVerify}
                    disabled={mobileVerificationLoading || mobileVerified || !watchedValues.mobile}
                    className={`px-4 py-2 border border-l-0 border-gray-200 rounded-r font-medium transition-colors ${
                      mobileVerified 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : watchedValues.mobile && !mobileVerificationLoading
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {mobileVerificationLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : mobileVerified ? (
                      '✓ Verified'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                
                {/* Bypass Verification Button */}
                {!mobileVerified && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleBypassVerification}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Skip Verification</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Skip mobile verification for development/testing</p>
                  </div>
                )}
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                )}
                
                {/* Mobile OTP Input */}
                {mobileVerificationSent && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-3">Enter the verification code sent to your mobile</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="flex-1 px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleMobileOtpVerify}
                        disabled={mobileVerificationLoading || !mobileOtp}
                        className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {mobileVerificationLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Mobile verification error */}
                {mobileVerificationError && (
                  <p className="text-red-500 text-sm mt-2">{mobileVerificationError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Text & NFC format<br />
                  recommended.
                </p>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                <div className="flex items-center space-x-3 mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={handleSameAsMobileToggle}
                      className="mr-2 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">Same as mobile</span>
                  </label>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <input
                  {...register('whatsapp')}
                  disabled={sameAsMobile}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50"
                  placeholder="+971 50 123 4567"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="jane@doe.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Optional: Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                <input
                  {...register('website')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://www.yourcompany.com"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                )}
              </div>

              {/* Optional: Social Media Links */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Social Media (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">LinkedIn</label>
                    <input
                      {...register('linkedin')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="linkedin.com/in/yourname"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Instagram</label>
                    <input
                      {...register('instagram')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="@yourusername"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Twitter</label>
                    <input
                      {...register('twitter')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Optional: Address Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Address Information (Optional)</h4>
                <p className="text-xs text-gray-500">This address can be used for delivery purposes during checkout</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1</label>
                  <input
                    {...register('addressLine1')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                  <input
                    {...register('addressLine2')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                    <input
                      {...register('city')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">State/Province</label>
                    <input
                      {...register('state')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="State or Province"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                    <input
                      {...register('postalCode')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Profile Photo (Optional)</h4>
                
                {!profileImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors bg-black">
                    <Upload className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-sm text-white mb-2">Upload your profile photo</p>
                    <p className="text-xs text-gray-300 mb-4">Recommended: 400x400px, PNG or JPG, max 2MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Choose Photo
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-2">Profile photo uploaded</p>
                  </div>
                )}
              </div>

              {/* Background Upload */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Background Image (Optional)</h4>
                
                {!backgroundImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors bg-black">
                    <Upload className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-sm text-white mb-2">Upload custom background</p>
                    <p className="text-xs text-gray-300 mb-4">Recommended: 1024x640px, PNG or JPG, max 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                      id="background-upload"
                    />
                    <label
                      htmlFor="background-upload"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Choose Background
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border shadow-md">
                      <img
                        src={backgroundImage}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeBackgroundImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-2">Background image uploaded</p>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  defaultValue={1}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-4">
                <label className="flex items-start space-x-3">
                  <input
                    {...register('agreeToPolicy')}
                    type="checkbox"
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the data policy and confirm my print proof is correct.
                    By checking this, you approve the live preview for printing.
                  </span>
                </label>
                {errors.agreeToPolicy && (
                  <p className="text-red-500 text-sm mt-1">{errors.agreeToPolicy.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-coral py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Approve Proof & Add to Cart'
                )}
              </button>
              
              {/* Progress Bar */}
              {isSubmitting && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full animate-pulse" style={{
                      width: '100%',
                      animation: 'progress 3s ease-in-out infinite'
                    }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Processing your card configuration and generating preview...
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Card Preview Section - Live Preview */}
          <div className="space-y-6">
            {/* Live Preview Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Updates automatically</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('front')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'front'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveTab('back')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'back'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Back
              </button>
            </div>

            {/* Card Preview */}
            <div className="bg-white rounded-lg p-6">
              {activeTab === 'front' ? (
                <div className="max-w-sm mx-auto">
                  {/* Front Card */}
                  <div 
                    className="w-full aspect-[1.586/1] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white relative overflow-hidden"
                    style={backgroundImage ? {
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {}}
                  >
                    {/* Linkist Logo */}
                    <div className="flex items-center space-x-2 mb-4">
                      <img src="/logo.svg" alt="Linkist" className="h-6 filter brightness-0 invert" />
                      <div className="ml-auto">
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          FOUNDER
                        </div>
                      </div>
                    </div>

                    {/* Profile Image - Positioned lower to avoid overlap */}
                    <div className="absolute top-16 right-6 w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                      <img 
                        src={profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b5b0?w=150&h=150&fit=crop&crop=face"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name and Title */}
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                        {watchedValues.firstName && watchedValues.lastName
                          ? `${watchedValues.firstName} ${watchedValues.lastName}`
                          : 'Your Name'
                        }
                      </h3>
                      <p className="text-gray-300 text-sm drop-shadow-md">
                        {watchedValues.title && watchedValues.company
                          ? `${watchedValues.title}, ${watchedValues.company}`
                          : 'Your Title, Your Company'
                        }
                      </p>
                      {watchedValues.email && (
                        <p className="text-gray-300 text-xs mt-1 drop-shadow-md">
                          {watchedValues.email}
                        </p>
                      )}
                    </div>

                    {/* NFC Icon */}
                    <div className="absolute bottom-6 right-6">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,4 22,2 20,2M20,20H4V4H20V20Z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    This is a digital representation. Final product may vary slightly.
                  </p>
                </div>
              ) : (
                <div className="max-w-sm mx-auto">
                  {/* Back Card */}
                  <div className="w-full aspect-[1.586/1] bg-white border border-gray-200 rounded-lg p-6 relative overflow-hidden">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      {/* Mobile */}
                      {watchedValues.mobile && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{countryCode} {watchedValues.mobile}</span>
                        </div>
                      )}
                      
                      {/* Email */}
                      {watchedValues.email && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{watchedValues.email}</span>
                        </div>
                      )}
                      
                      {/* Website */}
                      {watchedValues.website && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{watchedValues.website}</span>
                        </div>
                      )}

                      {/* Social Media Links */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-xs mb-3 uppercase tracking-wide">Connect With Me</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {watchedValues.linkedin && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                <span className="text-white text-xs font-bold">in</span>
                              </div>
                              <p className="text-xs text-gray-600">LinkedIn</p>
                            </div>
                          )}
                          
                          {watchedValues.instagram && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                              <p className="text-xs text-gray-600">Instagram</p>
                            </div>
                          )}
                          
                          {watchedValues.twitter && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                              </div>
                              <p className="text-xs text-gray-600">Twitter</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <div className="text-xs text-gray-400 text-center">
                        <div className="w-8 h-8 bg-gray-300 rounded mb-1 mx-auto"></div>
                        <span>QR</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    This is a digital representation. Final product may vary slightly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16 border-t border-gray-800">
          <div className="w-full px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <img src="/logo.svg" alt="Linkist" className="h-8 filter brightness-0 invert" />
                  <span className="text-xl font-bold">Linkist</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Network Differently.<br />
                  Smart NFC cards for modern professionals.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/nfc/configure" className="text-gray-400 hover:text-white transition-colors">Order Card</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">For Teams</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="mailto:support@linkist.app" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                  <li><a href="mailto:hello@linkist.app" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
              </div>
              
              {/* Bottom section */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    © 2025 Linkist. All rights reserved.
                  </div>
                  <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <div className="text-gray-400 text-sm">Made with ❤️ for modern networking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}