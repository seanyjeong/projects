'use client';

import { useSuneungStore, TamguSubject, MathSubject } from '@/lib/store/suneung-store';
import { ScoreInput } from '@/components/suneung/ScoreInput';
import { SubjectSelect } from '@/components/suneung/SubjectSelect';
import { ExamTypeSelector } from '@/components/suneung/ExamTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calculator } from 'lucide-react';

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

export default function SuneungPage() {
  const router = useRouter();
  const { data, updateExamType, updateKorean, updateMath, updateEnglish, updateTamgu1, updateTamgu2, updateHistory, isValid } = useSuneungStore();

  const handleNext = () => {
    if (!isValid()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    // 다음 페이지로 이동 (대학 검색)
    router.push('/university-search');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border safe-top">
        <div className="px-5 py-4 flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">수능 점수 입력</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-6 space-y-6">
        {/* 시험 종류 선택 */}
        <ExamTypeSelector selected={data.examType} onChange={updateExamType} />

        {/* 국어 */}
        <ScoreInput
          subjectName="국어"
          standardScore={data.korean.standardScore}
          percentile={data.korean.percentile}
          grade={data.korean.grade}
          onStandardScoreChange={(value) => updateKorean({ standardScore: value })}
          onPercentileChange={(value) => updateKorean({ percentile: value })}
          onGradeChange={(value) => updateKorean({ grade: value })}
        />

        {/* 수학 */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">수학</h3>
            <SubjectSelect
              label=""
              value={data.math.subject}
              onChange={(value) => updateMath({ subject: value as MathSubject })}
              options={mathSubjects}
              id="math-subject"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="math-std" className="text-sm mb-2 block text-muted-foreground">
                표준점수
              </Label>
              <Input
                id="math-std"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="130"
                value={data.math.standardScore}
                onChange={(e) => updateMath({ standardScore: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="math-per" className="text-sm mb-2 block text-muted-foreground">
                백분위
              </Label>
              <Input
                id="math-per"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="95"
                value={data.math.percentile}
                onChange={(e) => updateMath({ percentile: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="w-20">
              <Label htmlFor="math-grade" className="text-sm mb-2 block text-muted-foreground">
                등급
              </Label>
              <Input
                id="math-grade"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="2"
                value={data.math.grade}
                onChange={(e) => updateMath({ grade: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>
          </div>
        </div>

        {/* 영어 (등급만) */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">영어</h3>
          <div className="w-32">
            <Label htmlFor="english-grade" className="text-sm mb-2 block text-muted-foreground">
              등급
            </Label>
            <Input
              id="english-grade"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="2"
              value={data.english.grade}
              onChange={(e) => updateEnglish(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center font-mono h-12"
            />
          </div>
        </div>

        {/* 탐구1 */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">탐구 1</h3>

          <SubjectSelect
            label="과목 선택"
            value={data.tamgu1.subject}
            onChange={(value) => updateTamgu1({ subject: value as TamguSubject })}
            options={[{ value: '', label: '과목을 선택하세요' }, ...tamguSubjects]}
            id="tamgu1-subject"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="tamgu1-std" className="text-sm mb-2 block text-muted-foreground">
                표준점수
              </Label>
              <Input
                id="tamgu1-std"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="65"
                value={data.tamgu1.standardScore}
                onChange={(e) => updateTamgu1({ standardScore: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="tamgu1-per" className="text-sm mb-2 block text-muted-foreground">
                백분위
              </Label>
              <Input
                id="tamgu1-per"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="92"
                value={data.tamgu1.percentile}
                onChange={(e) => updateTamgu1({ percentile: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="w-20">
              <Label htmlFor="tamgu1-grade" className="text-sm mb-2 block text-muted-foreground">
                등급
              </Label>
              <Input
                id="tamgu1-grade"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="2"
                value={data.tamgu1.grade}
                onChange={(e) => updateTamgu1({ grade: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>
          </div>
        </div>

        {/* 탐구2 */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">탐구 2</h3>

          <SubjectSelect
            label="과목 선택"
            value={data.tamgu2.subject}
            onChange={(value) => updateTamgu2({ subject: value as TamguSubject })}
            options={[{ value: '', label: '과목을 선택하세요' }, ...tamguSubjects]}
            id="tamgu2-subject"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="tamgu2-std" className="text-sm mb-2 block text-muted-foreground">
                표준점수
              </Label>
              <Input
                id="tamgu2-std"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="62"
                value={data.tamgu2.standardScore}
                onChange={(e) => updateTamgu2({ standardScore: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="tamgu2-per" className="text-sm mb-2 block text-muted-foreground">
                백분위
              </Label>
              <Input
                id="tamgu2-per"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="88"
                value={data.tamgu2.percentile}
                onChange={(e) => updateTamgu2({ percentile: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>

            <div className="w-20">
              <Label htmlFor="tamgu2-grade" className="text-sm mb-2 block text-muted-foreground">
                등급
              </Label>
              <Input
                id="tamgu2-grade"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="3"
                value={data.tamgu2.grade}
                onChange={(e) => updateTamgu2({ grade: e.target.value.replace(/[^0-9]/g, '') })}
                className="text-center font-mono h-12"
              />
            </div>
          </div>
        </div>

        {/* 한국사 (등급만) */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">한국사</h3>
          <div className="w-32">
            <Label htmlFor="history-grade" className="text-sm mb-2 block text-muted-foreground">
              등급
            </Label>
            <Input
              id="history-grade"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="3"
              value={data.history.grade}
              onChange={(e) => updateHistory(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center font-mono h-12"
            />
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t border-border safe-bottom">
        <Button
          onClick={handleNext}
          disabled={!isValid()}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          다음 단계
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
