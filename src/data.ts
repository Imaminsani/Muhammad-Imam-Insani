import { BusinessProfile, ThemeColors } from "./types";

export const THEME_PALETTES: Record<string, ThemeColors> = {
  minimalist: {
    primary: "bg-neutral-900 border-neutral-900",
    textPrimary: "text-neutral-900",
    textSecondary: "text-neutral-600",
    bgLight: "bg-neutral-50",
    bgDark: "bg-neutral-100",
    cardBg: "bg-white",
    accent: "text-neutral-500 hover:text-neutral-900",
    fontSans: "font-sans",
    fontDisplay: "font-sans font-bold tracking-tight",
  },
  nature: {
    primary: "bg-emerald-700 border-emerald-700 hover:bg-emerald-800",
    textPrimary: "text-emerald-900",
    textSecondary: "text-stone-600",
    bgLight: "bg-stone-50",
    bgDark: "bg-emerald-50/70",
    cardBg: "bg-white",
    accent: "text-emerald-600 hover:text-emerald-800",
    fontDisplay: "font-serif font-bold tracking-normal",
    fontSans: "font-sans",
  },
  luxury: {
    primary: "bg-amber-800 border-amber-800 hover:bg-amber-900",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-600",
    bgLight: "bg-stone-100/40",
    bgDark: "bg-amber-50/20",
    cardBg: "bg-white border border-amber-100/50 shadow-sm",
    accent: "text-amber-700 hover:text-amber-900",
    fontDisplay: "font-serif italic font-medium tracking-wide",
    fontSans: "font-sans",
  },
  vibrant: {
    primary: "bg-violet-600 border-violet-600 hover:bg-violet-700",
    textPrimary: "text-indigo-950",
    textSecondary: "text-slate-600",
    bgLight: "bg-indigo-50/30",
    bgDark: "bg-violet-50/80",
    cardBg: "bg-white border-2 border-violet-100",
    accent: "text-violet-600 hover:text-violet-800",
    fontDisplay: "font-sans font-extrabold tracking-tight",
    fontSans: "font-sans",
  },
  corporate: {
    primary: "bg-blue-800 border-blue-800 hover:bg-blue-950",
    textPrimary: "text-slate-950",
    textSecondary: "text-slate-600",
    bgLight: "bg-slate-50",
    bgDark: "bg-slate-100/50",
    cardBg: "bg-white shadow",
    accent: "text-blue-700 hover:text-blue-900",
    fontDisplay: "font-sans font-semibold tracking-normal",
    fontSans: "font-sans",
  },
};

