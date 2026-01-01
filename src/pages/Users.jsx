import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Search, CheckCircle, XCircle, Mail, Briefcase } from "lucide-react";
import API from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This deletes account & all data.")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const username = u.username ? u.username.toLowerCase() : "";
    const email = u.email ? u.email.toLowerCase() : "";
    const business = u.businessName ? u.businessName.toLowerCase() : "";
    return username.includes(term) || email.includes(term) || business.includes(term);
  });

  return (
    <div>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 md:mt-10 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        
        <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search..." 
                className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {loading ? (
          <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : (
        <>
            {/* --- DESKTOP VIEW (Table) --- */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                    <th className="p-4">Username</th>
                    <th className="p-4">Business Info</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-800 capitalize">{user.username}</td>
                        <td className="p-4">
                            <div className="font-medium text-indigo-600">{user.businessName}</div>
                            <div className="text-xs text-gray-400">{user.businessCategory}</div>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="p-4 text-center">
                            {user.isVerified ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Verified</span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Pending</span>
                            )}
                        </td>
                        <td className="p-4 text-right">
                            <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* --- MOBILE VIEW (Cards) --- */}
            <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 capitalize">{user.username}</h3>
                                <div className="text-sm text-indigo-600 font-medium flex items-center gap-1 mt-1">
                                    <Briefcase size={14}/> {user.businessName}
                                </div>
                            </div>
                            <button onClick={() => handleDelete(user._id)} className="text-red-500 bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} /> {user.email}
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
                             <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</span>
                             {user.isVerified ? (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Verified</span>
                            ) : (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Pending</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredUsers.length === 0 && <div className="text-center py-10 text-gray-400">No users found.</div>}
        </>
      )}
    </div>
  );
};

export default Users;