import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Save, Trash2, ShieldAlert, Loader2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, updateUserProfile, deleteAccount } = useStore();
  
  const [name, setName] = useState(user?.name || '');
  const [medicalNotes, setMedicalNotes] = useState(user?.medicalNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name,
        medicalNotes
      });
      // Ideally show a toast here
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
    } catch (error) {
      alert("Failed to delete account. You may need to sign in again recently to perform this action.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h2>
        <p className="text-slate-400 mt-1">Manage your personal information and account.</p>
      </div>

      <div className="glass-card rounded-[32px] border border-white/5 p-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="relative">
             <div className="absolute inset-0 bg-primary-500 blur-md opacity-20 rounded-full"></div>
             <img 
                src={user?.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 border-white/10 relative z-10 shadow-xl"
            />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-white">{user?.name}</h3>
            <p className="text-slate-400">{user?.email}</p>
            <span className="inline-flex items-center mt-3 px-3 py-1 bg-white/5 text-primary-300 text-xs font-bold rounded-lg capitalize border border-white/5 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
              {user?.role} Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1">Full Name</label>
            <div className="glass-input-wrapper group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input-field w-full px-5 py-3.5 pl-12 outline-none text-white font-medium"
                placeholder="Full Name"
              />
              <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors pointer-events-none" />
            </div>
          </div>

          {user?.role === 'patient' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Medical Notes / Conditions</label>
              <div className="glass-input-wrapper">
                <textarea
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    rows={4}
                    placeholder="List any allergies or medical conditions..."
                    className="glass-input-field w-full p-5 outline-none text-white font-medium resize-none"
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">These notes are visible to doctors when you book an appointment.</p>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-500/5 rounded-[32px] p-8 border border-red-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2 text-lg">
            <ShieldAlert className="w-5 h-5"/> Danger Zone
            </h3>
            <p className="text-red-300/60 text-sm mb-6 max-w-lg">
            Deleting your account is permanent. All your data and appointment history will be removed. This action cannot be undone.
            </p>
            
            {!showDeleteConfirm ? (
            <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
                <Trash2 className="w-4 h-4" />
                Delete Account
            </button>
            ) : (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 bg-black/20 p-2 rounded-xl border border-white/5 inline-flex">
                <span className="text-sm font-bold text-red-400 px-2">Are you sure?</span>
                <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-500 transition-colors shadow-lg"
                >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-transparent text-slate-400 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/5 transition-colors"
                >
                Cancel
                </button>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;