import { useState, useEffect } from 'react';
import { Wrench, Calendar, Users, Activity, AlertTriangle, CheckCircle2, Loader2, Save, Pencil, Trash2, X } from 'lucide-react';
import { maintenanceService } from '../services/service';

export default function Maintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    status: 'pending',
    priority: 'medium'
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const data = await maintenanceService.getMaintenanceRecords();
        setMaintenanceRecords(data);
      } catch (error) {
        console.error('Error loading maintenance records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setSubmitting(true);
    try {
      if (editMode && editId) {
        await maintenanceService.updateMaintenanceRecord(editId, formData);
      } else {
        await maintenanceService.createMaintenanceRecord(formData);
      }
      const data = await maintenanceService.getMaintenanceRecords();
      setMaintenanceRecords(data);
      setFormData({ description: '', status: 'pending', priority: 'medium' });
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error('Error saving maintenance record:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      description: record.description,
      status: record.status,
      priority: record.priority
    });
    setEditMode(true);
    setEditId(record.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;
    
    try {
      await maintenanceService.deleteMaintenanceRecord(id);
      const data = await maintenanceService.getMaintenanceRecords();
      setMaintenanceRecords(data);
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ description: '', status: 'pending', priority: 'medium' });
    setEditMode(false);
    setEditId(null);
  };

  const statusConfig = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertTriangle },
    in_progress: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Activity },
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
  };

  const priorityConfig = {
    low: { color: 'text-slate-600', bg: 'bg-slate-100' },
    medium: { color: 'text-amber-600', bg: 'bg-amber-100' },
    high: { color: 'text-rose-600', bg: 'bg-rose-100' },
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Maintenance Module</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage system maintenance tasks and track operational status.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">
          <Wrench className="h-5 w-5" />
          {maintenanceRecords.length} Total Tasks
        </div>
      </div>

      {/* Add/Edit Maintenance Record */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{editMode ? 'Edit Maintenance Task' : 'Create Maintenance Task'}</h2>
            <p className="text-sm text-slate-500 mt-1">{editMode ? 'Update the maintenance record details.' : 'Add a new maintenance record to track system updates.'}</p>
          </div>
          {editMode && (
            <button
              onClick={handleCancelEdit}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description *</label>
              <textarea
                required
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all outline-none text-sm resize-none"
                rows="3"
                placeholder="Describe the maintenance task..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Status</label>
                <select
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all outline-none text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Priority</label>
                <select
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all outline-none text-sm"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white rounded-xl py-3 px-6 font-bold text-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              {submitting ? 'Saving...' : (editMode ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>

      {/* Maintenance Records List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Maintenance Records</h2>
          <p className="text-sm text-slate-500 mt-1">Track all system maintenance activities.</p>
        </div>
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : maintenanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No maintenance records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceRecords.map((record) => {
                const status = statusConfig[record.status] || statusConfig.pending;
                const priority = priorityConfig[record.priority] || priorityConfig.medium;
                const StatusIcon = status.icon;
                return (
                  <div key={record.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${status.bg} ${status.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {record.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${priority.bg} ${priority.color}`}>
                            {record.priority}
                          </span>
                        </div>
                        <p className="font-medium text-slate-900">{record.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
