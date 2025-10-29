import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shopkeeperAxiosInstance from "../api/shopkeeperAxiosInstance";
import { showToast } from "../utils/toast";

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState({ summary: {}, payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await shopkeeperAxiosInstance.get("/shopkeeper/payments/");
      setPayments(res.data);
    } catch (error) {
      showToast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
            <p className="text-gray-600">Track your earnings and commissions</p>
          </div>
          <button
            onClick={() => navigate("/shopkeeper/dashboard")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">₹{payments.summary.total_revenue?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Commission (15%)</p>
            <p className="text-3xl font-bold">-₹{payments.summary.total_commission?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Net Earnings</p>
            <p className="text-3xl font-bold">₹{payments.summary.total_net_earnings?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Commission Rate</p>
            <p className="text-3xl font-bold">{(payments.summary.commission_rate * 100) || 15}%</p>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.payments.map((payment) => (
                  <tr key={payment.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{payment.order_id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.customer_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">₹{payment.order_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">-₹{payment.commission_deducted.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">₹{payment.net_payment.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
