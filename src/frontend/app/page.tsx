"use client";

import Link from "next/link";
import { ArrowRight, Target, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-gray-900">체점</span>
          </div>
          <Link
            href="/suneung"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-medium text-emerald-700">2026학년도 정시 계산기</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              체대 입시,<br />
              <span className="text-emerald-600">정확하게 계산하세요</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              수능 성적과 실기 기록을 입력하면<br className="sm:hidden" />
              대학별 환산점수를 실시간으로 계산합니다.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/suneung"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
              >
                무료로 계산하기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-colors"
              >
                자세히 알아보기
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">지원 대학</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">실시간</div>
                <div className="text-sm text-gray-500">점수 계산</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">무료</div>
                <div className="text-sm text-gray-500">서비스</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 체점을 사용해야 할까요?
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              복잡한 체대 입시 계산을 간단하게 해결합니다
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                정확한 환산
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                각 대학별 반영비율을 정확히 적용하여 실제 환산점수를 계산합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                실기 기록 관리
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                실기 기록을 입력하고 대학별 배점표에 따른 점수를 확인하세요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                대학 비교
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                여러 대학을 한 눈에 비교하고 최적의 지원 전략을 세우세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              간단한 3단계
            </h2>
            <p className="text-gray-600">
              복잡한 회원가입 없이 바로 시작하세요
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">수능 성적 입력</h3>
              <p className="text-sm text-gray-600">
                국어, 수학, 영어, 탐구 성적을 입력합니다
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">대학 선택</h3>
              <p className="text-sm text-gray-600">
                지원할 대학과 학과를 선택합니다
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">결과 확인</h3>
              <p className="text-sm text-gray-600">
                환산점수와 예상 경쟁률을 확인합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 bg-emerald-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-emerald-100 mb-8">
            회원가입 없이 무료로 이용할 수 있습니다
          </p>
          <Link
            href="/suneung"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl transition-colors"
          >
            무료로 계산하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-sm text-gray-400">체점 - 체대입시 점수계산기</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 체점. All rights reserved.
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              v2.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
