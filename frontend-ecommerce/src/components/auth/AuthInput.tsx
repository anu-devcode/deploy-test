'use client';

import { LucideIcon } from 'lucide-react';

interface AuthInputProps {
    label: string;
    icon: LucideIcon;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    rightElement?: React.ReactNode;
}

export default function AuthInput({
    label,
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    required = false,
    error,
    rightElement
}: AuthInputProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{label}</label>
                {rightElement}
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-lime-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/20 group-focus-within:text-emerald-400 transition-all duration-300" />
                    <input
                        type={type}
                        required={required}
                        placeholder={placeholder}
                        className={`w-full bg-white/[0.04] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-medium placeholder:text-emerald-100/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-white/[0.06] transition-all duration-300 shadow-inner`}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </div>
            {error && <p className="text-[9px] text-red-400 font-black uppercase tracking-widest ml-4 transition-all animate-bounce">{error}</p>}
        </div>
    );
}
