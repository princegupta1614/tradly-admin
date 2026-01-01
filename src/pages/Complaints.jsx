import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Send, CheckCircle, Clock, Filter, X } from "lucide-react"; // Added 'X' icon
import API from "../api";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("Pending"); // "Pending" | "Resolved" | "All"
  const [replyText, setReplyText] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // ✅ State for Modal Image

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints");
      setComplaints(data.data);
    } catch (error) {
      toast.error("Failed to load complaints");
    }
  };

  const handleResolve = async (id) => {
    const response = replyText[id];
    if (!response) return toast.error("Response cannot be empty");

    try {
      await API.put(`/complaints/${id}/resolve`, {
        developerResponse: response,
        status: "Resolved"
      });
      toast.success("Response sent!");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update ticket");
    }
  };

  // --- FILTER LOGIC ---
  const filteredComplaints = complaints.filter(ticket => {
    if (filter === "All") return true;
    return ticket.status === filter;
  });

  return (
    <div>
      {/* --- IMAGE MODAL (Popup) --- */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)} // Close when clicking background
        >
            <div className="relative max-w-5xl w-full flex flex-col items-center">
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-12 right-0 md:right-0 p-2 text-white/70 hover:text-white transition"
                >
                    <X size={32} />
                </button>
                
                {/* Full Image */}
                <img 
                    src={selectedImage} 
                    alt="Complaint Evidence" 
                    className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent close on image click
                />
            </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Support Tickets</h2>
        
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            {["Pending", "Resolved", "All"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                        filter === f ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>
      
      {/* --- RESPONSIVE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredComplaints.map((ticket) => (
          <div key={ticket._id} className="bg-white flex flex-col h-full p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2
                    ${ticket.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {ticket.status === "Resolved" ? <CheckCircle size={12}/> : <Clock size={12}/>}
                    {ticket.status}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{ticket.subject}</h3>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 mb-4 flex-grow bg-gray-50 p-3 rounded border border-gray-100">
               {ticket.description}
            </p>

            {/* Image Thumbnail (Clickable) */}
            {ticket.image && (
              <div className="mb-4">
                 <img 
                    src={ticket.image} 
                    alt="Proof" 
                    className="w-full h-70 object-cover rounded-lg border hover:opacity-90 transition cursor-zoom-in" 
                    onClick={() => setSelectedImage(ticket.image)} // ✅ Opens Modal
                 />
              </div>
            )}

            {/* Footer / User Info */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3 mb-3">
                <span className="font-medium text-gray-600">{ticket.owner?.username || "Unknown"}</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Action Area */}
            <div className="mt-auto">
                {ticket.status === "Resolved" ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs font-bold text-green-800 uppercase mb-1">Dev Response:</p>
                    <p className="text-sm text-gray-700">{ticket.developerResponse}</p>
                </div>
                ) : (
                <div className="flex gap-2">
                    <input 
                    type="text" 
                    placeholder="Reply..." 
                    className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={replyText[ticket._id] || ""}
                    onChange={(e) => setReplyText({...replyText, [ticket._id]: e.target.value})}
                    />
                    <button 
                    onClick={() => handleResolve(ticket._id)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                    <Send size={18} />
                    </button>
                </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <Filter size={32} />
              </div>
              <p>No {filter !== "All" ? filter.toLowerCase() : ""} tickets found.</p>
          </div>
      )}
    </div>
  );
};

export default Complaints;