import { Order, Delivery } from '@/lib/api';
import { CheckCircle2, Circle, Clock, MapPin, Package, Truck, User, Calendar, Phone, Info } from 'lucide-react';

interface OrderTrackerProps {
    order: Order;
    showActions?: boolean;
}

const STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: MapPin },
];

export default function OrderTracker({ order, showActions = true }: OrderTrackerProps) {
    const currentStepIndex = STEPS.findIndex(s => s.key === order.status) !== -1
        ? STEPS.findIndex(s => s.key === order.status)
        : order.status === 'CANCELLED' ? -1 : 0; // Default to 0 if unknown, -1 if cancelled

    const isCancelled = order.status === 'CANCELLED';

    const getStepStatus = (index: number) => {
        if (isCancelled) return 'cancelled';
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="space-y-8">
            {/* Minimal Stepper */}
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full" />

                {/* Active Progress Bar */}
                <div
                    className={`absolute top-5 left-0 h-1 bg-emerald-500 rounded-full transition-all duration-700 ease-out ${isCancelled ? 'bg-rose-500 w-full' : ''}`}
                    style={{ width: isCancelled ? '100%' : `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between">
                    {STEPS.map((step, index) => {
                        const status = getStepStatus(index);
                        const isCompleted = status === 'completed';
                        const isCurrent = status === 'current';
                        const StepIcon = step.icon;

                        return (
                            <div key={step.key} className="flex flex-col items-center group">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all z-10 
                                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                            isCurrent ? 'bg-white border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/20 scale-110' :
                                                isCancelled ? 'bg-rose-50 border-rose-200 text-rose-500' :
                                                    'bg-white border-slate-100 text-slate-300'}`}
                                >
                                    <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={`mt-3 text-[10px] uppercase font-black tracking-widest transition-colors
                                    ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                                {isCurrent && order.updatedAt && (
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">
                                        {new Date(order.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Delivery Info Card */}
            {order.delivery && (
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {order.delivery.driverName && (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Courier</p>
                                    <p className="font-black text-slate-900 text-lg">{order.delivery.driverName}</p>
                                    {order.delivery.driverPhone && (
                                        <p className="text-sm text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                                            <Phone className="w-3 h-3" /> {order.delivery.driverPhone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {order.delivery.vehicleInfo && (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Vehicle</p>
                                    <p className="font-black text-slate-900 text-lg">{order.delivery.vehicleInfo}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {order.delivery.notes && (
                        <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 flex items-start gap-3">
                            <Info className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p>{order.delivery.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
