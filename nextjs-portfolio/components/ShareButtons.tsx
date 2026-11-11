import { useEffect, useState } from 'react';
import { Share2, Link2, Check, Twitter, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import { trackShare, ShareMethod } from '../lib/analytics';

interface ShareButtonsProps {
    slug: string;
    title: string;
    excerpt?: string;
}

export default function ShareButtons({ slug, title, excerpt }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);

    useEffect(() => {
        setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }, []);

    // Always share the clean post URL (no query strings or hashes)
    const getUrl = () => `${window.location.origin}/blog/${encodeURIComponent(slug)}/`;

    const openPlatform = (method: ShareMethod, buildUrl: (url: string, text: string) => string) => {
        const url = getUrl();
        window.open(buildUrl(encodeURIComponent(url), encodeURIComponent(title)), '_blank', 'noopener,noreferrer,width=600,height=600');
        trackShare(slug, method);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            trackShare(slug, 'copy');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const nativeShare = async () => {
        try {
            await navigator.share({ title, text: excerpt, url: getUrl() });
            // Only counts when the share sheet completes, not when it's dismissed
            trackShare(slug, 'native');
        } catch (error: any) {
            if (error?.name !== 'AbortError') console.error('Share failed:', error);
        }
    };

    const buttonClass =
        'p-3 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 dark:hover:bg-accent dark:hover:border-accent transition-colors';

    return (
        <div className="flex flex-wrap items-center gap-3">
            {canNativeShare && (
                <button type="button" onClick={nativeShare} className={buttonClass} title="Share" aria-label="Share">
                    <Share2 size={16} />
                </button>
            )}
            <button
                type="button"
                className={buttonClass}
                title="Share on X"
                aria-label="Share on X"
                onClick={() => openPlatform('x', (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}
            >
                <Twitter size={16} />
            </button>
            <button
                type="button"
                className={buttonClass}
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
                onClick={() => openPlatform('linkedin', (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)}
            >
                <Linkedin size={16} />
            </button>
            <button
                type="button"
                className={buttonClass}
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
                onClick={() => openPlatform('whatsapp', (u, t) => `https://wa.me/?text=${t}%20${u}`)}
            >
                <MessageCircle size={16} />
            </button>
            <button
                type="button"
                className={buttonClass}
                title="Share on Facebook"
                aria-label="Share on Facebook"
                onClick={() => openPlatform('facebook', (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)}
            >
                <Facebook size={16} />
            </button>
            <button type="button" onClick={copyLink} className={`${buttonClass} flex items-center gap-2`} title="Copy link" aria-label="Copy link">
                {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy link'}</span>
            </button>
        </div>
    );
}
