import { Facebook, Twitter, Linkedin, Instagram, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';

const ShareButtons = ({ url, title, description, image }) => {
  const [showCopied, setShowCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Encode URL parameters
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  // Social media share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    // Instagram doesn't support direct web sharing, so we'll copy link
    instagram: null,
  };

  const handleShare = (platform) => {
    if (platform === 'instagram') {
      // Copy link for Instagram (they don't have web share API)
      handleCopyLink();
      alert('Instagram-д шэйр хийхийн тулд link-г хуулж, Instagram апп дээр post хийнэ үү.');
      return;
    }

    const url = shareUrls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        title="Шэйр хийх"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Шэйр хийх</span>
      </button>

      {/* Share Menu (fallback for desktop) */}
      {showShareMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[240px]">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Шэйр хийх</h4>
            
            <div className="space-y-2">
              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Facebook
                </span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Twitter size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  X (Twitter)
                </span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <Linkedin size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  LinkedIn
                </span>
              </button>

              {/* Instagram */}
              <button
                onClick={() => handleShare('instagram')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center">
                  <Instagram size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">
                  Instagram
                </span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Link2 size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {showCopied ? '✓ Хуулагдлаа!' : 'Link хуулах'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Copied notification */}
      {showCopied && (
        <div className="absolute top-full mt-2 right-0 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          ✓ Link хуулагдлаа!
        </div>
      )}
    </div>
  );
};

export default ShareButtons;