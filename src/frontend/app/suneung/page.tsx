'use client';

import { useSuneungStore, TamguSubject, MathSubject, KoreanSubject } from '@/lib/store/suneung-store';
import { SubjectSelect } from '@/components/suneung/SubjectSelect';
import { ExamTypeSelector } from '@/components/suneung/ExamTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Info, BookOpen, Calculator, FlaskConical, Globe, History } from 'lucide-react';

// 국어 선택과목 옵션
const koreanSubjects: { value: KoreanSubject; label: string }[] = [
  { value: '화법과작문', label: '화법과 작문' },
  { value: '언어와매체', label: '언어와 매체' },
];

// 수학 선택과목 옵션
const mathSubjects: { value: MathSubject; label: string }[] = [
  { value: '확통', label: '확률과 통계' },
  { value: '미적', label: '미적분' },
  { value: '기하', label: '기하' },
];

// 탐구 과목 옵션
const tamguSubjects: { value: TamguSubject; label: string }[] = [
  { value: '생활과 윤리', label: '생활과 윤리' },
  { value: '윤리와 사상', label: '윤리와 사상' },
  { value: '한국지리', label: '한국지리' },
  { value: '세계지리', label: '세계지리' },
  { value: '동아시아사', label: '동아시아사' },
  { value: '세계사', label: '세계사' },
  { value: '정치와 법', label: '정치와 법' },
  { value: '경제', label: '경제' },
  { value: '사회문화', label: '사회문화' },
  { value: '물리학I', label: '물리학I' },
  { value: '화학I', label: '화학I' },
  { value: '생명과학I', label: '생명과학I' },
  { value: '지구과학I', label: '지구과학I' },
  { value: '물리학II', label: '물리학II' },
  { value: '화학II', label: '화학II' },
  { value: '생명과학II', label: '생명과학II' },
  { value: '지구과학II', label: '지구과학II' },
];

