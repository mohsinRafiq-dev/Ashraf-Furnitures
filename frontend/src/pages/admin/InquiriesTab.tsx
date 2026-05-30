import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  RefreshCw,
  Package,
  Filter,
  Search as SearchIcon,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getRecentInquiries,
  updateInquiryStatus,
  type Inquiry,
} from "../../services/firebase/inquiryService";
import { Timestamp } from "firebase/firestore";

type StatusFilter = "all" | Inquiry["status"];

const STATUS_STYLES: Record<Inquiry["status"], string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  converted: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const SOURCE_LABEL: Record<Inquiry["source"], string> = {
  card: "Product card",
  detail: "Product page",
  search: "Search",
  "custom-order": "Custom order",
};

const formatWhen = (value: Inquiry["createdAt"] | undefined): string => {
  if (!value) return "—";
  const date =
    value instanceof Date ? value : (value as Timestamp).toDate?.() ?? null;
  if (!date) return "—";
  return date.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function InquiriesTab() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getRecentInquiries(100);
      setInquiries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (q && !i.productName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inquiries, statusFilter, search]);

  const counters = useMemo(
    () => ({
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      contacted: inquiries.filter((i) => i.status === "contacted").length,
      converted: inquiries.filter((i) => i.status === "converted").length,
    }),
    [inquiries]
  );

  const handleStatusChange = async (
    inquiry: Inquiry,
    status: Inquiry["status"]
  ) => {
    if (!inquiry.id) return;
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiry.id ? { ...i, status } : i))
    );
    try {
      await updateInquiryStatus(inquiry.id, status);
      toast.success(`Marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Customer Inquiries
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Every "Contact for Price" / WhatsApp click that came from the store.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="self-start flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counters.total, color: "from-gray-500 to-gray-600" },
          { label: "New", value: counters.new, color: "from-blue-500 to-blue-600" },
          { label: "Contacted", value: counters.contacted, color: "from-amber-500 to-amber-600" },
          { label: "Converted", value: counters.converted, color: "from-green-500 to-green-600" },
        ].map((c) => (
          <div
            key={c.label}
            className={`bg-gradient-to-br ${c.color} rounded-2xl shadow-lg p-5 text-white`}
          >
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm opacity-90 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Filter inquiries by status"
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm font-medium cursor-pointer bg-white"
          >
            <option value="all">All statuses</option>
            <option value="new">New only</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
          Loading inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center border border-gray-100">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No inquiries yet
          </h3>
          <p className="text-sm text-gray-500">
            When customers tap "Contact for Price" on the storefront, leads will
            appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {inquiry.productName}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      STATUS_STYLES[inquiry.status]
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {SOURCE_LABEL[inquiry.source] ?? inquiry.source} ·{" "}
                  {formatWhen(inquiry.createdAt)} · {inquiry.referrer || "—"}
                </p>
                {inquiry.details && Object.keys(inquiry.details).length > 0 && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                    {Object.entries(inquiry.details).map(([k, v]) =>
                      v == null || v === "" ? null : (
                        <p key={k} className="text-xs text-gray-600">
                          <span className="text-gray-400">{k}:</span>{" "}
                          <span className="font-medium">{String(v)}</span>
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {inquiry.status !== "contacted" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(inquiry, "contacted")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold transition-colors"
                    title="Mark as contacted"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Contacted
                  </button>
                )}
                {inquiry.status !== "converted" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(inquiry, "converted")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-semibold transition-colors"
                    title="Mark as converted"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Converted
                  </button>
                )}
                {inquiry.status !== "closed" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(inquiry, "closed")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                    title="Close (no sale)"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
