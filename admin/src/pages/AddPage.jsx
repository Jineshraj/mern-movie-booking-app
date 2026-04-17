import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

const AddPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    releaseDate: "",
    language: "",
    category: "",
    trailerUrl: "",
    basePrice: "",
  });
  
  const [poster, setPoster] = useState(null);
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (poster) data.append("poster", poster);
    
    // The cast and showtimes would be dynamically appended as JSON strings here
    
    try {
      // In production we would grab the admin token from context/localStorage
      await axios.post("http://localhost:5000/api/movies", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer YOUR_ADMIN_TOKEN` }
      });
      alert("Movie added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding movie. (Ensure backend is running and tokens are valid)");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Add New Movie</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Movie Title</label>
            <input type="text" name="title" onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-red-500 focus:border-red-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
            <input type="number" name="basePrice" onChange={handleInputChange} className="w-full border p-3 rounded-lg" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" onChange={handleInputChange} rows="4" className="w-full border p-3 rounded-lg" required></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
            <input type="number" name="duration" onChange={handleInputChange} className="w-full border p-3 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
            <input type="date" name="releaseDate" onChange={handleInputChange} className="w-full border p-3 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <input type="text" name="language" onChange={handleInputChange} className="w-full border p-3 rounded-lg" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category (e.g. Action, Comedy)</label>
          <input type="text" name="category" onChange={handleInputChange} className="w-full border p-3 rounded-lg" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poster Image (Upload)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
            <Upload className="text-gray-400 mb-2" />
            <input type="file" onChange={(e) => setPoster(e.target.files[0])} className="text-sm text-gray-600" accept="image/*" required />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">
          Publish Movie
        </button>
      </form>
    </div>
  );
};

export default AddPage;
