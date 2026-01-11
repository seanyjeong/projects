"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Floating Orbs Background */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-pink-400/30 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px] animate-pulse" />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Hero Section */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-5 py-20">
        <div className="max-w-md w-full space-y-8">

          {/* Glass Card - Hero */}
          <div className="relative p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            {/* Inner Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative space-y-6">
              {/* Badge */}
              <span className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium text-white shadow-lg">
                ✨ 2026 체대입시 계산기
              </span>

              {/* Title */}
              <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
                체대 입시,<br />
                이제 정확하게
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-white/90 leading-relaxed">
                수능 + 실기 점수를 입력하면<br />
                합격 가능성을 실시간으로 계산해요
              </p>

              {/* CTA Button */}
              <Link href="/suneung" className="block w-full h-14 bg-white text-[#667eea] text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center">
                무료로 시작하기
              </Link>

              {/* Stats */}
              <div className="flex items-center justify-around pt-4 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs text-white/70">대학 지원</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">실시간</div>
                  <div className="text-xs text-white/70">점수 계산</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">무료</div>
                  <div className="text-xs text-white/70">100% 무료</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Features Section */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative px-5 py-16">
        <div className="max-w-md mx-auto space-y-6">

          <h2 className="text-3xl font-bold text-white text-center mb-12">
            주요 기능
          </h2>

          {/* Feature Card 1 */}
          <div className="p-6 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  정확한 점수 계산
                </h3>
                <p className="text-white/80 leading-relaxed">
                  각 대학별 반영 비율을 정확히 적용해서<br />
                  실제 환산점수를 계산해요
                </p>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="p-6 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  실기 기록 관리
                </h3>
                <p className="text-white/80 leading-relaxed">
                  다이어리로 실기 기록을 추적하고<br />
                  꾸준한 성장을 확인해요
                </p>
              </div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="p-6 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  대학별 비교 분석
                </h3>
                <p className="text-white/80 leading-relaxed">
                  여러 대학을 한눈에 비교하고<br />
                  최적의 선택을 해요
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* How It Works Section */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative px-5 py-16">
        <div className="max-w-md mx-auto">

          <h2 className="text-3xl font-bold text-white text-center mb-12">
            사용 방법
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold text-white mb-2">
                  수능 점수 입력
                </h3>
                <p className="text-white/80">
                  국어, 수학, 영어, 탐구 점수를 입력해요
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="ml-6 w-px h-8 bg-white/30" />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold text-white mb-2">
                  대학 선택
                </h3>
                <p className="text-white/80">
                  지원하고 싶은 대학과 학과를 선택해요
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="ml-6 w-px h-8 bg-white/30" />

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold text-white mb-2">
                  결과 확인
                </h3>
                <p className="text-white/80">
                  실시간으로 합격 가능성을 확인해요
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CTA Section */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative px-5 py-20">
        <div className="max-w-md mx-auto">

          <div className="relative p-10 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl text-center overflow-hidden">
            {/* Inner Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative space-y-6">
              <h2 className="text-3xl font-bold text-white">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg text-white/90">
                회원가입 없이 바로 사용 가능해요
              </p>
              <Link href="/suneung" className="block w-full h-14 bg-white text-[#667eea] text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center">
                무료로 시작하기 →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Footer */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="relative border-t border-white/20 backdrop-blur-sm py-12 px-5">
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-4">
            <p className="text-sm text-white/70">
              © 2026 Project S. All rights reserved.
            </p>
            <p className="text-xs text-white/50">
              체육계열 입시를 준비하는 모든 학생들을 응원합니다
            </p>
            <p className="text-xs text-white/30">
              v1.0.1 | Build: {process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString().slice(0, 16)}
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          75% {
            transform: translate(20px, 10px) scale(1.02);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-25px, 25px) scale(1.03);
          }
          50% {
            transform: translate(15px, -15px) scale(0.97);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.01);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
          animation-delay: -5s;
        }
      `}</style>
    </div>
  );
}