export const PRESET_BUSINESSES: BusinessProfile[] = [
  {
    businessName: "Wisma Bidara",
    category: "Akomodasi / Kontrakan & Kost Eksklusif",
    slogan: "Kehangatan Hunian Asri, Kenyamanan Keluarga Modern",
    aboutUs: "Wisma Bidara menghadirkan hunian sewa kontrakan dan kamar kost eksklusif bergaya arsitektur tropis megah. Lokasi prima yang tenang, asri, aman, dan dirancang khusus bagi kenyamanan hidup keluarga cerdas Anda.",
    story: "Didirikan dengan visi mulia menyediakan oase ketenteraman di tengah kesibukan perkotaan, Wisma Bidara dibangun di atas harmoni keasrian lingkungan dan ketulusan pelayanan pengelola.\n\nSetiap unit rumah kontrakan dirancang secara berkala dengan sirkulasi udara optimal dan taman teduh bergaya minimalis Jepang demi kesehatan jasmani dan kelapangan pikiran seluruh penghuni setia kami.",
    theme: "luxury",
    services: [
      {
        id: "srv-wb1",
        title: "Sewa Unit Rumah Kontrakan 2-Lantai",
        description: "Unit rumah mandiri dengan 2 kamar tidur mewah kelas utama, ruang keluarga lapang, dapur dengan kitchen set estetik, dan garasi mobil kanopi teduh.",
        price: "Rp 3.500.000 / Bulan",
        iconName: "Shield",
      },
      {
        id: "srv-wb2",
        title: "Kamar Kost Eksklusif (Studio Suite)",
        description: "Kamar fully furnished dilengkapi pendingin AC ramah lingkungan, kamar mandi dalam dengan pemanas air (water heater), Wi-Fi, dan layanan laundry harian terpercaya.",
        price: "Rp 1.800.000 / Bulan",
        iconName: "Sparkles",
      },
      {
        id: "srv-wb3",
        title: "Keamanan & Teknisi Siaga 24 Jam",
        description: "Sistem satu gerbang akses (One Gate System), pengawasan CCTV terpadu, serta kebersihan lingkungan luar kamar & teknisi utilitas listrik/air darurat.",
        price: "Termasuk Biaya Sewa",
        iconName: "Shield",
      },
    ],
    products: [
      {
        id: "prod-wb1",
        name: "Kavling Parkir Mobil Tambahan",
        description: "Ruang parkir ekstra beratap kanopi tebal tahan sinar UV-A/B, diawasi kamera CCTV statis khusus, lengkap dengan kunci pengaman ganda.",
        price: "Rp 150.000 / Bulan",
      },
      {
        id: "prod-wb2",
        name: "Instalasi Smart Door Lock",
        description: "Modifikasi gagang pintu unit kontrakan Anda dengan sistem sensor sidik jari, kartu pintar RFID, dan sandi dinamis lewat aplikasi handphone.",
        price: "Rp 450.000 / Sekali Pasang",
      },
    ],
    testimonials: [
      {
        id: "tst-wb1",
        name: "Siti Rahmawati",
        role: "Ibu Rumah Tangga & Freelancer",
        comment: "Sudah tinggal di Wisma Bidara hampir 2 tahun bersama keluarga kecil saya. Anak-anak sangat senang bermain di tamannya yang asri dan bersih. Airnya jernih melimpah, tetangga sangat santun.",
        rating: 5,
      },
      {
        id: "tst-wb2",
        name: "Herlambang Adhi",
        role: "Insinyur Perangkat Lunak",
        comment: "Kost eksklusif yang sangat nyaman bagi pekerja WFH. Jaringan Wi-Fi internal kencang stabil, suasananya damai tidak bising. Cari makan dekat sekali.",
        rating: 5,
      },
    ],
    faq: [
      {
        id: "faq-wb1",
        question: "Bagaimana ketentuan membawa hewan peliharaan?",
        answer: "Pelanggan diperbolehkan membawa hewan peliharaan berukuran kecil (seperti ikan hias atau kucing rumahan) asalkan senantiasa menjaga kebersihan kandang dan tidak mengganggu ketenangan tetangga terdekat.",
      },
      {
        id: "faq-wb2",
        question: "Apakah harga kost bulanan sudah termasuk tagihan listrik?",
        answer: "Untuk sewa unit kontrakan 2 lantai menggunakan sistem token listrik prabayar (mandiri per unit), sedangkan untuk kamar kost studio eksklusif sudah bebas tagihan air bersih dan iuran sampah.",
      },
    ],
    team: [
      {
        id: "team-wb1",
        name: "H. Sugeng Darmawan",
        role: "Pendiri & Pemilik Wisma",
        bio: "Komitmen penuh H. Sugeng adalah mewujudkan hunian sewa kontrakan yang beradab, berudara sejuk, asri, aman, dan harga rasional bernilai manfaat tinggi.",
      },
      {
        id: "team-wb2",
        name: "Ibu Indah Astuti",
        role: "Manajer Lapangan & Layanan",
        bio: "Bertugas memfasilitasi administrasi kontrak, mendengarkan saran perbaikan, serta menyambut calon penyewa baru dengan keramahan penuh kehangatan.",
      },
    ],
    contactInfo: {
      email: "kontak@wismabidara.id",
      phone: "+62 811-2233-4455",
      address: "Kawasan Bidara Raya No. 12B, Cilandak Barat, Jakarta Selatan, DKI Jakarta",
      instagram: "@wisma.bidara",
      whatsappDirect: "https://wa.me/6281122334455",
    },
    operatingHours: [
      { day: "Senin", hours: "08:00 - 20:00" },
      { day: "Selasa", hours: "08:00 - 20:00" },
      { day: "Rabu", hours: "08:00 - 20:00" },
      { day: "Kamis", hours: "08:00 - 20:00" },
      { day: "Jumat", hours: "08:00 - 20:00" },
      { day: "Sabtu", hours: "09:00 - 17:00" },
      { day: "Minggu", hours: "Hubungi Pengurus" },
    ],
    reports: [
      {
        id: "rep-1",
        date: "2026-05-20",
        title: "Peningkatan Pompa Air Jetpump Area Belakang Selesai",
        status: "aman",
        description: "Pompa air jetpump untuk blok kontrakan C & D telah berhasil diganti dengan mesin berkapasitas lebih besar. Tekanan aliran air mandi kini sangat kencang dan jernih tanpa gangguan."
      },
      {
        id: "rep-2",
        date: "2026-05-18",
        title: "Pemeliharaan Kabel Fiber Optic Wi-Fi Utama",
        status: "info",
        description: "Tim teknisi Telkom IndiHome melakukan perawatan rutin kabel jaringan di gerbang depan pukul 10:00 s.d 11:30 WIB. Koneksi internet kini telah kembali stabil melesat hingga 100 Mbps."
      },
      {
        id: "rep-3",
        date: "2026-05-15",
        title: "Fogging Nyamuk DBD & Penyemprotan Disinfektan Lingkungan",
        status: "aman",
        description: "Seluruh area pekarangan luar, saluran air, dan garasi mobil luar telah difogging bekerja sama dengan RT setempat demi menjamin kesehatan seluruh penghuni dari ancaman nyamuk demam berdarah di musim pancaroba."
      }
    ]
  },
];
