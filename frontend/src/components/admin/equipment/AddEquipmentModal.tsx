import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CustomDropdown from '../../shared/CustomDropdown';
import type { Equipment, CreateEquipmentPayload } from '../../../types/equipment';
import { useEquipmentStore } from '../../../stores/useEquipmentStore';
import { toast } from 'sonner';

interface AddEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipment?: Equipment | null;
    onEquipmentUpdated?: () => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ isOpen, onClose, equipment, onEquipmentUpdated }) => {
    const isEdit = !!equipment;

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
<<<<<<< HEAD
    const [description, setDescription] = useState('');
    const [warranty, setWarranty] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
=======
>>>>>>> mergeMy
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createEquipment = useEquipmentStore(state => state.createEquipment);
    const updateEquipment = useEquipmentStore(state => state.updateEquipment);

    useEffect(() => {
        if (equipment) {
            setName(equipment.name);
            setCategory(equipment.category);
            setQuantity(1);
<<<<<<< HEAD
            // location is handled via room_id in the new model
            setDescription((equipment as any).description || '');
            setWarranty(equipment.updatedAt || ''); // Placeholder if warranty is not in new type
            setPurchaseDate(equipment.createdAt || ''); // Placeholder
=======
>>>>>>> mergeMy
            setCode(equipment.code || '');
        } else {
            setName('');
            setCategory('');
            setQuantity(1);
<<<<<<< HEAD
            setDescription('');
            setWarranty('');
            setPurchaseDate('');
=======
            setCode('');
>>>>>>> mergeMy
            setCode('');
        }
    }, [equipment, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: CreateEquipmentPayload = {
                name,
                category,
                status: (equipment?.status as any) || 'good',
<<<<<<< HEAD
                room_id: null, // Placeholder, should be selected from a room list
=======
                room_id: (equipment?.room_id as any)?._id || (equipment?.room_id as any) || null,
>>>>>>> mergeMy
                code: code || undefined
            };

            if (isEdit && equipment) {
                await updateEquipment(equipment._id, payload);
                toast.success(`Asset "${name}" updated successfully`);
            } else {
                for (let i = 0; i < quantity; i++) {
                    await createEquipment(payload);
                }
                toast.success(`${quantity} new unit(s) of "${name}" registered`);
            }
            if (onEquipmentUpdated) onEquipmentUpdated();
            onClose();
        } catch (error) {
            toast.error("Failed to sync equipment data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E2B58] dark:focus:ring-blue-500 outline-none transition-all";
    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 block";

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm">
                            {isEdit ? 'Asset Modification' : 'Asset Acquisition'}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">
                        {isEdit ? 'Update Equipment Details' : 'Register New Equipment'}
                    </h3>
                    <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">
                        Inventory Logistics • Asset Management System
                    </p>
                </div>

                <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
                    <form id="equipmentForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-1.5">
                                <label className={labelClasses}>Asset Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={inputClasses}
                                    placeholder="e.g. Dell UltraSharp U2723QE"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
<<<<<<< HEAD
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Asset Code (Optional)</label>
=======
                                <label className={labelClasses}>Asset Code (Optional)</label>
>>>>>>> mergeMy
                                <input
                                    type="text"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
<<<<<<< HEAD
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
=======
                                    className={inputClasses}
>>>>>>> mergeMy
                                    placeholder="e.g. FPT-LAP-082"
                                />
                            </div>

<<<<<<< HEAD
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Category <span className="text-red-500">*</span></label>
                                <select
=======
                            <div className="space-y-1.5 relative">
                                <label className={labelClasses}>Primary Category <span className="text-red-500">*</span></label>
                                <CustomDropdown
>>>>>>> mergeMy
                                    value={category}
                                    options={[
                                        { value: '', label: 'Select Category' },
                                        { value: 'laptop', label: 'Laptop' },
                                        { value: 'pc_lab', label: 'PC Lab' },
                                        { value: 'photography', label: 'Photography' },
                                        { value: 'camera', label: 'Camera' },
                                        { value: 'audio', label: 'Audio' },
                                        { value: 'iot_kit', label: 'IoT Kit' },
                                        { value: 'lab', label: 'Lab Equipment' },
                                        { value: 'tablet', label: 'Tablet' },
                                        { value: 'network', label: 'Network Infrastructure' },
                                        { value: 'infrastructure', label: 'Infrastructure' },
                                        { value: 'other', label: 'Other' }
                                    ]}
                                    onChange={setCategory}
                                    className="w-full"
                                    triggerClassName={`${inputClasses} flex justify-between items-center cursor-pointer`}
                                    fullWidth={true}
                                />
                            </div>

                            {!isEdit && (
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Batch Quantity <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                                        className={inputClasses}
                                        placeholder="1"
                                        min={1}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className={labelClasses}>Assigned Room</label>
                                <input
                                    type="text"
                                    value="Lab 402"
                                    disabled
                                    className={`${inputClasses} bg-slate-100/30 border-dashed cursor-not-allowed`}
                                />
                            </div>

                        </div>

                        {/* Image Upload Aesthetic */}
                        <div className="space-y-1.5 pt-2">
                            <label className={labelClasses}>Visual Documentation</label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-black/10 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-2xl font-light">camera_enhance</span>
                                </div>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300">Register asset image</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight italic">WebP, PNG or JPG supported</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
                    >
                        Dismiss Entry
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            form="equipmentForm"
                            disabled={isSubmitting}
                            className={`px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            <span className="material-symbols-outlined text-sm">{isSubmitting ? 'hourglass_top' : (isEdit ? 'published_with_changes' : 'inventory')}</span>
                            {isSubmitting ? 'Processing' : (isEdit ? 'Update Registry' : 'Confirm Registration')}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddEquipmentModal;
