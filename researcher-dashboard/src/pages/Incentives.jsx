import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Clock, User, Calendar, Filter } from 'lucide-react';
import { incentivesAPI } from '../services/api';

const Incentives = () => {
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    try {
      setLoading(true);
      const response = await incentivesAPI.getPending();
      if (response.data.success) {
        setIncentives(response.data.incentives || []);
      }
    } catch (error) {
      console.error('Error fetching incentives:', error);
      // Mock data for demo
      setIncentives([
        {
          id: '1',
          respondent: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          session_id: '1',
          amount: 5.00,
          status: 'pending',
          created_at: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          respondent: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          session_id: '2',
          amount: 5.00,
          status: 'pending',
          created_at: '2025-01-15T09:00:00Z'
        },
        {
          id: '3',
          respondent: {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          session_id: '3',
          amount: 5.00,
          status: 'paid',
          created_at: '2025-01-14T15:00:00Z',
          paid_at: '2025-01-14T16:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (incentiveId) => {
    try {
      setProcessing(incentiveId);
      const response = await incentivesAPI.markAsPaid(incentiveId);
      if (response.data.success) {
        setIncentives(incentives.map(incentive => 
          incentive.id === incentiveId 
            ? { ...incentive, status: 'paid', paid_at: new Date().toISOString() }
            : incentive
        ));
      }
    } catch (error) {
      console.error('Error marking incentive as paid:', error);
      // For demo purposes, update local state
      setIncentives(incentives.map(incentive => 
        incentive.id === incentiveId 
          ? { ...incentive, status: 'paid', paid_at: new Date().toISOString() }
          : incentive
      ));
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredIncentives = incentives.filter(incentive => 
    statusFilter === 'all' || incentive.status === statusFilter
  );

  const totalPending = incentives.filter(i => i.status === 'pending').length;
  const totalPendingAmount = incentives
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = incentives.filter(i => i.status === 'paid').length;
  const totalPaidAmount = incentives
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Incentives Management</h1>
        <p className="text-gray-600 mt-1">Manage respondent incentives and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPending}</p>
              <p className="text-sm text-gray-500">${totalPendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Paid This Period</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPaid}</p>
              <p className="text-sm text-gray-500">${totalPaidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(totalPendingAmount + totalPaidAmount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">All incentives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Incentives List */}
      {filteredIncentives.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
            <DollarSign className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No incentives found</h3>
          <p className="text-gray-600 text-sm">
            {statusFilter !== 'all' 
              ? 'No incentives with the selected status'
              : 'No incentives have been created yet'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Respondent
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredIncentives.map((incentive) => (
                  <tr key={incentive.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {incentive.respondent.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {incentive.respondent.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-900">
                      {incentive.session_id}
                    </td>
                    <td className="px-8 py-4 text-sm font-semibold text-gray-900">
                      ${incentive.amount.toFixed(2)}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(incentive.status)}`}>
                        {incentive.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">
                      {incentive.status === 'paid' && incentive.paid_at
                        ? formatDate(incentive.paid_at)
                        : formatDate(incentive.created_at)
                      }
                    </td>
                    <td className="px-8 py-4">
                      {incentive.status === 'pending' ? (
                        <button
                          onClick={() => handleMarkAsPaid(incentive.id)}
                          disabled={processing === incentive.id}
                          className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {processing === incentive.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Mark as Paid
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incentives;


