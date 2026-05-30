import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Hammer,
  Ruler,
  Palette,
  Wallet,
  Calendar,
  User,
  Phone,
  Send,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { logInquiry } from "../services/firebase/inquiryService";
import { sendWhatsAppMessage } from "../utils/whatsapp";
import SEO from "../components/SEO";

const FURNITURE_TYPES = [
  "Sofa / Couch",
  "Bed",
  "Dining Table",
  "Wardrobe",
  "Office Furniture",
  "Coffee Table",
  "Chair",
  "Storage / Cabinet",
  "Other",
];

const FINISHES = [
  "Walnut",
  "Teak",
  "Oak",
  "Mahogany",
  "Ebony",
  "Painted (specify color in notes)",
  "Other",
];

const BUDGETS = [
  "Under Rs. 50,000",
  "Rs. 50,000 – 1,00,000",
  "Rs. 1,00,000 – 2,50,000",
  "Rs. 2,50,000 – 5,00,000",
  "Rs. 5,00,000+",
  "Open / not sure yet",
];

const TIMELINES = [
  "Within 2 weeks",
  "1 month",
  "1–2 months",
  "Flexible",
];

interface FormState {
  name: string;
  phone: string;
  furnitureType: string;
  dimensions: string;
  finish: string;
  budget: string;
  timeline: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  phone: "",
  furnitureType: "",
  dimensions: "",
  finish: "",
  budget: "",
  timeline: "",
  notes: "",
};

export default function CustomOrder() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.furnitureType) {
      toast.error("Please fill in your name, phone, and furniture type.");
      return;
    }

    setSubmitting(true);

    // Compose a clean, structured WhatsApp message
    const message =
      `*🛠 Custom Order Inquiry*\n\n` +
      `*From:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `\n*Looking for:* ${form.furnitureType}\n` +
      (form.dimensions ? `*Size / Dimensions:* ${form.dimensions}\n` : "") +
      (form.finish ? `*Finish:* ${form.finish}\n` : "") +
      (form.budget ? `*Budget:* ${form.budget}\n` : "") +
      (form.timeline ? `*Timeline:* ${form.timeline}\n` : "") +
      (form.notes ? `\n*Notes:*\n${form.notes}\n` : "") +
      `\nPlease share design options & pricing.`;

    // Log structured details to Firestore for the admin pipeline
    await logInquiry({
      productName: `Custom: ${form.furnitureType}`,
      source: "custom-order",
      details: {
        customerName: form.name,
        phone: form.phone,
        dimensions: form.dimensions || null,
        finish: form.finish || null,
        budget: form.budget || null,
        timeline: form.timeline || null,
        notes: form.notes || null,
      },
    });

    sendWhatsAppMessage(message);

    toast.success("Inquiry sent — we'll reply on WhatsApp shortly.");
    setForm(initialState);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-14 px-4">
      <SEO
        title="Custom Furniture Order"
        description="Get a quote for handcrafted custom furniture — pick a piece, share your size, finish, budget and timeline, we reply on WhatsApp."
        keywords={[
          "custom furniture",
          "made to order",
          "bespoke furniture Pakistan",
          "Ashraf Furnitures custom order",
        ]}
      />

      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wide mb-3">
            <Hammer className="w-3.5 h-3.5" />
            Made to Order
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Build it your way
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Share a few details about the piece you want and we'll come back
            with options, materials, and pricing — usually within the same day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg border border-amber-100 p-6 sm:p-8 space-y-5"
        >
          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Your name *"
              icon={<User className="w-4 h-4" />}
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Ahmed Khan"
            />
            <Field
              label="WhatsApp number *"
              icon={<Phone className="w-4 h-4" />}
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="+92 300 1234567"
              type="tel"
            />
          </div>

          {/* Type */}
          <SelectField
            label="What are you looking for? *"
            icon={<Hammer className="w-4 h-4" />}
            value={form.furnitureType}
            onChange={(v) => update("furnitureType", v)}
            options={FURNITURE_TYPES}
            placeholder="Choose a piece"
          />

          {/* Dimensions */}
          <Field
            label="Approximate size / dimensions"
            icon={<Ruler className="w-4 h-4" />}
            value={form.dimensions}
            onChange={(v) => update("dimensions", v)}
            placeholder='e.g. "6 ft × 3 ft", "King size", "Fits a 12×14 room"'
          />

          {/* Finish + Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Preferred finish"
              icon={<Palette className="w-4 h-4" />}
              value={form.finish}
              onChange={(v) => update("finish", v)}
              options={FINISHES}
              placeholder="Pick a wood / finish"
            />
            <SelectField
              label="Budget range"
              icon={<Wallet className="w-4 h-4" />}
              value={form.budget}
              onChange={(v) => update("budget", v)}
              options={BUDGETS}
              placeholder="Choose a range"
            />
          </div>

          {/* Timeline */}
          <SelectField
            label="When do you need it?"
            icon={<Calendar className="w-4 h-4" />}
            value={form.timeline}
            onChange={(v) => update("timeline", v)}
            options={TIMELINES}
            placeholder="Pick a timeline"
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anything else?
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Style references, fabric preferences, room photos available, etc."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {submitting ? "Sending..." : "Send via WhatsApp"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We'll reply on WhatsApp typically within a few hours during
            business days.
          </p>
        </form>
      </div>
    </div>
  );
}

// ---- Local field components ----

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({ label, icon, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
        <span className="text-amber-600">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
        <span className="text-amber-600">{icon}</span>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm bg-white cursor-pointer"
      >
        <option value="" disabled>
          {placeholder ?? "Select"}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
