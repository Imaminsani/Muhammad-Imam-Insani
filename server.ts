import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  saveProfileToFirebase, 
  loadProfileFromFirebase, 
  loadAllProfilesFromFirebase, 
  deleteProfileFromFirebase 
} from "./src/lib/firebase";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Lazy-initialize Gemini SDK to prevent server crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Host health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Firebase Integration Status Endpoint
app.get("/api/firebase/status", async (req, res) => {
  return res.json({
    configured: true,
    connected: true,
    message: "Terhubung secara real-time ke database cloud Firebase Firestore!",
    dbConfig: {
      projectId: "consummate-shade-ds7sz",
      databaseId: "ai-studio-fc71ae21-794d-4e81-8429-ba91d8db65a2"
    }
  });
});

// Firebase Sync Save Endpoint
app.post("/api/firebase/save", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.businessName) {
      return res.status(400).json({ success: false, message: "Data profil tidak lengkap atau kosong." });
    }
    const result = await saveProfileToFirebase(profile);
    return res.json(result);
  } catch (err: any) {
    console.error("Kesalahan database Firebase:", err);
    return res.status(500).json({
      success: false,
      message: `Gagal menyimpan ke Firebase: ${err.message}`
    });
  }
});

// Firebase Sync Load Endpoint
app.get("/api/firebase/load", async (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).json({ success: false, message: "Parameter nama wajib disertakan." });
  }

  try {
    const profile = await loadProfileFromFirebase(name);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profil "${name}" belum tersimpan atau tidak ditemukan di Firebase.`
      });
    }
    return res.json({ success: true, profile });
  } catch (err: any) {
    console.error("Kesalahan pembacaan database Firebase:", err);
    return res.status(500).json({
      success: false,
      message: `Gagal meload dari Firebase: ${err.message}`
    });
  }
});

// Firebase CRUD: List All Profiles Endpoint
app.get("/api/firebase/list", async (req, res) => {
  try {
    const profiles = await loadAllProfilesFromFirebase();
    return res.json({ success: true, profiles });
  } catch (err: any) {
    console.error("Kesalahan membaca list profil Firebase:", err);
    return res.status(500).json({
      success: false,
      message: `Gagal mengambil semua profil dari database Firebase: ${err.message}`
    });
  }
});

// Firebase CRUD: Delete Profile Endpoint
app.delete("/api/firebase/delete", async (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).json({ success: false, message: "Parameter nama wajib disertakan untuk penghapusan." });
  }

  try {
    await deleteProfileFromFirebase(name);
    return res.json({
      success: true,
      message: `Profil "${name}" sukses dihapus secara permanen dari database Firebase!`
    });
  } catch (err: any) {
    console.error("Kesalahan menghapus profil dari database Firebase:", err);
    return res.status(500).json({
      success: false,
      message: `Gagal menghapus profil dari database Firebase: ${err.message}`
    });
  }
});

// Primary Business Profile Generation endpoint
app.post("/api/generate-profile", async (req, res) => {
  const { businessName, category, description, theme } = req.body;

  if (!businessName || !category) {
    return res.status(400).json({
      error: "Missing fields",
      message: "Nama Usaha (Business Name) dan Kategori (Category) wajib diisi.",
    });
  }

  try {
    const ai = getAiClient();
    
    const userPrompt = `
Buatlah data profil bisnis profesional dalam Bahasa Indonesia yang sangat menarik, persuasif, bercerita indah (storytelling), dan mendalam berdasarkan informasi dasar berikut:
- Nama Bisnis: ${businessName}
- Kategori Industri/Usaha: ${category}
- Deskripsi singkat / Keunikan / Model bisnis: ${description || "Bisnis UMKM lokal inovatif"}
- Estetika Tema / Mood: ${theme || "minimalist"}

Ketentuan penyusunan konten:
1. Slogan: Harus berkelas, menginspirasi, puitis namun profesional, maknanya mendalam (maksimal 10 kata).
2. About Us: Ringkasan visi, misi, dan nilai utama kami (2-3 kalimat penuh ketulusan).
3. Story: Latar belakang perjuangan mendirikan usaha, krisis yang diatasi, obsesi pada kualitas, dan harapan bagi masyarakat. Tulis dlm 2-3 paragraf emosional/inspiratif.
4. Services: Berikan 3 jasa/layanan utama yang konkret dan relevan. Berikan perkiraan harga rasional dlm format rupiah (contoh: "Mulai dari Rp 45.000" atau "Hubungi kami"). Pilih 'iconName' dari Lucide React yang cocok (seperti Coffee, Cpu, Sparkles, Heart, Scissors, Code, Briefcase, Camera, Music, Book, Compass, ShoppingBag, Shield).
5. Products: Berikan 3 produk unggulan konkret dengan nama menarik, harga rupiah rasional, dan deskripsi singkat yang menggugah keinginan membeli.
6. Testimonials: Susun 3 ulasan pelanggan fiktif bernada asli, tulus, detail mengomentari produk atau kepuasan layanan dengan rating bintang (4 atau 5).
7. FAQ: Buat 3 daftar pertanyaan kritis operasional atau produk yang ramah pelanggan disertai jawaban yang jelas dan solutif.
8. Team: Sebutkan 2 nama tim kunci (misalnya Owner/Founder, dan satu ahli/spesialis) lengkap dengan biodata ringkas yang menonjolkan keahlian dan integritas mereka.
9. ContactInfo: Rancang kontak profesional fiktif namun realistis di Indonesia. Email menggunakan domain bisnis (misal halo@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.id), nomor WhatsApp Indonesia yang rapi (format +62 8xx-xxxx-xxxx), alamat di kota besar atau lokasi Indonesia yang indah, akun Instagram yang representatif.
10. Operating Hours: Susun jadwal dari Senin sampai Minggu secara spesifik.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: "Anda adalah seorang copywriting profesional, konsultan branding bisnis UMKM Indonesia, dan desainer agensi web berpengalaman. Anda ahli membuat narasi profil bisnis yang elegan, humanis, sangat persuasif, dan akurat dalam Bahasa Indonesia.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            aboutUs: { type: Type.STRING },
            story: { type: Type.STRING },
            services: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik misal 'srv-1'" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  price: { type: Type.STRING },
                  iconName: { type: Type.STRING, description: "Nama icon Lucide React misal Coffee, Sparkles, Heart, Scissors, Code, Smile, Shield, ShoppingBag, Camera" }
                },
                required: ["id", "title", "description", "price", "iconName"]
              }
            },
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik misal 'prod-1'" },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  price: { type: Type.STRING }
                },
                required: ["id", "name", "description", "price"]
              }
            },
            testimonials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik misal 'tst-1'" },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  comment: { type: Type.STRING },
                  rating: { type: Type.INTEGER }
                },
                required: ["id", "name", "role", "comment", "rating"]
              }
            },
            faq: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik misal 'faq-1'" },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["id", "question", "answer"]
              }
            },
            team: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik misal 'team-1'" },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  bio: { type: Type.STRING }
                },
                required: ["id", "name", "role", "bio"]
              }
            },
            contactInfo: {
              type: Type.OBJECT,
              properties: {
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                address: { type: Type.STRING },
                instagram: { type: Type.STRING },
                whatsappDirect: { type: Type.STRING }
              },
              required: ["email", "phone", "address", "instagram", "whatsappDirect"]
            },
            operatingHours: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  hours: { type: Type.STRING }
                },
                required: ["day", "hours"]
              }
            }
          },
          required: [
            "slogan",
            "aboutUs",
            "story",
            "services",
            "products",
            "testimonials",
            "faq",
            "team",
            "contactInfo",
            "operatingHours"
          ]
        },
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No output generated from Gemini API");
    }

    const data = JSON.parse(textOutput.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      error: "AI Generation Failed",
      message: error?.message || "Terjadi kesalahan internal saat menghubungi asisten AI.",
    });
  }
});

// Serve frontend with Vite in development and static bundle in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback for all other routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
