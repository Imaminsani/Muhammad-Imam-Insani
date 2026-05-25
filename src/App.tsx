import React, { useState, useEffect } from "react";
import { 
  Sparkles, Download, Upload, Printer, Play, 
  Smartphone, Tablet, Laptop, RefreshCw, Eye, 
  EyeOff, Check, AlertCircle, HelpCircle, FileJson, 
  Briefcase, Coffee, ChevronRight, Compass, ArrowRight, Info,
  Database, Server, Wifi, WifiOff, Search, Users, Layers, Plus, Trash2, Edit, Activity, Shield
} from "lucide-react";
import { BusinessProfile } from "./types";
import { PRESET_BUSINESSES } from "./data";
import ProfileForms from "./components/ProfileForms";
import WebsitePreview from "./components/WebsitePreview";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [profile, setProfile] = useState<BusinessProfile>(PRESET_BUSINESSES[0]);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // State for AI drafting status
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Custom states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  // High-level role view: 'public' (Visitor website) vs 'admin' (Owner dashboard panel)
  const [roleMode, setRoleMode] = useState<'public' | 'admin'>('public');

  // Secure Owner authentication states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin CRUD View States (inside the Owner dashboard portal)
  const [activeView, setActiveView] = useState<'editor' | 'admin'>('admin');
  const [allProfiles, setAllProfiles] = useState<BusinessProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [adminMessage, setAdminMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [adminSearch, setAdminSearch] = useState("");

  const fetchAllProfiles = async () => {
    setIsLoadingProfiles(true);
    setAdminMessage(null);
    try {
      const res = await fetch("/api/firebase/list");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profiles) {
          setAllProfiles(data.profiles);
        }
      }
    } catch (err: any) {
      console.error("Gagal menyelaraskan list profil:", err);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (roleMode === 'admin') {
      fetchAllProfiles();
    }
  }, [roleMode, activeView]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (user === "wismabidara" && pass === "Hasdudi19") {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setRoleMode('admin');
      setActiveView('admin');
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("ID atau Password salah! Silakan coba lagi dengan ID 'wismabidara' & Password 'Hasdudi19'.");
    }
  };

  const handleDeleteProfile = async (name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus profil "${name}" secara permanen dari database & fallback lokal?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/firebase/delete?name=${encodeURIComponent(name)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMessage({ type: 'success', text: `Sukses menghapus profil "${name}"!` });
        await fetchAllProfiles();
      } else {
        throw new Error(data.message || "Gagal menghapus.");
      }
    } catch (err: any) {
      setAdminMessage({ type: 'error', text: `Gagal menghapus: ${err.message}` });
    }
  };

  const handleCreateEmptyProfile = () => {
    const newProfile: BusinessProfile = {
      businessName: `Wisma Bidara ${Date.now().toString().slice(-3)}`,
      category: "Akomodasi / Kontrakan & Kost Eksklusif",
      slogan: "Hunian Eksklusif Penuh Kenyamanan di Pusat Kota",
      aboutUs: "Wisma Bidara baru menyajikan ruang tinggal sewa bulanan berkelas dengan perpaduan asri alam tropis dan sentuhan kepengurusan yang siaga melayani Anda dengan tulus.",
      story: "Dikembangkan sebagai komitmen perluasan ekosistem hunian berkualitas tinggi demi memenuhi tingginya permintaan sewa dari kalangan profesional cerdas dan keluarga urban modern.",
      theme: "luxury",
      services: [
        { id: "s1", title: "Sewa Unit Kontrakan Eksklusif", description: "Unit tinggal mandiri fully furnished, sirkulasi udara teduh, dan area parkir pribadi beratap.", price: "Rp 3.500.000 / Bulan", iconName: "Home" },
        { id: "s2", title: "Kamar Kost Premium Suite", description: "Kamar studio bergaransi fasilitas internet fiber serat optic kencang, AC hemat daya, dan laundry rutin.", price: "Rp 1.800.000 / Bulan", iconName: "Sparkles" }
      ],
      products: [
        { id: "p1", name: "Jasa Pembersihan Unit Komprehensif", description: "Dukungan kebersihan berkala di dalam kamar / rumah kontrakan oleh tim house-keeping handal.", price: "Rp 100.000 / Kunjungan" }
      ],
      testimonials: [
        { id: "t1", name: "Budi Setiawan", role: "Penyewa Unit 4B", comment: "Sangat betah tinggal di sini. Lingkungan tenang, bapak pengurus sangat cekatan melayani kebutuhan air dan listrik.", rating: 5 }
      ],
      faq: [
        { id: "f1", question: "Apakah ada biaya parkir tambahan?", answer: "Satu unit sewa sudah mendapatkan hak parkir gratis satu slot mobil/motor di bawah naungan kanopi teduh." }
      ],
      team: [
        { id: "m1", name: "Pak Slamet", role: "Pengelola Lapangan", bio: "Senantiasa standby memastikan fasilitas utilitas air jernih dan kelistrikan berjalan lancar tanpa kendala." }
      ],
      contactInfo: {
        email: "kontak@wismabidara.id",
        phone: "+62 811-2233-4455",
        address: "Kawasan Bidara Raya No. 12B, Cilandak Barat, Jakarta Selatan, DKI Jakarta",
        instagram: "@wisma.bidara",
        whatsappDirect: "https://wa.me/6281122334455"
      },
      operatingHours: [
        { day: "Senin - Minggu", hours: "08:00 - 20:00" }
      ]
    };
    setProfile(newProfile);
    setActiveView('editor');
    setDbSyncMessage({ type: 'success', text: "Berhasil membuat draft profil baru! Silakan edit lalu sinkronkan ke database." });
  };

  // MySQL Sync States
  const [dbStatus, setDbStatus] = useState<{ 
    configured: boolean; 
    connected: boolean; 
    message: string; 
    dbConfig?: { host: string; user: string; database: string } 
  } | null>(null);
  const [dbSyncLoading, setDbSyncLoading] = useState(false);
  const [dbSyncMessage, setDbSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch DB Status on Mount
  useEffect(() => {
    checkDbStatus();
  }, [profile.businessName]);

  const checkDbStatus = async () => {
    try {
      const res = await fetch("/api/firebase/status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.error("Gagal koordinasi status Firebase:", err);
    }
  };

  // Sync / Save current profile to Firebase
  const handleSaveToFirebase = async () => {
    setDbSyncLoading(true);
    setDbSyncMessage(null);
    try {
      const res = await fetch("/api/firebase/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDbSyncMessage({ type: 'success', text: data.message });
        await checkDbStatus();
      } else {
        throw new Error(data.message || "Gagal menyelaraskan.");
      }
    } catch (err: any) {
      setDbSyncMessage({ 
        type: 'error', 
        text: err.message || "Gagal menghubungi database cloud Firebase Firestore." 
      });
    } finally {
      setDbSyncLoading(false);
    }
  };

  // Pull / Load from Firebase
  const handleLoadFromFirebase = async () => {
    setDbSyncLoading(true);
    setDbSyncMessage(null);
    try {
      const res = await fetch(`/api/firebase/load?name=${encodeURIComponent(profile.businessName)}`);
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        setProfile(data.profile);
        setDbSyncMessage({ 
          type: 'success', 
          text: `Berhasil mengambil & menerapkan profil "${profile.businessName}" langsung dari database Firebase Firestore!` 
        });
      } else {
        throw new Error(data.message || "Sesi profil nama ini belum tersimpan di Firebase Firestore.");
      }
    } catch (err: any) {
      setDbSyncMessage({ 
        type: 'error', 
        text: err.message || "Gagal mengambil data dari Firebase. Coba simpan/sinkronkan profil terlebih dahulu." 
      });
    } finally {
      setDbSyncLoading(false);
    }
  };

  // Switch presets
  const handleSelectPreset = (index: number) => {
    setProfile(PRESET_BUSINESSES[index]);
    setApiError(null);
    setDbSyncMessage(null);
  };

  // Call server-side Gemini generation via our full-stack endpoint
  const handleAiGenerate = async (params: { 
    businessName: string; 
    category: string; 
    description: string; 
    theme: string 
  }) => {
    setIsAiGenerating(true);
    setApiError(null);
    
    // Staggered descriptive states to improve UX perception while Gemini thinks
    const statuses = [
      "Mengontak asisten cerdas Gemini...",
      "Melakukan brainstorm gagasan slogan puitis...",
      "Menyusun katalog komparasi layanan utama...",
      "Merancang kisah ketulusan perjuangan usaha...",
      "Mengharmonisasikan detail kontak & jam operasional..."
    ];
    
    let currentStatusIndex = 0;
    setAiStatus(statuses[0]);
    
    const interval = setInterval(() => {
      if (currentStatusIndex < statuses.length - 1) {
        currentStatusIndex++;
        setAiStatus(statuses[currentStatusIndex]);
      }
    }, 2800);

    try {
      const response = await fetch("/api/generate-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate business profile.");
      }

      const generatedProfile: Omit<BusinessProfile, 'theme'> = await response.json();
      
      // Update our react state with the returned JSON plus the selected client theme style
      setProfile({
        ...generatedProfile,
        theme: params.theme as any,
      });
      
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Gagal menghubungkan atau memproses dengan Gemini AI.");
    } finally {
      clearInterval(interval);
      setIsAiGenerating(false);
      setAiStatus("");
    }
  };

  // Export profile content as offline JSON file
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(profile, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `profil-${profile.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Quick imports via JSON Text
  const handleImportJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText.trim());
      // basic validation of schema
      if (!parsed.businessName || !parsed.slogan || !parsed.services || !parsed.contactInfo) {
        throw new Error("Struktur JSON tidak lengkap. Pastikan memiliki nama, slogan, layanan, dan kontak.");
      }
      setProfile(parsed);
      setShowImportModal(false);
      setImportJsonText("");
    } catch (err: any) {
      setImportError(err.message || "JSON tidak valid. Periksa tanda koma dan tanda kurung kurawal Anda.");
    }
  };

  // Trigger default print layout
  const handlePrintLayout = () => {
    window.print();
  };

  if (roleMode === 'public') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-neutral-800">
        {/* Dynamic Print Header (Invisible on Web, visible on paper print) */}
        <div className="hidden print:block p-8 bg-white text-black">
          <h1 className="text-3xl font-extrabold">{profile.businessName}</h1>
          <p className="text-lg text-neutral-600 font-serif italic mb-6">{profile.slogan}</p>
          <h2 className="text-xl font-bold border-b pb-1 mt-6 mb-3">Tentang Usaha Kami</h2>
          <p className="text-sm leading-relaxed mb-6 whitespace-pre-wrap">{profile.story}</p>
          <h2 className="text-xl font-bold border-b pb-1 mt-6 mb-3">Layanan & Jasa Utama</h2>
          <div className="space-y-4">
            {profile.services.map((srv, i) => (
              <div key={i} className="border-l-4 border-slate-700 pl-4 py-1">
                <h3 className="font-extrabold text-sm">{srv.title} — {srv.price}</h3>
                <p className="text-xs text-neutral-600 mt-0.5">{srv.description}</p>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold border-b pb-1 mt-8 mb-3">Hubungi Kontak</h2>
          <p className="text-sm">Alamat: {profile.contactInfo.address}</p>
          <p className="text-sm">WhatsApp: {profile.contactInfo.phone}</p>
          <p className="text-sm">Email: {profile.contactInfo.email}</p>
        </div>

        {/* Immersive Public Mode Floating Header with admin portals access */}
        <div className="bg-neutral-900 border-b border-neutral-800 text-white px-6 py-3 shrink-0 print:hidden shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Compass className="w-4 h-4 text-white animate-spin-slow" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-widest leading-none">
                    Tampilan Publik Umum
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono hidden md:inline">
                    https://{profile.businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.id
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">
                  Ini adalah laman resmi <span className="text-white font-extrabold">{profile.businessName}</span> yang diakses langsung oleh khalayak umum.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Devices viewport responsive shortcuts */}
              <div className="flex items-center bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded transition-all ${viewport === 'desktop' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-350'}`}
                  title="Tampilan Dekstop"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded transition-all ${viewport === 'tablet' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-350'}`}
                  title="Tampilan Tablet"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded transition-all ${viewport === 'mobile' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-350'}`}
                  title="Tampilan Seluler"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="px-3 py-1.5 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                Layar Penuh
              </button>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setRoleMode('admin');
                    setActiveView('admin');
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-600 text-white font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-indigo-950/20 cursor-pointer border border-indigo-500/10"
              >
                <Shield className="w-3.5 h-3.5" />
                🔑 Masuk Portal Pemilik Kos
              </button>
            </div>
          </div>
        </div>

        {/* Live Visual Board Viewport */}
        <div className="flex-1 p-3 sm:p-6 lg:p-8 flex items-center justify-center bg-slate-50 overflow-y-auto">
          <div className="w-full h-full max-w-7xl flex flex-col justify-center">
            <WebsitePreview 
              profile={profile}
              viewportWidth={viewport}
            />
          </div>
        </div>

        {/* Immersive compact bottom info block */}
        <div className="bg-white border-t border-neutral-200/60 p-3.5 text-center text-[11px] text-neutral-400 font-bold shrink-0">
          🏡 {profile.businessName} &copy; {new Date().getFullYear()} Hak Cipta Dilindungi. Hubungi Kontrakan / Kost di {profile.contactInfo.phone}.
        </div>

        {/* Floating Action Button (FAB) for direct admin portal login */}
        <div className="fixed bottom-6 right-6 z-40 print:hidden select-none">
          <button
            onClick={() => {
              if (isAuthenticated) {
                setRoleMode('admin');
                setActiveView('admin');
              } else {
                setShowLoginModal(true);
              }
            }}
            className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-indigo-500/30 animate-pulse group"
            title="Masuk Ke Portal Admin & Kelola Unit"
          >
            <Shield className="w-5 h-5 text-yellow-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
            <span className="text-xs sm:text-xs tracking-wider uppercase">Tombol Masuk Admin 🔑</span>
          </button>
        </div>

        {/* Fullscreen Modal Support */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-center animate-fadeIn p-4 sm:p-8">
            <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden h-[90vh] flex flex-col relative">
              <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                    Pratinjau Layar Penuh: {profile.businessName}
                  </span>
                </div>
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Keluar Layar Penuh
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <WebsitePreview 
                  profile={profile}
                  viewportWidth="desktop"
                  isPreviewOnly={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Beautiful Secure Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-scaleIn flex flex-col gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-2xs">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Login Portal Pemilik Kos</h3>
                <p className="text-xs text-neutral-400 font-semibold max-w-xs mx-auto">
                  Silakan masukkan akses pengenal ID Anda untuk mengelola unit, laporan sewa, dan informasi kost.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-805 text-xs font-bold flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
                    ID Pengguna / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => {
                      setLoginUsername(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    placeholder="Contoh: admin"
                    className="w-full px-3.5 py-2.5 bg-neutral-55 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-650 transition-all text-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
                    Kata Sandi / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-neutral-55 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-650 transition-all text-neutral-800"
                  />
                </div>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-150/70 text-[11px] text-amber-900 font-bold leading-relaxed flex items-start gap-1.5 shadow-3xs">
                  💡 <span className="block shrink-0 mt-0.5">Note:</span> 
                  <span>Gunakan ID <code className="bg-amber-100/85 text-amber-950 px-1 py-0.2 rounded font-black font-mono">wismabidara</code> dan Password <code className="bg-amber-100/85 text-amber-950 px-1 py-0.2 rounded font-black font-mono">Hasdudi19</code> untuk masuk.</span>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginUsername("");
                      setLoginPassword("");
                      setLoginError("");
                    }}
                    className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-150 text-neutral-700 font-extrabold rounded-xl text-xs transition-all text-center cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Masuk Portal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin View Rendering Mode (strictly for Cosan Owners)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-neutral-800">
      
      {/* Dynamic Print Header (Invisible on Web, visible on paper print) */}
      <div className="hidden print:block p-8 bg-white text-black">
        <h1 className="text-3xl font-extrabold">{profile.businessName}</h1>
        <p className="text-lg text-neutral-600 font-serif italic mb-6">{profile.slogan}</p>
        <h2 className="text-xl font-bold border-b pb-1 mt-6 mb-3">Tentang Usaha Kami</h2>
        <p className="text-sm leading-relaxed mb-6 whitespace-pre-wrap">{profile.story}</p>
        <h2 className="text-xl font-bold border-b pb-1 mt-6 mb-3">Layanan & Jasa Utama</h2>
        <div className="space-y-4">
          {profile.services.map((srv, i) => (
            <div key={i} className="border-l-4 border-slate-700 pl-4 py-1">
              <h3 className="font-extrabold text-sm">{srv.title} — {srv.price}</h3>
              <p className="text-xs text-neutral-600 mt-0.5">{srv.description}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold border-b pb-1 mt-8 mb-3">Hubungi Kontak</h2>
        <p className="text-sm">Alamat: {profile.contactInfo.address}</p>
        <p className="text-sm">WhatsApp: {profile.contactInfo.phone}</p>
        <p className="text-sm">Email: {profile.contactInfo.email}</p>
      </div>

      {/* Primary Owner Secure Dashboard Navbar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 shrink-0 print:hidden shadow-xs">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-650 text-white flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-neutral-900 text-white uppercase tracking-wider">
                Platform Pemilik Kos
              </span>
              <span className="text-neutral-300 font-semibold text-xs">|</span>
              <span className="text-[10px] text-indigo-750 font-black tracking-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Firestore Connected
              </span>
            </div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 leading-none mt-1">
              Portal Admin & Manajemen Wisma Bidara
            </h1>
          </div>
        </div>

        {/* View Switching Tab Area within Owner space */}
        <div className="flex items-center justify-center gap-1 bg-neutral-105 p-1 rounded-xl border border-neutral-200 w-full md:w-auto shrink-0 shadow-3xs">
          <button
            onClick={() => setActiveView('admin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeView === 'admin' ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. Katalog Database Kost ({allProfiles.length})
          </button>
          <button
            onClick={() => setActiveView('editor')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeView === 'editor' ? 'bg-indigo-650 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'}`}
          >
            <Edit className="w-3.5 h-3.5" />
            2. Formulir Desainer Isian
          </button>
        </div>

        {/* Action button groupings */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setRoleMode('public')}
            className="px-3.5 py-2 hover:bg-neutral-50 bg-white rounded-lg text-xs font-bold text-neutral-700 border border-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Tinjau tampilan publik secara langsung"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-500" />
            Pratinjau Publik
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              setRoleMode('public');
            }}
            className="px-3.5 py-2 hover:bg-red-700 bg-red-650 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-100"
            title="Keluar secara aman dan kunci kembali Portal Pengurus"
          >
            <EyeOff className="w-3.5 h-3.5" />
            Keluar & Kunci Portal
          </button>

          <button 
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 hover:bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-600 transition-all flex items-center gap-1.5 border border-neutral-200"
            title="Import profil dari file JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            Unggah Profil
          </button>

          <button 
            onClick={handleExportJson}
            className="px-3.5 py-2 hover:bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-600 transition-all flex items-center gap-1.5 border border-neutral-200"
            title="Download profil sebagai data JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor JSON
          </button>

          <button 
            onClick={handlePrintLayout}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-black rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm"
            title="Cetak leaflet rincian kos"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-300" />
            Cetak Profil
          </button>
        </div>
      </header>

      {/* Structured Info Bar for Owner */}
      <div className="bg-amber-50/50 px-6 py-2.5 border-b border-amber-100/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-800 uppercase tracking-wider text-[10px] bg-amber-100/80 px-2 py-0.5 rounded">Fokus Manajemen Aktif:</span>
          <span className="text-neutral-700 font-extrabold">🏡 {profile.businessName} (Kategori: {profile.category})</span>
        </div>

        <div className="text-neutral-500 text-[11px] font-medium italic flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Edit rincian data unit kamar, laporan bulanan, orari pada Formulir Desainer Isian lalu unggah ke Firestore!
        </div>
      </div>

      {/* Main Board Workstation */}
      <AnimatePresence mode="wait">
        {activeView === 'editor' && (
          <motion.main
            key="editor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:hidden overflow-hidden"
          >
        
        {/* MySQL Realtime Synchronizer Panel */}
        <div className="lg:col-span-12 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm text-neutral-900 tracking-tight">Konektivitas Database Firebase Firestore Aktif</h3>
                {dbStatus?.connected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-150 text-emerald-800 flex items-center gap-1 leading-none shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Firebase Terhubung (Real-time Cloud)
                  </span>
                ) : dbStatus?.configured ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Layanan Firebase Ofline / Cloud Error
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Penyimpanan Lokal (Siap Hubungkan Firebase)
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed max-w-3xl">
                Sistem mendukung sinkronisasi real-time cloud ke Firebase. {dbStatus?.connected 
                  ? `Terhubung ke basis data cloud Firestore "${dbStatus.dbConfig?.databaseId}" di proyek "${dbStatus.dbConfig?.projectId}". Setiap perubahan profil diselaraskan secara permanen!`
                  : "Aplikasi diselaraskan secara real-time ke web cloud serta dicadangkan di folder lokal agar aman."
                }
              </p>
              
              {/* Display sync notifications */}
              {dbSyncMessage && (
                <div className={`mt-2 p-2 px-3 rounded-lg text-[11px] leading-relaxed flex items-center gap-2 font-semibold animate-fadeIn ${
                  dbSyncMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {dbSyncMessage.type === 'success' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  <span>{dbSyncMessage.text}</span>
                  <button onClick={() => setDbSyncMessage(null)} className="ml-auto hover:text-black font-extrabold text-[12px] opacity-60 hover:opacity-100 transition-all">✕</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleLoadFromFirebase}
              disabled={dbSyncLoading}
              className="flex-1 md:flex-initial px-3.5 py-2 hover:bg-neutral-100 bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              title="Ambil data profil dari database Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${dbSyncLoading ? 'animate-spin' : ''}`} />
              Muat dari Firebase
            </button>
            <button
              onClick={handleSaveToFirebase}
              disabled={dbSyncLoading}
              className="flex-1 md:flex-initial px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-100 disabled:opacity-50"
              title="Simpan profil baru/suntingan langsung ke Firebase"
            >
              <Database className="w-3.5 h-3.5 text-indigo-200" />
              Sinkronkan ke Firebase
            </button>
          </div>
        </div>

        {/* Error notification banner if any */}
        {apiError && (
          <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 text-xs animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold">Gagal Membuat Konten AI</h4>
              <p className="mt-1 leading-relaxed">{apiError}</p>
            </div>
            <button onClick={() => setApiError(null)} className="font-semibold text-red-600 hover:text-red-900 underline">Tutup</button>
          </div>
        )}

        {/* LEFT WORKSPACE: Forms / Gemini Creator */}
        <section className="lg:col-span-5 h-full">
          <div className="sticky top-4">
            <ProfileForms 
              profile={profile}
              onChange={setProfile}
              onAiGenerate={handleAiGenerate}
              isAiGenerating={isAiGenerating}
              aiStatus={aiStatus}
            />
          </div>
        </section>

        {/* RIGHT WORKSPACE: LIVE RENDER SANBOX PREVIEW */}
        <section className="lg:col-span-7 h-full flex flex-col gap-4">
          
          {/* Sizing Chrome controller */}
          <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-2xs shrink-0">
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
              Layar Pratinjau Web
            </span>

            {/* Sizes selectors */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-700'}`}
                title="Pratinjau Laptop / Layar Lebar"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-700'}`}
                title="Pratinjau Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-700'}`}
                title="Pratinjau Handphone"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <span className="w-px h-5 bg-neutral-200 mx-1"></span>
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg transition-all flex items-center gap-1 text-[11px] font-semibold"
                title="Lihat Pratinjau Layar Penuh"
              >
                <Eye className="w-4 h-4" />
                Layar Penuh
              </button>
            </div>
          </div>

          {/* Sandbox Frame container */}
          <div className="flex-1 relative">
            <WebsitePreview 
              profile={profile}
              viewportWidth={viewport}
            />
          </div>

        </section>

          </motion.main>
        )}

        {/* Admin Panel Layout */}
        {activeView === 'admin' && (
          <motion.main
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 print:hidden"
          >
            {/* Header Kontrol Utama */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-750 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Portal Administrator Usaha
                  </span>
                </div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">Katalog Kontrol Profil Usaha (CRUD)</h2>
                <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                  Platform manajemen terpadu yang terhubung langsung ke basis data cloud Firebase Firestore. Kelola, pratinjau, buat, atau hapus entri visual profil usaha Anda di sini.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchAllProfiles}
                  disabled={isLoadingProfiles}
                  className="px-3.5 py-2 border border-neutral-250 hover:border-neutral-350 bg-white text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfiles ? 'animate-spin' : ''}`} />
                  Segarkan
                </button>
                <button
                  onClick={handleCreateEmptyProfile}
                  className="px-4 py-2 hover:bg-neutral-900 bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-neutral-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Profil Baru
                </button>
              </div>
            </div>

            {/* Panel Analitik & KPI Dashboard (4 Grid Column) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* KPI 1: Total Profil */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-3xs flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neutral-950 text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Entri</span>
                  <span className="text-xl font-extrabold text-neutral-900 block mt-0.5">{allProfiles.length} Usaha</span>
                </div>
              </div>

              {/* KPI 2: Total Layanan/Produk */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-3xs flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-600 text-white">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Layanan/Produk</span>
                  <span className="text-xl font-extrabold text-neutral-900 block mt-0.5">
                    {allProfiles.reduce((sum, curr) => sum + (curr.services?.length || 0) + (curr.products?.length || 0), 0)} Item
                  </span>
                </div>
              </div>

              {/* KPI 3: Profil Aktif Sekarang */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-3xs flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-650 text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Pilihan Aktif</span>
                  <span className="text-xs font-black text-indigo-750 block mt-1 select-none truncate max-w-[120px]" title={profile.businessName}>
                    {profile.businessName}
                  </span>
                </div>
              </div>

              {/* KPI 4: Status Database Telemeter */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-3xs flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-150">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Database Engine</span>
                  <span className="text-xs font-black text-emerald-800 block mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                    Firebase Cloud
                  </span>
                </div>
              </div>
            </div>

            {/* Error and Info notifications in admin */}
            {adminMessage && (
              <div className={`p-4 rounded-xl text-xs leading-relaxed flex items-center gap-3 font-semibold border ${
                adminMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {adminMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{adminMessage.text}</span>
              </div>
            )}

            {/* Filter, Search & Table Container */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
              
              {/* Toolbar Pencarian & Filtrasi */}
              <div className="p-4 border-b border-neutral-150 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, kategori..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-neutral-250 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                  {adminSearch && (
                    <button 
                      onClick={() => setAdminSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-black cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 font-extrabold uppercase tracking-wider shrink-0">
                  {adminSearch 
                    ? `Ditemukan ${allProfiles.filter(p => p.businessName.toLowerCase().includes(adminSearch.toLowerCase()) || p.category.toLowerCase().includes(adminSearch.toLowerCase())).length} dari ${allProfiles.length} entri`
                    : `Menampilkan semua (${allProfiles.length} profil terdaftar)`
                  }
                </div>
              </div>

              {isLoadingProfiles ? (
                <div className="py-20 text-center text-xs text-neutral-400 font-bold flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 text-indigo-650 animate-spin" />
                  Membaca Basis Data Firebase & Berkas Lokal...
                </div>
              ) : allProfiles.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 space-y-3">
                  <Database className="w-10 h-10 text-neutral-200 mx-auto" />
                  <p className="text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                    Belum ada profil usaha tersimpan di basis data. Klik tombol "Buat Profil Baru" di atas atau simpan penyuntingan yang sedang aktif ke Firebase!
                  </p>
                  <button
                    onClick={handleSaveToFirebase}
                    className="px-3.5 py-1.5 bg-orange-50 border border-orange-100 text-orange-750 font-bold rounded-lg text-xs hover:bg-orange-100 transition-all cursor-pointer"
                  >
                    Simpan Profil Sekarang Aktif
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                        <th className="px-6 py-3.5">Nama Usaha / Bisnis</th>
                        <th className="px-6 py-3.5">Kategori</th>
                        <th className="px-6 py-3.5">Tema Visual</th>
                        <th className="px-6 py-3.5">Detail Kontak</th>
                        <th className="px-6 py-3.5 font-bold">Offerings</th>
                        <th className="px-6 py-3.5 text-right">Tindakan CRUD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {allProfiles
                        .filter((p) => {
                          const query = adminSearch.toLowerCase();
                          return (
                            p.businessName.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query) ||
                            p.slogan.toLowerCase().includes(query)
                          );
                        })
                        .map((p) => {
                          const isCurrent = profile.businessName === p.businessName;
                          return (
                            <tr 
                              key={p.businessName} 
                              className={`hover:bg-neutral-55 transition-colors border-l-4 ${
                                isCurrent 
                                  ? 'bg-indigo-50/20 border-l-indigo-600' 
                                  : 'border-l-transparent'
                              }`}
                            >
                              {/* Business Name with profile Image display */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {p.profileImageUrl ? (
                                    <img 
                                      src={p.profileImageUrl} 
                                      alt="Profil logo" 
                                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-neutral-200 text-center"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-extrabold text-[12px] flex items-center justify-center shrink-0 shadow-sm">
                                      {p.businessName.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="space-y-0.5">
                                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-1.5">
                                      {p.businessName}
                                      {isCurrent && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                          Sedang Diedit
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 block truncate max-w-[200px] italic">
                                      "{p.slogan || 'Tanpa tag slogan'}"
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Category Badge */}
                              <td className="px-6 py-4">
                                <span className="font-semibold text-neutral-600 bg-neutral-100/80 border border-neutral-150 px-2 rounded-lg text-[10px]">
                                  {p.category}
                                </span>
                              </td>

                              {/* Visual Theme Label */}
                              <td className="px-6 py-4">
                                <span className="capitalize font-mono text-[11px] text-neutral-500 bg-neutral-50 px-2 py-0.5 border border-neutral-100 rounded-md">
                                  👁️ {p.theme}
                                </span>
                              </td>

                              {/* Contact Info */}
                              <td className="px-6 py-4 text-neutral-500 space-y-0.5 text-[11px]">
                                <div className="truncate max-w-xs text-neutral-700 font-medium">📞 {p.contactInfo.phone}</div>
                                <div className="truncate max-w-xs italic text-[10px]">📍 {p.contactInfo.address}</div>
                              </td>

                              {/* Offerings count */}
                              <td className="px-6 py-4">
                                <span className="font-semibold text-neutral-600 bg-blue-50 border border-blue-150 px-2 py-0.5 rounded-lg text-[10px]">
                                  {p.services?.length || 0} Jasa / {p.products?.length || 0} Produk
                                </span>
                              </td>

                              {/* CRUD Action tools */}
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Read / Preview */}
                                  <button
                                    onClick={() => {
                                      setProfile(p);
                                      setDbSyncMessage({ type: 'success', text: `Profil "${p.businessName}" dimuat ke layar!` });
                                      setActiveView('editor');
                                    }}
                                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 text-neutral-700 font-bold rounded-xl transition-all text-[11px] cursor-pointer"
                                    title="Buka & Tinjau di editor"
                                  >
                                    Tinjau
                                  </button>
                                  
                                  {/* Edit Action */}
                                  <button
                                    onClick={() => {
                                      setProfile(p);
                                      setActiveView('editor');
                                    }}
                                    className="px-2.5 py-1.5 bg-indigo-55 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all text-[11px] cursor-pointer"
                                    title="Edit data profil ini"
                                  >
                                    Sunting
                                  </button>
    
                                  {/* Delete Action */}
                                  <button
                                    onClick={() => handleDeleteProfile(p.businessName)}
                                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-all text-[11px] cursor-pointer"
                                    title="Hapus dari database"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* DB connection quick reference info */}
            <div className="bg-neutral-950 text-neutral-400 p-5 rounded-2xl text-[11px] leading-relaxed space-y-2 border border-neutral-800 font-mono shadow-xs">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                INFORMASI SISTEM INTEGRASI METADATA & PERSISTENSI
              </div>
              <p>
                Setiap kali tombol <strong className="text-white">Sunting</strong> ditekan, profil terpilih diangkut ke lembar desainer editor. Setelah menyunting teks, gambar profil, orari jam, atau penambahan team, klik tombol <strong className="text-indigo-400">"Sinkronkan ke Firebase"</strong> di pojok kanan atas Editor untuk menyimpan basis data Cloud.
              </p>
              <p>
                Modul sinkronisasi cadangan server juga tersimpan ke dalam file <code className="text-emerald-400 font-semibold">database_fallback.json</code> di root container, menjamin keutuhan operasional profil Anda di segala kondisi server.
              </p>
            </div>
          </motion.main>
        )}
    </AnimatePresence>

      {/* FULLSCREEN PREVIEW OVERLAY MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-center animate-fadeIn p-4 sm:p-8">
          <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden h-[90vh] flex flex-col relative">
            <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Pratinjau Layar Penuh: {profile.businessName}
                </span>
              </div>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-xs rounded-lg transition-all"
              >
                Keluar Layar Penuh
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {/* Force desktop for fullscreen mode */}
              <WebsitePreview 
                profile={profile}
                viewportWidth="desktop"
                isPreviewOnly={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* IMPORT JSON MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wide text-neutral-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-650" />
                Unggah Data Profil Bisnis
              </h3>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleImportJsonSubmit} className="p-5 space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tempel kode format JSON profil bisnis Anda yang didapatkan dari hasil ekspor sebelumnya ke dalam kolom di bawah ini:
              </p>
              
              {importError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-lg text-xs leading-relaxed">
                  {importError}
                </div>
              )}

              <textarea
                rows={8}
                required
                placeholder='{\n  "businessName": "Contoh..."\n}'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-800 text-[11px] font-mono focus:outline-none bg-slate-50"
              />

              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportError(null);
                  }}
                  className="px-3.5 py-2 hover:bg-neutral-100 rounded-lg border border-neutral-200 text-neutral-500 font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  Confirm & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
