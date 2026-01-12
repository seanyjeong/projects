/**
 * 성별 선택 컴포넌트
 *
 * 기능:
 * - 남자/여자 선택
 * - 배점표가 성별에 따라 다름
 */

'use client';

import { Gender } from '@/lib/store/silgi-store';
import { User } from 'lucide-react';

interface GenderSelectorProps {
  value: Gender | null;
  onChange: (gender: Gender) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <label className="block text-sm font-medium text-gray-600 mb-4">
        성별 선택 <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {/* 남자 */}
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`
            relative p-4
            rounded-xl
            text-center
            transition-all duration-200
            ${
              value === 'male'
                ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }
          `}
        >
          <div className={`
            w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center
            ${value === 'male' ? 'bg-blue-500' : 'bg-gray-200'}
          `}>
            <User className={`w-6 h-6 ${value === 'male' ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className={`
            text-base font-semibold
            ${value === 'male' ? 'text-blue-700' : 'text-gray-700'}
          `}>
            남자
          </span>
          {value === 'male' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>

        {/* 여자 */}
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`
            relative p-4
            rounded-xl
            text-center
            transition-all duration-200
            ${
              value === 'female'
                ? 'bg-pink-50 border-2 border-pink-500 shadow-sm'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }
          `}
        >
          <div className={`
            w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center
            ${value === 'female' ? 'bg-pink-500' : 'bg-gray-200'}
          `}>
            <User className={`w-6 h-6 ${value === 'female' ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className={`
            text-base font-semibold
            ${value === 'female' ? 'text-pink-700' : 'text-gray-700'}
          `}>
            여자
          </span>
          {value === 'female' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        성별에 따라 실기 배점표가 다르게 적용됩니다
      </p>
    </div>
  );
}
