import React, { useState, useTransition } from "react";
import { 
  Sparkles, Save, ChevronRight, Plus, Trash2, Edit3, 
  HelpCircle, UserPlus, Star, Info, Settings, MapPin, 
  Phone, Mail, Calendar, Eye, HelpCircle as HelpIcon, ArrowUpRight, Instagram,
  Activity, Bell, Upload, X, Image
} from "lucide-react";
import { BusinessProfile, BusinessService, BusinessProduct, Testimonial, FAQItem, TeamMember, OwnerReport } from "../types";

interface ProfileFormsProps {
  profile: BusinessProfile;
  onChange: (updated: BusinessProfile) => void;
  onAiGenerate: (params: { businessName: string; category: string; description: string; theme: string }) => Promise<void>;
  isAiGenerating: boolean;
  aiStatus: string;
}

export default function ProfileForms({ 
  profile, 
  onChange, 
  onAiGenerate, 
  isAiGenerating,
  aiStatus
}: ProfileFormsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'basic' | 'offerings' | 'team' | 'contact' | 'reports'>('basic');

  // AI Generator Inputs state
  const [aiName, setAiName] = useState("");
  const [aiCategory, setAiCategory] = useState("Kuliner / Café");
  const [aiDescription, setAiDescription] = useState("");
  const [aiTheme, setAiTheme] = useState("nature");

  // Local helper states for adding new services, products, team, faq, testimonials, reports
  const [newService, setNewService] = useState<Omit<BusinessService, 'id'>>({
    title: "", description: "", price: "", iconName: "Sparkles"
  });
  const [newProduct, setNewProduct] = useState<Omit<BusinessProduct, 'id'>>({
    name: "", description: "", price: ""
  });
  const [newFaq, setNewFaq] = useState<Omit<FAQItem, 'id'>>({
    question: "", answer: ""
  });
  const [newTeam, setNewTeam] = useState<Omit<TeamMember, 'id'>>({
    name: "", role: "", bio: ""
  });
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
    name: "", role: "", comment: "", rating: 5
  });
  const [newReport, setNewReport] = useState<Omit<OwnerReport, 'id'>>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    status: "aman",
    description: ""
  });

  const [isDragging, setIsDragging] = useState(false);

  // Handler helpers
  const handleBasicChange = (field: keyof BusinessProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value
    });
  };

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Harap unggah file gambar (PNG, JPG, atau JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      
      const img = new window.Image();
      img.src = base64String;
      img.onload = () => {
        const maxWidth = 800; // max size for optimization
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75); // 75% quality Jpeg
          handleBasicChange("profileImageUrl", compressedBase64);
        } else {
          handleBasicChange("profileImageUrl", base64String);
        }
      };
      
      img.onerror = () => {
        handleBasicChange("profileImageUrl", base64String);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleContactChange = (field: keyof typeof profile.contactInfo, value: string) => {
    onChange({
      ...profile,
      contactInfo: {
        ...profile.contactInfo,
        [field]: value,
        // Update direct whatsapp link based on phone input dynamically
        ...(field === 'phone' ? { whatsappDirect: `https://wa.me/${value.replace(/[^0-9]/g, "")}` } : {})
      }
    });
  };

  const handleHourChange = (index: number, hours: string) => {
    const updatedHours = [...profile.operatingHours];
    updatedHours[index] = { ...updatedHours[index], hours };
    onChange({
      ...profile,
      operatingHours: updatedHours
    });
  };

  // Add Item actions
  const addService = () => {
    if (!newService.title) return;
    const added: BusinessService = {
      ...newService,
      id: `srv-${Date.now()}`
    };
    onChange({
      ...profile,
      services: [...profile.services, added]
    });
    setNewService({ title: "", description: "", price: "", iconName: "Sparkles" });
  };

  const addProduct = () => {
    if (!newProduct.name) return;
    const added: BusinessProduct = {
      ...newProduct,
      id: `prod-${Date.now()}`
    };
    onChange({
      ...profile,
      products: [...profile.products, added]
    });
    setNewProduct({ name: "", description: "", price: "" });
  };

  const addFaq = () => {
    if (!newFaq.question) return;
    const added: FAQItem = {
      ...newFaq,
      id: `faq-${Date.now()}`
    };
    onChange({
      ...profile,
      faq: [...profile.faq, added]
    });
    setNewFaq({ question: "", answer: "" });
  };

  const addTeam = () => {
    if (!newTeam.name) return;
    const added: TeamMember = {
      ...newTeam,
      id: `team-${Date.now()}`
    };
    onChange({
      ...profile,
      team: [...profile.team, added]
    });
    setNewTeam({ name: "", role: "", bio: "" });
  };

  const addTestimonial = () => {
    if (!newTestimonial.comment) return;
    const added: Testimonial = {
      ...newTestimonial,
      id: `tst-${Date.now()}`
    };
    onChange({
      ...profile,
      testimonials: [...profile.testimonials, added]
    });
    setNewTestimonial({ name: "", role: "", comment: "", rating: 5 });
  };

  const addReport = () => {
    if (!newReport.title.trim() || !newReport.description.trim()) return;
    const added: OwnerReport = {
      ...newReport,
      id: `rep-${Date.now()}`
    };
    onChange({
      ...profile,
      reports: [added, ...(profile.reports || [])]
    });
    setNewReport({
      date: new Date().toISOString().split("T")[0],
      title: "",
      status: "aman",
      description: ""
    });
  };

  // Delete Item actions
  const removeItem = (key: 'services' | 'products' | 'faq' | 'team' | 'testimonials' | 'reports', id: string) => {
    const list = profile[key] || [];
    onChange({
      ...profile,
      [key]: (list as any[]).filter(itm => itm.id !== id)
    });
  };

  const executeAiGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiName.trim() || !aiCategory.trim()) return;
    onAiGenerate({
      businessName: aiName,
      category: aiCategory,
      description: aiDescription,
      theme: aiTheme
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col h-[780px]">
      
      {/* Configuration Header Tabs */}
      <div className="bg-neutral-50 px-4 pt-3 border-b border-neutral-200 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
          <button 
            onClick={() => setActiveSubTab('basic')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${activeSubTab === 'basic' ? 'bg-indigo-650 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200'}`}
          >
            <Info className="w-3.5 h-3.5" />
            📝 Info Dasar Wisma
          </button>

          <button 
            onClick={() => setActiveSubTab('offerings')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${activeSubTab === 'offerings' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200'}`}
          >
            <Settings className="w-3.5 h-3.5" />
            🛍️ Jasa & Produk
          </button>

          <button 
            onClick={() => setActiveSubTab('team')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${activeSubTab === 'team' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200'}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            👥 Tim & Ulasan
          </button>

          <button 
            onClick={() => setActiveSubTab('contact')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${activeSubTab === 'contact' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200'}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            📞 Kontak & Jam
          </button>

          <button 
            onClick={() => setActiveSubTab('reports')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${activeSubTab === 'reports' ? 'bg-amber-600 text-white shadow-sm font-extrabold' : 'text-neutral-600 hover:text-neutral-950 bg-amber-50 border border-amber-250'}`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            🔔 Kondisi & Laporan
          </button>
        </div>
      </div>

      {/* Configuration Body Content */}
      <div className="flex-1 overflow-y-auto p-5 text-sm text-neutral-700">
        
        {/* TABS 1: AI GENERATOR */}
        {activeSubTab === 'ai' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-650 animate-pulse" />
                Draf Copywriting Web dengan Gemini AI
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Tulis nama bisnis dan deskripsi pendek Anda. Maka model AI kami akan merancang struktur web, menyusun narasi, slogan puitis, ulasan ulasan, produk fiktif realistis, serta seluruh detail kontak dalam sekejap!
              </p>
            </div>

            {isAiGenerating ? (
              <div className="py-20 text-center flex flex-col justify-center items-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
                  <div className="absolute inset-x-0 top-0 bottom-0 m-auto w-12 h-12 rounded-full border-4 border-indigo-650 border-t-transparent animate-spin"></div>
                </div>
                <h4 className="font-bold text-neutral-800 text-sm animate-pulse">Membuat Profil Bisnis Profesional...</h4>
                <p className="text-xs text-neutral-400 max-w-sm mt-2 font-mono bg-neutral-50 px-3 py-1.5 rounded border border-neutral-200 text-center">
                  🛠️ {aiStatus}
                </p>
              </div>
            ) : (
              <form onSubmit={executeAiGeneration} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Nama Bisnis / Usaha *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Sangkar Kayu Sejati, Salon Az-Zahra"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-250 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 focus:outline-none placeholder-neutral-400 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Kategori Industri</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-250 text-xs text-neutral-850 bg-white focus:outline-none"
                    >
                      <option value="Kuliner / Café">Kuliner / Café</option>
                      <option value="Teknologi / Agen Kreatif">Teknologi / Agen Kreatif</option>
                      <option value="Kecantikan / Jasa Spa">Kecantikan / Spa</option>
                      <option value="Toko Retail / Fashion">Toko Retail / Fashion</option>
                      <option value="Edukasi / Bimbingan Belajar">Edukasi / Edu-tech</option>
                      <option value="Kesehatan / Klinik Dokter">Kesehatan / Klinik</option>
                      <option value="Jasa Konstruksi / Bengkel">Jasa Bengkel / Konstruksi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Aroma Estetika / Tema</label>
                    <select
                      value={aiTheme}
                      onChange={(e) => setAiTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-250 text-xs text-neutral-850 bg-white focus:outline-none"
                    >
                      <option value="minimalist">Minimalist (Sederhana Modern)</option>
                      <option value="nature">Nature (Hijau Teduh Organik)</option>
                      <option value="luxury">Luxury (Emas Mewah & Megah)</option>
                      <option value="vibrant">Vibrant (Kreatif & Ceria)</option>
                      <option value="corporate">Corporate (Profesional & Mapan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat / Layanan Utama (Optional)
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Contoh: Kami melayani pembuatan kusen pintu kayu jati kualitas ekspor, melayani custom ukiran jepara, pengerjaan cepat bebas karat dan anti rayap..."
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-250 focus:border-indigo-500 text-xs text-neutral-800 focus:outline-none placeholder-neutral-400 bg-white"
                  />
                  <span className="text-[10px] text-neutral-400 italic block mt-1">
                    Petunjuk: Berikan keunikan produk Anda agar Gemini dapat membuat copywriting yang super relevan!
                  </span>
                </div>

                <button 
                  type="submit"
                  disabled={!aiName.trim()}
                  className={`w-full py-3 rounded-lg font-semibold text-xs text-white bg-indigo-650 hover:bg-indigo-750 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Sparkles className="w-4 h-4" />
                  Buat Profil Usaha Otomatis (Gemini)
                </button>
              </form>
            )}
            
            <div className="border-t border-neutral-200 pt-3 text-[11px] text-neutral-400 leading-relaxed text-center">
              Aplikasi ini adalah full-stack engine cerdas. Anda bisa bebas berpindah tab untuk menyunting data teks secara manual kapan pun Anda membutuhkannya.
            </div>
          </div>
        )}

        {/* TABS 2: BASIC INFO EDIT */}
        {activeSubTab === 'basic' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex items-center gap-1">
              <span>📝</span> Narasi & Identitas Dasar
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Usaha / Bisnis</label>
              <input 
                type="text"
                value={profile.businessName}
                onChange={(e) => handleBasicChange('businessName', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
              />
            </div>

            {/* Foto Profil Usaha Drag & Drop Upload Section */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-neutral-400" />
                Foto Profil / Logo Usaha
              </label>
              
              <div className="flex items-start gap-4">
                {/* Thumb preview panel */}
                <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative shrink-0">
                  {profile.profileImageUrl ? (
                    <>
                      <img 
                        src={profile.profileImageUrl} 
                        alt="Pratinjau profil" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => handleBasicChange("profileImageUrl", "")}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black rounded-full text-white transition-colors cursor-pointer"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <Image className="w-6 h-6 text-neutral-350 mx-auto mb-1" />
                      <span className="text-[10px] text-neutral-400 font-extrabold">{profile.businessName.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* Dropzone field panel */}
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById("profile-image-file-input")?.click()}
                  className={`flex-1 border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs ${
                    isDragging 
                      ? "border-indigo-650 bg-indigo-50/50" 
                      : profile.profileImageUrl
                        ? "border-neutral-200 hover:border-neutral-350 bg-neutral-50/30"
                        : "border-neutral-250 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <input 
                    id="profile-image-file-input"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <Upload className={`w-4 h-4 ${isDragging ? "text-indigo-650 animate-bounce" : "text-neutral-400"}`} />
                  <div>
                    <span className="font-extrabold text-neutral-800">Unggah file gambar</span> atau seret dan lepas di sini
                  </div>
                  <span className="text-[9px] text-neutral-400">
                    Mendukung PNG, JPG, JPEG (Maks. Dioptimalkan otomatis)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Kategori Label</label>
                <input 
                  type="text"
                  value={profile.category}
                  onChange={(e) => handleBasicChange('category', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tema Visual</label>
                <select
                  value={profile.theme}
                  onChange={(e) => handleBasicChange('theme', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs bg-white focus:outline-none"
                >
                  <option value="minimalist">Minimalist (Sederhana Modern)</option>
                  <option value="nature">Nature (Hijau Teduh Organik)</option>
                  <option value="luxury">Luxury (Emas Mewah & Megah)</option>
                  <option value="vibrant">Vibrant (Kreatif & Ceria)</option>
                  <option value="corporate">Corporate (Profesional & Mapan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Slogan Promosi (Tagline)</label>
              <input 
                type="text"
                value={profile.slogan}
                onChange={(e) => handleBasicChange('slogan', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Draf Ringkasan Visi (About Us)</label>
              <textarea 
                rows={3}
                value={profile.aboutUs}
                onChange={(e) => handleBasicChange('aboutUs', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Cerita Latar Belakang Mendalam (Storytelling)</label>
              <textarea 
                rows={6}
                value={profile.story}
                onChange={(e) => handleBasicChange('story', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-250 text-xs whitespace-pre-wrap font-sans"
              />
              <span className="text-[10px] text-neutral-400 italic mt-0.5 block">
                Tulis latar belakang emosional, nilai-nilai, atau pendiri untuk memikat hati pembaca.
              </span>
            </div>
          </div>
        )}

        {/* TABS 3: OFFERINGS (SERVICES & PRODUCTS) */}
        {activeSubTab === 'offerings' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* SERVICES SUBSECTION */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex justify-between items-center">
                <span className="flex items-center gap-1">🛠️ Jasa / Layanan Utama</span>
                <span className="text-[10px] bg-neutral-150 px-2 py-0.5 rounded text-neutral-500 lowercase">{profile.services.length} terdaftar</span>
              </h3>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {profile.services.map((srv) => (
                  <div key={srv.id} className="flex gap-2 items-start justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
                          {srv.iconName}
                        </span>
                        <h4 className="font-bold text-xs text-neutral-900 truncate">{srv.title}</h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{srv.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-neutral-700">{srv.price}</span>
                      <button 
                        onClick={() => removeItem('services', srv.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus jasa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to Add Service */}
              <div className="bg-neutral-50/50 p-3 rounded-lg border border-dashed border-neutral-300 space-y-2.5">
                <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Tambah Jasa Baru</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nama jasa (e.g., Potong Rambut)"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Sistem harga (e.g., Rp 35.000)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Kalimat detail"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                  />
                  <select
                    value={newService.iconName}
                    onChange={(e) => setNewService({ ...newService, iconName: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white focus:outline-none"
                  >
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Coffee">Coffee ☕</option>
                    <option value="Cpu">Cpu 💻</option>
                    <option value="Scissors">Scissors ✂️</option>
                    <option value="Code">Code 💻</option>
                    <option value="Palette">Palette 🎨</option>
                    <option value="Smile">Smile 😊</option>
                    <option value="Heart">Heart ❤️</option>
                    <option value="Shield">Shield 🛡️</option>
                  </select>
                </div>
                <button 
                  onClick={addService}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Jasa
                </button>
              </div>
            </div>

            {/* PRODUCTS SUBSECTION */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex justify-between items-center">
                <span className="flex items-center gap-1">🛍️ Produk Fisik Toko</span>
                <span className="text-[10px] bg-neutral-150 px-2 py-0.5 rounded text-neutral-500 lowercase">{profile.products.length} terdaftar</span>
              </h3>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {profile.products.map((prod) => (
                  <div key={prod.id} className="flex gap-2 items-start justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{prod.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-neutral-700">{prod.price}</span>
                      <button 
                        onClick={() => removeItem('products', prod.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to Add Product */}
              <div className="bg-neutral-50/50 p-3 rounded-lg border border-dashed border-neutral-300 space-y-2.5">
                <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Tambah Produk Baru</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nama produk (e.g., Kopi Bubuk)"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Harga rupiah (e.g., Rp 45.000)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Detail penjelasan produk"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white"
                />
                <button 
                  onClick={addProduct}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Produk
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TABS 4: TEAM & TESTIMONIALS */}
        {activeSubTab === 'team' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* TEAM KUNCI */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex justify-between items-center">
                <span>👥 Anggota Tim Kunci</span>
                <span className="text-[10px] bg-neutral-150 px-2 py-0.5 rounded text-neutral-500">{profile.team.length} terdaftar</span>
              </h3>

              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {profile.team.map((mbr) => (
                  <div key={mbr.id} className="flex gap-2 items-start justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-neutral-900">{mbr.name} — <span className="text-neutral-400 font-semibold">{mbr.role}</span></h4>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">{mbr.bio}</p>
                    </div>
                    <button 
                      onClick={() => removeItem('team', mbr.id)}
                      className="text-red-500 hover:text-red-700 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form to Add Team */}
              <div className="bg-neutral-50/50 p-3 rounded-lg border border-dashed border-neutral-300 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nama Pengurus"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Jabatan / Peran"
                    value={newTeam.role}
                    onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                    className="px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Keahlian pendek pengurus"
                  value={newTeam.bio}
                  onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                />
                <button 
                  onClick={addTeam}
                  className="px-2.5 py-1 bg-neutral-950 text-white rounded text-[10px] font-bold"
                >
                  Tambah Tim
                </button>
              </div>
            </div>

            {/* TESTIMONIALS */}
            <div className="space-y-4 pt-3 border-t border-neutral-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex justify-between items-center">
                <span>⭐ Testimoni & Ulasan</span>
                <span className="text-[10px] bg-neutral-150 px-2 py-0.5 rounded text-neutral-500">{profile.testimonials.length} terdaftar</span>
              </h3>

              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {profile.testimonials.map((tst) => (
                  <div key={tst.id} className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-xs text-neutral-900">{tst.name} <span className="font-normal text-neutral-400">({tst.role})</span></h4>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-amber-600">⭐ {tst.rating}</span>
                        <button 
                          onClick={() => removeItem('testimonials', tst.id)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-500 italic">"{tst.comment}"</p>
                  </div>
                ))}
              </div>

              {/* Form to Add Testimonial */}
              <div className="bg-neutral-50/50 p-3 rounded-lg border border-dashed border-neutral-300 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nama Kriminal/Pelanggan"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Peran (e.g., Ibu Rumah Tangga)"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    className="px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      placeholder="Teks komentar kepuasan"
                      value={newTestimonial.comment}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-neutral-250 text-xs bg-white text-neutral-800"
                    >
                      <option value={5}>5 Bintang ⭐</option>
                      <option value={4}>4 Bintang ⭐</option>
                      <option value={3}>3 Bintang ⭐</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={addTestimonial}
                  className="px-2.5 py-1 bg-neutral-950 text-white rounded text-[10px] font-bold"
                >
                  Tambah Testimoni
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TABS 5: CONTACTS & OPERATING HOURS */}
        {activeSubTab === 'contact' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* PHYSICAL AND ONLINE CONTACT */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex items-center gap-1">
                <span>📞</span> Kontak Narahubung & Alamat
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Email Resmi Bisnis</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="email"
                    value={profile.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Nomor Telepon / WA</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text"
                      placeholder="+62 8xx..."
                      value={profile.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Username Instagram</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text"
                      placeholder="@username"
                      value={profile.contactInfo.instagram || ""}
                      onChange={(e) => handleContactChange('instagram', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Alamat Kantor / Toko Fisik</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 pointer-events-none">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <textarea 
                    rows={2}
                    value={profile.contactInfo.address}
                    onChange={(e) => handleContactChange('address', e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-250 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* OPERATING HOURS DETAILS */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex items-center gap-1">
                <span>⏰</span> Jam Jadwal Operasional
              </h3>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2">
                {profile.operatingHours.map((op, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-neutral-600 w-24">{op.day}</span>
                    <input 
                      type="text"
                      value={op.hours}
                      onChange={(e) => handleHourChange(i, e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded text-xs border border-neutral-250 bg-white"
                      placeholder="e.g., 09:00 - 21:00 atau Tutup"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK FAQ SECTION */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 flex justify-between items-center">
                <span>❓ Pertanyaan Sering Diajukan (FAQ)</span>
                <span className="text-[10px] bg-neutral-150 px-2 py-0.5 rounded text-neutral-500">{profile.faq.length} terdaftar</span>
              </h3>

              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {profile.faq.map((fq) => (
                  <div key={fq.id} className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-neutral-900">Q: {fq.question}</h4>
                      <button 
                        onClick={() => removeItem('faq', fq.id)}
                        className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">A: {fq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Form to Add FAQ */}
              <div className="bg-neutral-50/50 p-3 rounded-lg border border-dashed border-neutral-300 space-y-2">
                <input 
                  type="text" 
                  placeholder="Apa pertanyaan pelanggan?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Bagaimana penyelesaian/jawabannya?"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-neutral-250 text-xs bg-white"
                />
                <button 
                  onClick={addFaq}
                  className="px-2.5 py-1 bg-neutral-950 text-white rounded text-[10px] font-bold"
                >
                  Tambah FAQ
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TABS 6: SITUATION UPDATES & OWNER REPORTS */}
        {activeSubTab === 'reports' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
                Manajemen Situasi & Laporan Pengelola
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tuliskan pembaruan kondisi berkala, laporan perbaikan utilitas, status kebersihan, atau pengumuman penting lainnya agar tampil secara visual (real-time) di halaman web pratinjau publik Wisma Bidara Anda.
              </p>
            </div>

            {/* LIST OF CURRENT REPORTS */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800 flex justify-between items-center">
                <span>📋 Laporan yang Dipublikasikan</span>
                <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-800">{(profile.reports || []).length} Laporan</span>
              </h4>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {!(profile.reports && profile.reports.length > 0) ? (
                  <p className="text-xs text-neutral-400 italic py-4 text-center">Belum ada laporan atau pembaruan situasi yang diterbitkan.</p>
                ) : (
                  profile.reports.map((rep) => (
                    <div key={rep.id} className="bg-white p-3 rounded-lg border border-neutral-200 shadow-3xs hover:border-neutral-300 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{rep.date}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                              rep.status === 'aman' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              rep.status === 'perbaikan' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {rep.status === 'aman' ? '🟢 Aman' : rep.status === 'perbaikan' ? '🔧 Perbaikan' : 'ℹ️ Info'}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-neutral-900 mt-1">{rep.title}</h5>
                        </div>
                        <button 
                          onClick={() => removeItem('reports', rep.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all shrink-0"
                          title="Hapus laporan ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{rep.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FORM TO ADD REPORT */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                <Plus className="w-4 h-4 text-amber-655" />
                Tulis Laporan / Situasi Baru
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Tanggal Laporan</label>
                  <input 
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                    className="w-full px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Kondisi / Status</label>
                  <select
                    value={newReport.status}
                    onChange={(e) => setNewReport({ ...newReport, status: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded border border-neutral-250 text-xs bg-white text-neutral-800"
                  >
                    <option value="aman">🟢 Kondisi Aman / Selesai</option>
                    <option value="perbaikan">🔧 Sedang Perbaikan / Kendala</option>
                    <option value="info">ℹ️ Informasi / Pengumuman</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Judul Pembaruan</label>
                <input 
                  type="text"
                  placeholder="Misal: Pemeliharaan Tangki Air Utama Bulanan"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-250 text-xs bg-white text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Deskripsi Detail Kondisi</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsikan situasi secara terperinci agar calon penyewa dan penghuni mendapatkan transparansi penuh..."
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-250 text-xs bg-white text-neutral-800"
                />
              </div>

              <button 
                onClick={addReport}
                disabled={!newReport.title.trim() || !newReport.description.trim()}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Terbitkan & Publikasikan Laporan
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Configuration Footer bar */}
      <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 shrink-0 text-center text-xs text-neutral-400">
        Status data profil diselaraskan di layar pratinjau.
      </div>
    </div>
  );
}
