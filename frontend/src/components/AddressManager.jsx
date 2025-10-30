import React, { useState, useEffect } from "react";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../api/profileApi";
import notify from "../utils/notifications";

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label: "", street: "", city: "", state: "", postal_code: "", country: "", is_default: false });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const data = await getAddresses();
    setAddresses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAddress(editId, form);
        notify.address.updated();
      } else {
        await createAddress(form);
        notify.address.added();
      }
      setForm({ label: "", street: "", city: "", state: "", postal_code: "", country: "", is_default: false });
      setShowForm(false);
      setEditId(null);
      loadAddresses();
    } catch (err) {
      notify.address.error("Failed to save address");
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this address?")) {
      try {
        await deleteAddress(id);
        notify.address.deleted();
        loadAddresses();
      } catch (err) {
        notify.address.error("Failed to delete address");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
          <input type="text" placeholder="Label (e.g., Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          <input type="text" placeholder="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
            <input type="text" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Postal Code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
            <input type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          </div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Set as default
          </label>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            {editId ? "Update" : "Save"} Address
          </button>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map(addr => (
          <div key={addr.id} className="border dark:border-gray-700 p-4 rounded-lg flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{addr.label} {addr.is_default && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>}</h3>
              <p className="text-gray-600 dark:text-gray-400">{addr.street}, {addr.city}, {addr.state} {addr.postal_code}, {addr.country}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(addr)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
