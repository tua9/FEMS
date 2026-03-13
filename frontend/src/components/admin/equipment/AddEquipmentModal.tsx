import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Equipment, CreateEquipmentPayload } from '../../../types/equipment';
import { useEquipmentStore } from '../../../stores/useEquipmentStore';

interface AddEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipment?: Equipment | null;
    onEquipmentUpdated?: () => void;
}

// generateDeviceId removed as it's not needed for backend-driven IDs

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ isOpen, onClose, equipment, onEquipmentUpdated }) => {
    const isEdit = !!equipment;

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState('');
    const [warranty, setWarranty] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createEquipment = useEquipmentStore(state => state.createEquipment);
    const updateEquipment = useEquipmentStore(state => state.updateEquipment);

    useEffect(() => {
        if (equipment) {
            setName(equipment.name);
            setCategory(equipment.category);
            setQuantity(1);
            // location is handled via room_id in the new model
            setDescription((equipment as any).description || '');
            setWarranty(equipment.updatedAt || ''); // Placeholder if warranty is not in new type
            setPurchaseDate(equipment.createdAt || ''); // Placeholder
        } else {
            setName('');
            setCategory('');
            setQuantity(1);
            setDescription('');
            setWarranty('');
            setPurchaseDate('');
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
                room_id: null // Placeholder, should be selected from a room list
            };

            if (isEdit && equipment) {
                await updateEquipment(equipment._id, payload);
            } else {
                // Bulk create individual units if quantity > 1
                for (let i = 0; i < quantity; i++) {
                    await createEquipment(payload);
                }
            }
            if (onEquipmentUpdated) onEquipmentUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to save equipment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Use portal to render modal outside the DOM hierarchy to avoid stacking context issues
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl glass-card hover:transform-none hover:bg-white/70 dark:hover:bg-slate-800/70 hover:shadow-2xl dark:!bg-slate-800/70 rounded-[32px] border border-white/40 dark:border-white/10 shadow-2xl bg-white/70 backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white">
                            {isEdit ? 'Edit Equipment' : 'Add New Equipment'}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                            {isEdit ? 'Update details for this university asset.' : 'Enter details to register a new asset into the system.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="equipmentForm" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Equipment Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="e.g. MacBook Pro M3"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Category <span className="text-red-500">*</span></label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Laptop">Laptop & Computers</option>
                                    <option value="Photography">Photography & Video</option>
                                    <option value="Peripheral">Peripherals</option>
                                    <option value="Tablet">Tablets</option>
                                    <option value="Network">Network Devices</option>
                                    <option value="Electronics">Electronics & IoT</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {!isEdit && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Number of Units <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="1"
                                        min={1}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Room <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value="Lab 402"
                                    disabled
                                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none dark:text-white cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Purchased On</label>
                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={e => setPurchaseDate(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Warranty Until</label>
                                <input
                                    type="date"
                                    value={warranty}
                                    onChange={e => setWarranty(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white min-h-[100px] resize-y"
                                placeholder="Add technical specifications or notes..."
                            ></textarea>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Equipment Image</label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                                <p className="text-[10px] text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="equipmentForm"
                        disabled={isSubmitting}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm bg-[#1A2B56] hover:bg-[#2A3B66] text-white shadow-lg transition-colors flex items-center gap-2 ${isSubmitting ? 'animate-pulse' : ''}`}
                    >
                        <span className="material-symbols-outlined text-sm">{isSubmitting ? 'hourglass_top' : (isEdit ? 'update' : 'save')}</span>
                        {isSubmitting ? 'Saving...' : (isEdit ? 'Update Changes' : 'Save Equipment')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddEquipmentModal;
