'use client';

import Script from 'next/script';

interface SocialAuthProps {
    loading: boolean;
    onGoogleClick: () => void;
    onTelegramAuth: (user: any) => void;
}

export default function SocialAuth({ loading, onGoogleClick, onTelegramAuth }: SocialAuthProps) {
    return (
        <div className="space-y-6">
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-emerald-100/20">
                    <span className="bg-[#0b1c19] px-4 rounded-full">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onGoogleClick}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 text-white font-black text-sm hover:bg-white/[0.08] transition-all group active:scale-95 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.312 2.624-6.84 2.624-5.464 0-9.72-4.416-9.72-9.88s4.256-9.88 9.72-9.88c2.944 0 5.152 1.152 6.728 2.632l2.312-2.312C18.424 1.344 15.688 0 12.48 0 5.616 0 0 5.616 0 12.5s5.616 12.5 12.48 12.5c3.744 0 6.6-1.232 8.944-3.696 2.376-2.376 3.12-5.712 3.12-8.4 0-.808-.064-1.5760000000000001-.176-2.28h-11.888z" />
                    </svg>
                    Google
                </button>

                <div id="telegram-login-container" className="relative">
                    <button
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 text-white font-black text-sm hover:bg-white/[0.08] transition-all group active:scale-95 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 text-[#24A1DE]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.66 8.356c-.184 1.936-1.12 7.424-1.604 9.99-.204 1.088-.6 1.452-.988 1.488-.844.076-1.484-.56-2.3-.924-1.284-.572-2.008-.928-3.256-1.748-1.44-.948-.508-1.472.312-2.324.216-.224 3.968-3.636 4.04-3.944.004-.04.012-.188-.064-.256s-.184-.044-.26-.028c-.108.024-1.844 1.172-5.204 3.444-.492.34-.94.508-1.34.496-.444-.012-1.296-.252-1.928-.456-.776-.252-1.396-.388-1.34-.82.028-.224.336-.452.928-.684 3.632-1.58 6.052-2.624 7.26-3.132 3.456-1.448 4.172-1.704 4.64-1.712.104-.004.336.02.484.144.124.104.16.244.168.344.008.08.008.232 0 .344z" />
                        </svg>
                        Telegram
                    </button>

                    <div className="absolute inset-0 opacity-0 pointer-events-none">
                        <Script
                            src="https://telegram.org/js/telegram-widget.js?22"
                            strategy="lazyOnload"
                            data-telegram-login="YourBotName"
                            data-size="large"
                            data-onauth="onTelegramAuth(user)"
                            data-request-access="write"
                        />
                        <script dangerouslySetInnerHTML={{
                            __html: `
                                function onTelegramAuth(user) {
                                    const event = new CustomEvent('telegram-auth', { detail: user });
                                    window.dispatchEvent(event);
                                }
                            `
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
