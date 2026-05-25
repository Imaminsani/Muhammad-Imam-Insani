import React, { useState } from "react";
import { 
  Coffee, Cpu, Sparkles, Heart, Scissors, Code, Palette, Smile, 
  Flame, Shield, Compass, BookOpen, Lightbulb, Check, Phone, 
  Mail, MapPin, Clock, Instagram, ExternalLink, ChevronDown, 
  ChevronUp, User, Star, Award, Briefcase, Play, HelpCircle
} from "lucide-react";
import { BusinessProfile } from "../types";
import { THEME_PALETTES } from "../data";
import wismaBidaraImg from "../assets/images/wisma_bidara_hero_1779429604365.png";

// Helper map to dynamically resolve Lucide icons based on names generated/selected
const ICON_MAP: Record<string, any> = {
  Coffee, Cpu, Sparkles, Heart, Scissors, Code, Palette, Smile, 
  Flame, Shield, Compass, BookOpen, Lightbulb, User, Award, Briefcase, Play
};

interface WebsitePreviewProps {
  profile: BusinessProfile;
  viewportWidth: 'desktop' | 'tablet' | 'mobile';
  isPreviewOnly?: boolean;
}

export default function WebsitePreview({ profile, viewportWidth, isPreviewOnly = false }: WebsitePreviewProps) {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'products'>('all');

  const { 
    theme, businessName, category, slogan, aboutUs, story, 
    services, products, testimonials, faq, team, contactInfo, 
    operatingHours, profileImageUrl 
  } = profile;
  
  // Get design system according to theme selector
  const palette = THEME_PALETTES[theme] || THEME_PALETTES.minimalist;

  // Resolve icons safely
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    const IconComponent = ICON_MAP[name] || Sparkles;
    return <IconComponent className={className} />;
  };

  const getViewportClass = () => {
    switch (viewportWidth) {
      case 'mobile':
        return 'max-w-[390px] rounded-3xl border-[8px] border-neutral-800 shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] rounded-2xl border-[6px] border-neutral-800 shadow-xl';
      case 'desktop':
      default:
        return 'w-full rounded-lg border border-neutral-200 shadow-md';
    }
  };

  const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Map standard Day names to index
  const dayNameMapping: Record<string, number> = {
    "Minggu": 0, "Sunday": 0,
    "Senin": 1, "Monday": 1,
    "Selasa": 2, "Tuesday": 2,
    "Rabu": 3, "Wednesday": 3,
    "Kamis": 4, "Thursday": 4,
    "Jumat": 5, "Friday": 5,
    "Sabtu": 6, "Saturday": 6
  };

  return (
    <div className={`transition-all duration-300 bg-white overflow-hidden mx-auto h-[780px] flex flex-col ${getViewportClass()}`}>
      
      {/* Browser chrome header (only if desktop display) */}
      <div className="bg-neutral-100 px-4 py-2 flex items-center gap-2 border-b border-neutral-200 select-none text-[10px] text-neutral-400 shrink-0">
        <div className="flex gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
        </div>
        <div className="bg-white rounded px-2 py-0.5 text-center flex-1 max-w-[400px] border border-neutral-200 truncate flex items-center justify-center gap-1">
          <span className="text-emerald-500 font-bold select-none text-[8px]">🔒</span>
          https://{businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.id
        </div>
      </div>

      {/* Website Body Canvas */}
      <div className={`flex-1 overflow-y-auto scroll-smooth ${palette.bgLight} ${palette.fontSans} text-neutral-800 text-sm`}>
        
        {/* Navigation Bar */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-neutral-100 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={`${businessName} Logo`} 
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-neutral-200" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-8 h-8 rounded-lg ${palette.primary} text-white flex items-center justify-center font-bold tracking-wider text-sm`}>
                {businessName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className={`font-semibold text-base tracking-tight ${palette.textPrimary}`}>{businessName}</span>
          </div>

          {viewportWidth === 'desktop' && (
            <nav className="flex gap-4 text-xs font-medium text-neutral-500">
              <a href="#about" className="hover:text-neutral-900">Tentang</a>
              {profile.reports && profile.reports.length > 0 && (
                <a href="#reports" className="hover:text-neutral-900 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">🔔 Laporan</a>
              )}
              <a href="#services" className="hover:text-neutral-900">Layanan</a>
              <a href="#testimonials" className="hover:text-neutral-900">Ulasan</a>
              <a href="#contact" className="hover:text-neutral-900">Hubungi</a>
            </nav>
          )}

          <div className="flex items-center">
            <span className="px-2 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 h-fit rounded flex items-center gap-1 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aktif
            </span>
          </div>
        </header>

        {/* Hero Banner Section */}
        <section className={`px-6 py-16 text-center relative overflow-hidden flex flex-col justify-center items-center ${palette.bgDark} border-b border-neutral-100`}>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${palette.primary} text-white uppercase tracking-wider mb-4 inline-block`}>
            {category}
          </span>
          
          <h1 className={`text-3xl ${palette.fontDisplay} ${palette.textPrimary} max-w-2xl mb-4 leading-tight`}>
            {slogan}
          </h1>
          
          <p className={`${palette.textSecondary} text-sm max-w-xl mb-8 leading-relaxed`}>
            {aboutUs}
          </p>

          <div className="flex gap-3 justify-center mb-6">
            <a 
              href="#contact" 
              className={`px-5 py-2.5 rounded-full font-medium text-xs text-white ${palette.primary} transition-all transform hover:scale-[1.02] shadow-sm flex items-center gap-1`}
            >
              <Phone className="w-3.5 h-3.5" />
              Hubungi Kami
            </a>
            <a 
              href="#services" 
              className="px-5 py-2.5 rounded-full font-medium text-xs text-neutral-700 bg-white border border-neutral-200 transition-all hover:bg-neutral-50 flex items-center gap-1"
            >
              Lihat Layanan
            </a>
          </div>

          {/* Business Profile Photo Block */}
          {(profileImageUrl || businessName.toLowerCase().includes("bidara")) && (
            <div className="mt-4 max-w-lg w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white/85 group hover:scale-[1.01] transition-all duration-300">
              <img 
                src={profileImageUrl || wismaBidaraImg} 
                alt={`Foto Profil ${businessName}`} 
                className="w-full h-56 sm:h-64 object-cover select-none filter contrast-[1.01]"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </section>

        {/* About Us & Authentic Story */}
        <section id="about" className="px-6 py-12 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mb-2`}>Kisah & Warisan Kami</h2>
            <div className={`w-12 h-1 mx-auto ${palette.primary} rounded-full`}></div>
          </div>

          <div className={`${palette.cardBg} p-6 rounded-xl shadow-xs border border-neutral-100`}>
            <div className="flex items-start gap-4 mb-4">
              <span className={`p-2.5 rounded-lg ${palette.bgDark} ${palette.textPrimary} shrink-0`}>
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Dibuat Dengan Dedikasi Murni</h3>
                <p className="text-xs text-neutral-400">Selalu mengutamakan ketulusan, kualitas, dan dampak lokal</p>
              </div>
            </div>
            
            <div className={`${palette.textSecondary} leading-relaxed text-xs space-y-4 whitespace-pre-line border-t border-neutral-100/80 pt-4`}>
              {story}
            </div>
          </div>
        </section>

        {/* Papan Berita & Laporan Situasi Kondisi Wisma */}
        {profile.reports && profile.reports.length > 0 && (
          <section id="reports" className="px-6 py-12 max-w-3xl mx-auto border-t border-neutral-100/80">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded uppercase">Pembaruan Real-Time</span>
              <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mt-2 mb-2`}>Papan Situasi & Kondisi Wisma</h2>
              <p className={`text-xs ${palette.textSecondary} max-w-md mx-auto`}>
                Laporan transparansi kondisi fasilitas, jadwal pemeliharaan jetpump/wifi, dan info harian langsung dari pengelola Wisma.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              {profile.reports.map((rep) => (
                <div 
                  key={rep.id} 
                  className={`${palette.cardBg} p-5 rounded-2xl border border-neutral-150 shadow-3xs hover:shadow-2xs transition-all relative overflow-hidden`}
                >
                  {/* Status Indicator Band */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    rep.status === 'aman' ? 'bg-emerald-500' :
                    rep.status === 'perbaikan' ? 'bg-rose-500' :
                    'bg-blue-500'
                  }`}></div>

                  <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                      📅 {rep.date}
                    </span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1.5 ${
                      rep.status === 'aman' ? 'bg-emerald-50 text-emerald-800' :
                      rep.status === 'perbaikan' ? 'bg-rose-50 text-rose-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        rep.status === 'aman' ? 'bg-emerald-500' :
                        rep.status === 'perbaikan' ? 'bg-rose-500 animate-pulse' :
                        'bg-blue-500'
                      }`}></span>
                      {rep.status === 'aman' ? 'Kondisi Aman' : rep.status === 'perbaikan' ? 'Perbaikan' : 'Informasi'}
                    </span>
                  </div>

                  <h3 className="font-bold text-neutral-900 text-xs sm:text-sm mb-2 leading-snug">
                    {rep.title}
                  </h3>

                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Services & Featured Products */}
        <section id="services" className={`px-6 py-12 ${palette.bgDark} border-y border-neutral-100`}>
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center mb-8">
              <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mb-2`}>Penawaran Unggulan</h2>
              <p className={`text-xs ${palette.textSecondary} max-w-lg mx-auto`}>
                Kombinasi layanan ramah dan produk unggulan yang dirancang khusus untuk kenyamanan Anda.
              </p>

              {/* Tab Selector */}
              <div className="flex justify-center mt-6 p-0.5 bg-neutral-100/80 backdrop-blur rounded-full w-fit mx-auto border border-neutral-200/50">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'all' ? `${palette.primary} text-white shadow-xs` : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setActiveTab('services')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'services' ? `${palette.primary} text-white shadow-xs` : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  Jasa Layanan
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'products' ? `${palette.primary} text-white shadow-xs` : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  Produk Toko
                </button>
              </div>
            </div>

            {/* Services Grid */}
            {(activeTab === 'all' || activeTab === 'services') && (
              <div className="mb-8">
                {activeTab === 'all' && services.length > 0 && (
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${palette.textPrimary} mb-4 flex items-center gap-2`}>
                    <Briefcase className="w-4 h-4" /> Jasa Layanan Utama
                  </h3>
                )}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((item) => (
                    <div 
                      key={item.id} 
                      className={`${palette.cardBg} p-5 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer group hover:-translate-y-0.5`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className={`p-2 rounded-lg ${palette.bgLight} ${palette.textPrimary} group-hover:${palette.primary} group-hover:text-white transition-all`}>
                          {renderIcon(item.iconName, "w-4 h-4")}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-1 mb-1">
                            <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{item.title}</h4>
                            {item.price && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 rounded text-neutral-700 whitespace-nowrap shrink-0">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-500 text-xs leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {(activeTab === 'all' || activeTab === 'products') && (
              <div>
                {activeTab === 'all' && products.length > 0 && (
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${palette.textPrimary} mb-4 flex items-center gap-2 mt-4`}>
                    <Sparkles className="w-4 h-4" /> Katalog Produk Fisik
                  </h3>
                )}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((item) => (
                    <div 
                      key={item.id} 
                      className={`${palette.cardBg} p-5 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer group hover:-translate-y-0.5`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{item.name}</h4>
                            <span className={`text-[11px] font-extrabold ${palette.textPrimary} whitespace-nowrap`}>
                              {item.price}
                            </span>
                          </div>
                          <p className="text-neutral-500 text-xs leading-relaxed mb-3">{item.description}</p>
                        </div>
                        <button className="text-left font-semibold text-[10px] uppercase tracking-wider text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mt-1">
                          <Check className="w-3.5 h-3.5" /> Pesan Sekarang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="bg-white/50 border border-dashed border-neutral-200 text-center py-6 rounded-lg text-xs text-neutral-400">
                    Belum ada produk fisik terdaftar. Silakan tambah via formulir pengedit.
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 py-12 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mb-2`}>Tim Profesional Kami</h2>
            <p className="text-xs text-neutral-500">Kekuatan di balik kesederhanaan layanan prima kami</p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member) => (
              <div key={member.id} className={`${palette.cardBg} p-5 rounded-xl border border-neutral-100 flex gap-4 items-start`}>
                <div className={`w-12 h-12 rounded-full ${palette.bgDark} ${palette.textPrimary} flex items-center justify-center shrink-0 border-2 border-white shadow-xs`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-0.5">{member.name}</h4>
                  <p className={`text-[10px] font-semibold tracking-wider uppercase mb-2 ${palette.textPrimary}`}>{member.role}</p>
                  <p className="text-neutral-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className={`px-6 py-12 ${palette.bgLight} border-t border-neutral-100`}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mb-2`}>Suara Pelanggan</h2>
              <p className="text-xs text-neutral-500">Nilai jujur dari mereka yang telah mempercayakan kebutuhannya kepada kami</p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-xl shadow-xs border border-neutral-100 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-0.5 text-amber-500 mb-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs italic leading-relaxed mb-4">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="border-t border-neutral-50 pt-2.5 mt-2 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-[10px] ${palette.textPrimary}`}>
                      {review.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-950 text-xs">{review.name}</h4>
                      <p className="text-[10px] text-neutral-400">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expandable FAQs Accordion */}
        <section className="px-6 py-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-xl ${palette.fontDisplay} ${palette.textPrimary} mb-2`}>Tanya & Jawab (FAQ)</h2>
            <p className="text-xs text-neutral-500">Beberapa pertanyaan mendasar yang lazim diajukan pelanggan baru kami</p>
          </div>

          <div className="space-y-3">
            {faq.map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`rounded-lg border transition-all ${isOpen ? 'border-neutral-300 bg-white shadow-xs' : 'border-neutral-200 hover:border-neutral-300 bg-white/50'}`}
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : item.id)}
                    className="w-full px-4 py-3.5 text-left flex justify-between items-center gap-3 font-semibold text-neutral-900 text-xs sm:text-sm hover:text-neutral-950"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                      {item.question}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 flex flex-col gap-1.5">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer / Connect Info */}
        <footer id="contact" className={`px-6 py-12 bg-neutral-900 text-neutral-400 border-t border-neutral-800`}>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Quick Pitch */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt={businessName} 
                    className="w-7 h-7 rounded object-cover shrink-0 border border-neutral-700" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded bg-white text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0`}>
                    {businessName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-sm tracking-tight text-white">{businessName}</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-4">
                {aboutUs}
              </p>
              <div className="flex gap-2.5">
                {contactInfo.instagram && (
                  <a 
                    href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white transition-all text-xs flex items-center gap-1.5 border border-neutral-700/50"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {contactInfo.instagram}
                  </a>
                )}
              </div>
            </div>

            {/* Operations Hours and Contacts */}
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-300" /> Jam Operasional
              </h3>
              <div className="grid grid-cols-2 gap-1 text-[11px] bg-neutral-950 p-3 rounded-lg border border-neutral-800 max-w-sm">
                {operatingHours.map((op, i) => {
                  const mappedDayIndex = dayNameMapping[op.day];
                  const isToday = currentDayIndex === mappedDayIndex;
                  return (
                    <React.Fragment key={i}>
                      <span className={`${isToday ? 'font-bold text-emerald-400' : 'text-neutral-500'}`}>
                        {op.day} {isToday && '• Hari ini'}
                      </span>
                      <span className={`text-right ${isToday ? 'font-bold text-emerald-400' : 'text-neutral-300'}`}>
                        {op.hours}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="max-w-3xl mx-auto pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-white font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {contactInfo.address}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1 hover:text-white">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  {contactInfo.email}
                </span>
                <span className="flex items-center gap-1 hover:text-white">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  {contactInfo.phone}
                </span>
              </span>
            </div>

            <div className="flex gap-2">
              {contactInfo.whatsappDirect && (
                <a 
                  href={contactInfo.whatsappDirect}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-md shadow-emerald-950/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp Kami
                </a>
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-8 text-center text-[10px] text-neutral-600">
            &copy; {new Date().getFullYear()} {businessName}. Hak Cipta Dilindungi. Profil dibuat via Pembuat Profil Bisnis AI.
          </div>
        </footer>

      </div>
    </div>
  );
}
