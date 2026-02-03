import React, { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * EnhancedTextarea Component
 * Textarea with formatting instructions and character count
 */
const EnhancedTextarea = ({ 
  value, 
  onChange, 
  placeholder = 'Тайлбар оруулах...', 
  rows = 6,
  maxLength = 2000,
  showInstructions = true,
  label = 'Тайлбар',
  required = false
}) => {
  const [showHints, setShowHints] = useState(false);
  const charCount = value?.length || 0;
  const charRemaining = maxLength - charCount;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {showInstructions && (
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Info size={14} />
            <span>Формат заавар</span>
          </button>
        )}
      </div>

      {/* Formatting Hints */}
      {showHints && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm space-y-1">
          <div className="font-semibold text-blue-900 mb-2">📝 Текст форматлах:</div>
          <ul className="text-blue-800 space-y-1 ml-4">
            <li>• <strong>Мөр шилжилт:</strong> Enter товч дарах</li>
            <li>• <strong>Догол мөр:</strong> Enter хоёр удаа дарах</li>
            <li>• <strong>Жагсаалт:</strong> Мөр бүрийн эхэнд "•" эсвэл "1." тавих</li>
          </ul>
          <div className="text-blue-700 mt-2 text-xs">
            💡 Жишээ нь: "• Эхний зүйл" эсвэл "1. Эхний алхам"
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
        style={{ minHeight: '120px' }}
      />

      {/* Character Count */}
      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-500">
          {charCount} / {maxLength} тэмдэгт
        </div>
        {charRemaining < 100 && (
          <div className={`font-semibold ${
            charRemaining < 0 
              ? 'text-red-600' 
              : charRemaining < 50 
                ? 'text-orange-600' 
                : 'text-yellow-600'
          }`}>
            {charRemaining} тэмдэгт үлдсэн
          </div>
        )}
      </div>

      {/* Preview Toggle */}
      {value && value.length > 0 && (
        <details className="bg-gray-50 border border-gray-200 rounded-lg">
          <summary className="px-4 py-2 cursor-pointer font-medium text-sm text-gray-700 hover:bg-gray-100">
            👁️ Урьдчилан харах
          </summary>
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="prose prose-sm max-w-none">
              {value.split('\n\n').map((para, idx) => (
                <p key={idx} className="mb-3">
                  {para.split('\n').map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {line}
                      {lineIdx < para.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

export default EnhancedTextarea;