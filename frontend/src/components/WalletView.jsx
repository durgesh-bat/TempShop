import React, { useState, useEffect } from "react";
import { getWallet, getPaymentMethods, createPaymentMethod, deletePaymentMethod } from "../api/profileApi";

export default function WalletView() {
  const [wallet, setWallet] = useState(null);
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ card_type: "credit", last_four: "", expiry_month: "", expiry_year: "", is_default: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const w = await getWallet();
    const m = await getPaymentMethods();
    setWallet(w);
    setMethods(m);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPaymentMethod(form);
    setForm({ card_type: "credit", last_four: "", expiry_month: "", expiry_year: "", is_default: false });
    setShowForm(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this payment method?")) {
      await deletePaymentMethod(id);
      loadData();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Wallet & Payment</h2>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
        <p className="text-sm opacity-90">Available Balance</p>
        <h3 className="text-4xl font-bold">${wallet?.balance || "0.00"}</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Payment Methods</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Card"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
          <select value={form.card_type} onChange={(e) => setForm({ ...form, card_type: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
          </select>
          <input type="text" placeholder="Last 4 digits" maxLength="4" value={form.last_four} onChange={(e) => setForm({ ...form, last_four: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Expiry Month (1-12)" min="1" max="12" value={form.expiry_month} onChange={(e) => setForm({ ...form, expiry_month: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
            <input type="number" placeholder="Expiry Year" min="2024" value={form.expiry_year} onChange={(e) => setForm({ ...form, expiry_year: e.target.value })} className="p-2 border rounded dark:bg-gray-800 dark:text-white" required />
          </div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Set as default
          </label>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Add Card</button>
        </form>
      )}

      <div className="space-y-3">
        {methods.map(method => (
          <div key={method.id} className="border dark:border-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{method.card_type === "credit" ? "💳" : "🏦"} •••• {method.last_four}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires {method.expiry_month}/{method.expiry_year} {method.is_default && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">Default</span>}</p>
            </div>
            <button onClick={() => handleDelete(method.id)} className="text-red-600 hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
