import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const ListMovie = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovies = async () => {
    try {
      // Replaces dummy data with live connection
      const { data } = await axios.get("http://localhost:5000/api/movies");
      setMovies(data);
    } catch (err) {
      console.error(err);
      // Dummy fallback if backend isn't up
      setMovies([
        { _id: "1", title: "Inception", category: "Sci-Fi", basePrice: 200 }
      ]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie? This will wipe the DB and delete the poster from the file system.")) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${id}`, {
          headers: { Authorization: `Bearer YOUR_ADMIN_TOKEN` }
        });
        setMovies(movies.filter(m => m._id !== id));
      } catch (err) {
        alert(`Delete action blocked: ${err.response?.data?.message || err.message}`);
        console.error("Deletion Error:", err);
      }
    }
  };

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Movie Inventory</h1>
        <input 
          type="text" 
          placeholder="Search by title..." 
          className="border p-2 rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">ID</th>
              <th className="p-4 font-medium text-gray-600">Title</th>
              <th className="p-4 font-medium text-gray-600">Category</th>
              <th className="p-4 font-medium text-gray-600">Base Price</th>
              <th className="p-4 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map(movie => (
              <tr key={movie._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500 font-mono">{movie._id}</td>
                <td className="p-4 font-bold text-gray-900">{movie.title}</td>
                <td className="p-4 text-gray-600">{movie.category}</td>
                <td className="p-4 text-gray-600">₹{movie.basePrice}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(movie._id)} className="text-red-500 hover:text-red-700 transition">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMovies.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListMovie;