// 입력 필드 컴포넌트
function ScoreField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  const isEmpty = required && !value;

  return (
    <div className="flex-1">
      <Label htmlFor={id} className="text-sm font-medium text-gray-600 mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        className={`text-center font-mono h-12 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 ${
          isEmpty ? 'border-amber-300 bg-amber-50/50' : ''
        }`}
      />
    </div>
  );
}

// 섹션 카드 컴포넌트
function SubjectCard({
  title,
  icon: Icon,
  children,
  color = 'emerald',
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SuneungPage() {
  const router = useRouter();
  const { data, updateExamType, updateKorean, updateMath, updateEnglish, updateTamgu1, updateTamgu2, updateHistory, isValid } = useSuneungStore();

  const handleNext = () => {
    if (!isValid()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    router.push('/university');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-gray-900">수능 성적 입력</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            1 / 3 단계
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-gray-100">
            <div className="h-full w-1/3 bg-emerald-500 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-8 pb-32">
        {/* 시험 종류 선택 */}
        <div className="mb-6">
          <ExamTypeSelector selected={data.examType} onChange={updateExamType} />
        </div>

        {/* 입력 안내 */}
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-emerald-800 mb-1">수능 성적표를 준비해주세요</p>
              <p className="text-emerald-600">
                각 과목의 표준점수, 백분위, 등급을 입력합니다. 모든 필수 항목을 입력해야 다음 단계로 진행할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 국어 */}
          <SubjectCard title="국어" icon={BookOpen} color="emerald">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">선택과목</span>
              <SubjectSelect
                label=""
                value={data.korean.subject}
                onChange={(value) => updateKorean({ subject: value as KoreanSubject })}
                options={koreanSubjects}
                id="korean-subject"
              />
            </div>
            <div className="flex gap-3">
              <ScoreField
                id="korean-std"
                label="표준점수"
                value={data.korean.standardScore}
                onChange={(v) => updateKorean({ standardScore: v })}
                placeholder="131"
              />
              <ScoreField
                id="korean-per"
                label="백분위"
                value={data.korean.percentile}
                onChange={(v) => updateKorean({ percentile: v })}
                placeholder="95"
              />
              <div className="w-24">
                <ScoreField
                  id="korean-grade"
                  label="등급"
                  value={data.korean.grade}
                  onChange={(v) => updateKorean({ grade: v })}
                  placeholder="2"
                />
              </div>
            </div>
          </SubjectCard>

          {/* 수학 */}
          <SubjectCard title="수학" icon={Calculator} color="blue">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">선택과목</span>
              <SubjectSelect
                label=""
                value={data.math.subject}
                onChange={(value) => updateMath({ subject: value as MathSubject })}
                options={mathSubjects}
                id="math-subject"
              />
            </div>
            <div className="flex gap-3">
              <ScoreField
                id="math-std"
                label="표준점수"
                value={data.math.standardScore}
                onChange={(v) => updateMath({ standardScore: v })}
                placeholder="134"
              />
              <ScoreField
                id="math-per"
                label="백분위"
                value={data.math.percentile}
                onChange={(v) => updateMath({ percentile: v })}
                placeholder="96"
              />
              <div className="w-24">
                <ScoreField
                  id="math-grade"
                  label="등급"
                  value={data.math.grade}
                  onChange={(v) => updateMath({ grade: v })}
                  placeholder="2"
                />
              </div>
            </div>
          </SubjectCard>

          {/* 영어 */}
          <SubjectCard title="영어" icon={Globe} color="purple">
            <p className="text-sm text-gray-500 mb-4">영어는 절대평가로 등급만 입력합니다 (1~9등급)</p>
            <div className="w-32">
              <ScoreField
                id="english-grade"
                label="등급"
                value={data.english.grade}
                onChange={updateEnglish}
                placeholder="1"
              />
            </div>
          </SubjectCard>

          {/* 탐구1 */}
          <SubjectCard title="탐구 1" icon={FlaskConical} color="orange">
            <div className="mb-4">
              <SubjectSelect
                label="과목 선택"
                value={data.tamgu1.subject}
                onChange={(value) => updateTamgu1({ subject: value as TamguSubject })}
                options={[{ value: '', label: '과목을 선택하세요' }, ...tamguSubjects]}
                id="tamgu1-subject"
              />
            </div>
            <div className="flex gap-3">
              <ScoreField
                id="tamgu1-std"
                label="표준점수"
                value={data.tamgu1.standardScore}
                onChange={(v) => updateTamgu1({ standardScore: v })}
                placeholder="65"
              />
              <ScoreField
                id="tamgu1-per"
                label="백분위"
                value={data.tamgu1.percentile}
                onChange={(v) => updateTamgu1({ percentile: v })}
                placeholder="92"
              />
              <div className="w-24">
                <ScoreField
                  id="tamgu1-grade"
                  label="등급"
                  value={data.tamgu1.grade}
                  onChange={(v) => updateTamgu1({ grade: v })}
                  placeholder="2"
                />
              </div>
            </div>
          </SubjectCard>

          {/* 탐구2 */}
          <SubjectCard title="탐구 2" icon={FlaskConical} color="orange">
            <div className="mb-4">
              <SubjectSelect
                label="과목 선택"
                value={data.tamgu2.subject}
                onChange={(value) => updateTamgu2({ subject: value as TamguSubject })}
                options={[{ value: '', label: '과목을 선택하세요' }, ...tamguSubjects]}
                id="tamgu2-subject"
              />
            </div>
            <div className="flex gap-3">
              <ScoreField
                id="tamgu2-std"
                label="표준점수"
                value={data.tamgu2.standardScore}
                onChange={(v) => updateTamgu2({ standardScore: v })}
                placeholder="62"
              />
              <ScoreField
                id="tamgu2-per"
                label="백분위"
                value={data.tamgu2.percentile}
                onChange={(v) => updateTamgu2({ percentile: v })}
                placeholder="88"
              />
              <div className="w-24">
                <ScoreField
                  id="tamgu2-grade"
                  label="등급"
                  value={data.tamgu2.grade}
                  onChange={(v) => updateTamgu2({ grade: v })}
                  placeholder="3"
                />
              </div>
            </div>
          </SubjectCard>

          {/* 한국사 */}
          <SubjectCard title="한국사" icon={History} color="emerald">
            <p className="text-sm text-gray-500 mb-4">한국사는 절대평가로 등급만 입력합니다 (1~9등급)</p>
            <div className="w-32">
              <ScoreField
                id="history-grade"
                label="등급"
                value={data.history.grade}
                onChange={updateHistory}
                placeholder="3"
              />
            </div>
          </SubjectCard>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-4 safe-bottom">
          <Button
            onClick={handleNext}
            disabled={!isValid()}
            className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl"
            size="lg"
          >
            다음 단계: 대학 선택
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          {!isValid() && (
            <p className="text-center text-sm text-gray-500 mt-2">
              모든 필수 항목을 입력해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
