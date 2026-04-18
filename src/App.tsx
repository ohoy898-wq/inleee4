import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  MessageCircle, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Users,
  Trophy,
  BookOpen
} from 'lucide-react';

// --- Types & Constants ---

type Verdict = 'good' | 'neutral' | 'bad' | 'worst';

interface Choice {
  icon: string;
  tag: string;
  label: string;
  text: string;
  verdict: Verdict;
  feedback: string;
  tip: string;
  next: string;
}

interface Stage {
  badge: string;
  progress: number;
  situation: string;
  who: string | null;
  dialogue: string | null;
  question: string;
  choices: Choice[];
}

const STAGES: Record<string, Stage> = {
  's1': {
    badge: 'Stage 1 — 갈등의 시작',
    progress: 15,
    situation: '수행평가 마감 D-3. 모둠원 지훈이가 책상에 엎드리며 퉁명스럽게 말합니다.',
    who: '지훈',
    dialogue: '아... 난 어차피 이런 거 잘 못해. 너희가 알아서 해라. 내 이름만 넣어줘.',
    question: '지훈이에게 어떻게 말하겠어요?',
    choices: [
      {
        icon: '💡', tag: '협력 제안', label: '협력 제안',
        text: '"지훈아, 사진이나 자료 검색은 잘하잖아. 그 부분만 맡아줄 수 있어? 네가 찾아주면 우리가 훨씬 빨리 끝날 것 같아."',
        verdict: 'good',
        feedback: '지훈이의 강점을 찾아 구체적인 역할을 제안한 훌륭한 대처예요!',
        tip: '강점 기반 역할 부여: 할 수 없다고 느끼는 조원에게 자신감을 심어주는 것이 중요합니다.',
        next: 's1_5'
      },
      {
        icon: '🙏', tag: '내가 다 할게', label: '내가 다 할게',
        text: '"괜찮아, 내가 다 할게. 네 이름은 넣어줄게."',
        verdict: 'neutral',
        feedback: '혼자 짐을 떠안으면 나중에 번아웃이 올 수 있어요.',
        tip: '진정한 협력은 누군가의 희생이 아닌 모두의 참여에서 옵니다.',
        next: 's2b'
      },
      {
        icon: '😤', tag: '감정적 반응', label: '감정적 반응',
        text: '"야, 그럼 이름 빼버린다! 선생님한테 이를 거야!"',
        verdict: 'bad',
        feedback: '협박은 상황을 더 나쁘게 만들 뿐입니다.',
        tip: '감정적 공격은 상대방의 방어심을 높입니다. 차분하게 반응해보세요.',
        next: 's2a'
      }
    ]
  },
  's1_5': {
    badge: 'Stage 1.5 — 지훈의 밀당',
    progress: 30,
    situation: '당신의 설득에 지훈이가 살짝 고개를 들었습니다. 하지만 핑계를 댑니다.',
    who: '지훈',
    dialogue: '아... 하긴 할 건데, 나 지금 폰 배터리가 5%밖에 없는데...?',
    question: '지훈이의 핑계에 어떻게 대처하겠어요?',
    choices: [
      {
        icon: '🔋', tag: '환경적 지원', label: '환경적 지원',
        text: '"내 보조배터리 줄게! 충전하면서 해. 같이하면 금방이야."',
        verdict: 'good',
        feedback: '실질적인 배려로 장애물을 완벽히 해결했어요!',
        tip: '환경적 지원: 상대방이 참여하지 못하는 현실적인 이유를 제거해주는 전략입니다.',
        next: 's2c'
      },
      {
        icon: '⏳', tag: '기다리기', label: '그냥 기다리기',
        text: '"아... 그러면 충전될 때까지 기다릴게."',
        verdict: 'neutral',
        feedback: '시간을 낭비하면 나중에 더 큰 압박이 올 수 있습니다.',
        tip: '기다리는 것보다 적극적으로 해결책을 주는 게 더 나은 협력입니다.',
        next: 's2a'
      }
    ]
  },
  's2a': {
    badge: 'Stage 2-A — 수아의 폭발',
    progress: 45,
    situation: '지훈이와의 대화가 틀어졌습니다. 옆에서 듣고 있던 수아가 폭발합니다.',
    who: '수아',
    dialogue: '야! 쟤는 놀고먹는데 왜 우리만 고생해야 해? 나도 안 해! 그냥 다 대충 해!',
    question: '수아의 분노에 어떻게 대응할까요?',
    choices: [
      {
        icon: '👂', tag: '공감 + 제안', label: '공감 + 제안',
        text: '"수아야, 네 말이 맞아. 나도 답답해. 일단 우리 셋이라도 역할 나눠서 마무리하자. 지훈이 몫은 최소한으로 줄이고."',
        verdict: 'good',
        feedback: '분노를 공감하고 현실적인 대안을 제시한 훌륭한 리더십입니다.',
        tip: '경청과 공감: 분노하는 조원의 감정을 먼저 인정해주면 소통의 문이 열립니다.',
        next: 'ending_normal'
      },
      {
        icon: '😠', tag: '맞불 작전', label: '맞불 작전',
        text: '"그래, 나도 안 해! 다 같이 망하자!"',
        verdict: 'bad',
        feedback: '감정이 감정을 부르면 팀이 완전히 무너집니다.',
        tip: '갈등이 격화될 때 함께 화내는 것은 불에 기름을 붓는 격입니다.',
        next: 'ending_bad'
      }
    ]
  },
  's2b': {
    badge: 'Stage 2-B — 번아웃 직전',
    progress: 45,
    situation: '혼자 모든 짐을 떠안고 마감 전날 밤을 새우고 있습니다. 조원들은 단톡방을 읽씹합니다.',
    who: null,
    dialogue: null,
    question: '이 상황에서 어떻게 하겠어요?',
    choices: [
      {
        icon: '💬', tag: '솔직함', label: '솔직하게 도움 요청',
        text: '"얘들아, 나 솔직히 말할게. 혼자 하려니까 너무 힘들어. 각자 딱 한 파트씩만 맡아줄 수 있어?"',
        verdict: 'good',
        feedback: '자신의 감정을 솔직하게 나 전달법으로 표현한 용기 있는 행동입니다.',
        tip: '나 전달법(I-Message): "너는 왜 안 해?" 대신 "나는 힘들어"라고 말해보세요.',
        next: 'ending_normal'
      },
      {
        icon: '😶', tag: '침묵', label: '그냥 혼자 계속',
        text: '(아무 말 없이 밤새 혼자 과제를 끝낸다.)',
        verdict: 'neutral',
        feedback: '과제는 제출되겠지만 조원들과의 관계는 더 멀어질 수 있습니다.',
        tip: '희생은 협력이 아닙니다. 어렵더라도 소통을 시도해보세요.',
        next: 'ending_normal'
      }
    ]
  },
  's2c': {
    badge: 'Stage 2-C — 수아의 견제',
    progress: 55,
    situation: '지훈이가 자료 검색을 시작했습니다. 그런데 이번엔 수아가 불만을 제기합니다.',
    who: '수아',
    dialogue: '야, 지훈이는 사진만 찾는데 왜 나만 PPT 제작을 다 해야 해? 나도 분량 줄여줘!',
    question: '수아의 형평성 지적에 어떻게 대응할까요?',
    choices: [
      {
        icon: '⚖️', tag: '역할 재분배', label: '역할 재분배',
        text: '"수아야, 맞아. 같이 남은 할 일 목록 다시 써볼게. 공평하게 다시 나누자."',
        verdict: 'good',
        feedback: '절차적 공정성을 실천한 최고의 대처입니다!',
        tip: '절차적 재조율: 불만이 있을 때 투명하게 다시 조율하는 것이 신뢰의 핵심입니다.',
        next: 's3'
      },
      {
        icon: '🙅', tag: '무시', label: '그냥 무시하기',
        text: '"PPT 네가 제일 잘하잖아. 그냥 해."',
        verdict: 'bad',
        feedback: '능력이 있다는 이유로 독박을 씌우는 것은 공정하지 않습니다.',
        tip: '잘하는 것과 많이 하는 것은 별개입니다. 형평성을 고려하세요.',
        next: 'ending_bad'
      }
    ]
  },
  's3': {
    badge: 'Stage 3 — 마지막 관문',
    progress: 75,
    situation: '드디어 각자 역할을 마쳤습니다! 그런데 자료를 합쳐보니 흐름이 끊겨 보이네요.',
    who: '수아',
    dialogue: '각자 맡은 건 다 하는데, 합치니까 뭔가 이상해... 어떡하지?',
    question: '마지막 마무리, 어떻게 할까요?',
    choices: [
      {
        icon: '🔄', tag: '통합 피드백', label: '다 같이 피드백',
        text: '"다 같이 모여서 전체 흐름 한 번 읽어보자. 서로 피드백해주면 금방 맞출 수 있어!"',
        verdict: 'good',
        feedback: '상호 피드백과 통합을 통해 퀄리티를 비약적으로 높였습니다.',
        tip: '상호 통합: 개별 결과물을 하나로 엮는 과정이 협동의 정수입니다.',
        next: 'ending_true'
      },
      {
        icon: '🎨', tag: '표지 꾸미기', label: '그냥 제출',
        text: '"시간 없으니까 대충 합쳐서 그냥 내자."',
        verdict: 'neutral',
        feedback: '제출은 했지만 결과물이 조각조각난 느낌을 줄 수 있습니다.',
        tip: '마지막 10%의 검토가 전체 인상을 결정합니다.',
        next: 'ending_normal'
      }
    ]
  }
};

interface Ending {
  title: string;
  subtitle: string;
  pillText: string;
  colorClass: string;
  result: string;
  impact: string;
}

const ENDINGS: Record<string, Ending> = {
  ending_true: {
    title: '🌟 Perfect Cooperation',
    subtitle: '골든타임 사수 성공!',
    pillText: '수행평가 만점 예상',
    colorClass: 'emerald',
    result: '훌륭합니다! 타인의 강점을 살려 역할을 배분하고, 마지막 통합 피드백까지 완벽하게 이끌어냈습니다.',
    impact: '▶ 신뢰 형성: 갈등 극복 과정에서 조원 간 유대감이 강해졌습니다.\n▶ 성과 극대화: 개개인보다 뛰어난 팀의 시너지를 증명했습니다.'
  },
  ending_normal: {
    title: '🍂 Good Enough',
    subtitle: '절반의 성공',
    pillText: '부분 점수 획득',
    colorClass: 'amber',
    result: '우여곡절 끝에 과제는 제출했지만, 감정의 앙금이 조금 남았습니다.',
    impact: '▶ 과제 제출: 목표는 달성했습니다.\n▶ 소통 부족: 다음 활동을 위해 더 나은 조율 연습이 필요합니다.'
  },
  ending_bad: {
    title: '💀 Team Disaster',
    subtitle: '모둠 폭발',
    pillText: '하위권 점수',
    colorClass: 'rose',
    result: '갈등을 해결하지 못해 과제 퀄리티가 낮아지거나 제출하지 못했습니다.',
    impact: '▶ 감정 소모: 서로에 대한 실망감이 큽니다.\n▶ 협력 실패: 갈등을 피하기보다 마주하는 연습이 필요합니다.'
  }
};

// --- Main Components ---

export default function App() {
  const [screen, setScreen] = useState<'title' | 'story' | 'ending' | 'summary'>('title');
  const [currentId, setCurrentId] = useState('s1');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const stage = STAGES[currentId];

  const handleStart = () => {
    setCurrentId('s1');
    setSelectedChoice(null);
    setShowResult(false);
    setScreen('story');
  };

  const handleChoice = (index: number) => {
    setSelectedChoice(index);
    setShowResult(true);
  };

  const handleNext = () => {
    const next = stage.choices[selectedChoice!].next;
    if (next.startsWith('ending_')) {
      setScreen('ending');
    } else {
      setCurrentId(next);
      setSelectedChoice(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl md:min-h-[700px] flex flex-col overflow-hidden neubrutalism-card relative p-6 bg-white">
        
        <AnimatePresence mode="wait">
          {screen === 'title' && (
            <motion.div 
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12"
            >
              <div className="space-y-4">
                <motion.div 
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="bg-vp-ink text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase inline-block border-[2px] border-vp-ink"
                >
                  💣 갈등 조율 시뮬레이션
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black leading-tight text-vp-ink italic">
                  모둠 폭발 <br/> <span className="text-vp-primary-blue not-italic underline decoration-[6px] decoration-vp-ink underline-offset-4">1초 전!</span>
                </h1>
                <p className="text-slate-600 text-sm font-bold max-w-[280px]">
                  수행평가 마감 직전의 위기... <br/>
                  당신의 센스 있는 선택으로 팀을 구하세요.
                </p>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-vp-primary-yellow rounded-full border-[3px] border-vp-ink shadow-[6px_6px_0px_#121212]" />
                <Zap className="w-24 h-24 text-vp-ink relative z-10 fill-vp-primary-green" />
              </div>

              <button 
                onClick={handleStart}
                className="group relative flex items-center gap-3 bg-vp-primary-blue text-white px-10 py-5 rounded-[20px] font-black text-xl border-[3px] border-vp-ink shadow-[6px_6px_0px_#121212] transition-all hover:bg-vp-ink hover:text-white active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                도전하기
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
            </motion.div>
          )}

          {screen === 'story' && (
            <motion.div 
              key="story"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-vp-ink uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-vp-ink">{stage.progress}%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full border-[2px] border-vp-ink overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.progress}%` }}
                      className="h-full bg-vp-primary-green rounded-full border-r-[2px] border-vp-ink"
                    />
                  </div>
                </div>
                <div className="bg-vp-primary-yellow text-vp-ink px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap border-[2px] border-vp-ink shadow-[2px_2px_0px_var(--color-vp-ink)]">
                  {stage.badge.split('—')[0]}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1 pb-4">
                <div className="bg-slate-50 rounded-[24px] p-5 border-[3px] border-vp-ink text-slate-800 text-[14px] font-bold leading-relaxed shadow-[4px_4px_0px_var(--color-vp-ink)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-vp-ink" />
                    <span className="text-[10px] font-black text-vp-ink uppercase tracking-widest">Situation</span>
                  </div>
                  {stage.situation}
                </div>

                {stage.dialogue && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-vp-primary-pink border-[2px] border-vp-ink flex items-center justify-center text-vp-ink text-[14px] font-black shadow-[2px_2px_0px_var(--color-vp-ink)]">
                        {stage.who?.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-vp-ink">{stage.who}</span>
                    </div>
                    <div className="bg-white border-[3px] border-vp-ink rounded-[24px] rounded-tl-none p-5 text-base font-bold text-vp-ink leading-normal relative shadow-[4px_4px_0px_var(--color-vp-ink)]">
                      "{stage.dialogue}"
                    </div>
                  </div>
                )}

                <div className="py-2">
                  <h3 className="text-2xl font-black text-vp-ink leading-tight">
                    {stage.question}
                  </h3>
                </div>
              </div>

              {/* Choice Section */}
              <div className="mt-auto pt-6 space-y-3">
                <AnimatePresence mode="wait">
                  {!showResult ? (
                    <motion.div 
                      key="choices"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="grid grid-cols-1 gap-3"
                    >
                      {stage.choices.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => handleChoice(i)}
                          className="w-full text-left p-4 rounded-[20px] border-[3px] border-vp-ink transition-all hover:bg-vp-primary-yellow hover:-translate-y-1 active:translate-y-0 active:shadow-none shadow-[4px_4px_0px_var(--color-vp-ink)] flex gap-4 group bg-white"
                        >
                          <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{c.icon}</span>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-vp-primary-blue uppercase tracking-widest">{c.tag}</span>
                            <p className="text-[15px] font-bold text-vp-ink leading-snug">{c.text}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-[24px] p-6 space-y-4 border-[3px] border-vp-ink shadow-[6px_6px_0px_var(--color-vp-ink)] ${
                        stage.choices[selectedChoice!].verdict === 'good' ? 'bg-vp-primary-green' :
                        stage.choices[selectedChoice!].verdict === 'neutral' ? 'bg-vp-primary-yellow' :
                        'bg-vp-primary-pink'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {stage.choices[selectedChoice!].verdict === 'good' ? (
                          <CheckCircle2 className="w-6 h-6 text-vp-ink" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-vp-ink" />
                        )}
                        <span className="text-[14px] font-black uppercase tracking-widest text-vp-ink">
                          {stage.choices[selectedChoice!].verdict === 'good' ? 'Great Choice!' : 'Vibe Check'}
                        </span>
                      </div>
                      <p className="text-base font-black text-vp-ink leading-relaxed">
                        {stage.choices[selectedChoice!].feedback}
                      </p>
                      <div className="p-4 bg-white border-[2px] border-vp-ink rounded-2xl">
                        <p className="text-[13px] font-bold text-vp-ink italic">
                          💡 {stage.choices[selectedChoice!].tip}
                        </p>
                      </div>
                      <button 
                        onClick={handleNext}
                        className="w-full py-4 rounded-2xl font-black text-lg bg-vp-ink text-white transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 border-[2px] border-vp-ink"
                      >
                        계속하기
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {screen === 'ending' && (
            <motion.div 
              key="ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 bg-vp-primary-yellow rounded-[24px] border-[3px] border-vp-ink flex items-center justify-center mx-auto shadow-[6px_6px_0px_var(--color-vp-ink)]">
                    <Trophy className="w-12 h-12 text-vp-ink" />
                </div>
                <h2 className="text-4xl font-black text-vp-ink italic">시뮬레이션 종료!</h2>
              </div>
              
              <div className="w-full bg-white rounded-[32px] p-8 space-y-6 border-[3px] border-vp-ink shadow-[8px_8px_0px_var(--color-vp-ink)] text-left">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Outcome</span>
                  <p className="text-2xl font-black text-vp-ink">모둠 과제 제출 및 <br/><span className="text-vp-primary-blue">갈등 해결 완료!</span></p>
                </div>
                <div className="h-[2px] bg-vp-ink w-full opacity-10" />
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2">
                      <span className="bg-vp-primary-green text-vp-ink px-4 py-1.5 rounded-full text-[11px] font-black border-[2px] border-vp-ink">강점 활용</span>
                      <span className="bg-vp-primary-blue text-white px-4 py-1.5 rounded-full text-[11px] font-black border-[2px] border-vp-ink">절차적 공정성</span>
                      <span className="bg-vp-primary-pink text-white px-4 py-1.5 rounded-full text-[11px] font-black border-[2px] border-vp-ink">공감 대화</span>
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed font-bold">
                      당신은 갈등 상황에서 감정적으로 대응하기보다 상대방의 입장을 먼저 생각하고, 구체적인 해결책을 제시하며 팀을 이끌었습니다. 수행평가에서 높은 점수를 기대할 수 있을 뿐만 아니라, 훌륭한 리더로서의 자질을 보여주었습니다.
                   </p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4">
                <button 
                  onClick={() => setScreen('summary')}
                  className="w-full py-5 bg-vp-primary-green text-vp-ink rounded-[20px] font-black text-xl border-[3px] border-vp-ink shadow-[6px_6px_0px_var(--color-vp-ink)] flex items-center justify-center gap-3 hover:bg-vp-primary-yellow transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                >
                  <BookOpen className="w-6 h-6" />
                  협력 비법 요약 보기
                </button>
                <button 
                  onClick={handleStart}
                  className="w-full py-5 bg-white text-vp-ink border-[3px] border-vp-ink rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-[4px_4px_0px_var(--color-vp-ink)] hover:bg-slate-50 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <RotateCcw className="w-6 h-6" />
                  다시 시작하기
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-vp-primary-pink rounded-2xl border-[3px] border-vp-ink shadow-[3px_3px_0px_var(--color-vp-ink)]">
                    <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black italic">협력 핵심 비법</h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                {[
                  { title: '강점 기반 역할 부여', desc: '상대방이 잘하는 것을 찾아주면 참여도가 훨씬 높아집니다.', color: 'emerald' },
                  { title: '절차적 재조율 (투명한 분배)', desc: '불만이 있을 때 투명하게 다시 기준을 정하는 게 신뢰의 핵심입니다.', color: 'amber' },
                  { title: '환경적 지원 및 배려', desc: '상대방이 참여하지 못하는 현실적인 제약(예: 배터리)을 함께 해결해주세요.', color: 'blue' },
                  { title: '상호 피드백과 최종 통합', desc: '각자 한 걸 합칠 때 함께 검토해야 진짜 하나가 됩니다.', color: 'pink' },
                  { title: '나 전달법 (I-Message) 활용', desc: '상대방을 탓하기보다 나의 어려움을 솔직하게 전달해보세요.', color: 'emerald' },
                  { title: '경청과 공감적 반응', desc: '분노하거나 답답해하는 조원의 마음을 먼저 읽어주면 소통이 시작됩니다.', color: 'amber' },
                  { title: '공동의 목표 재확인', desc: "우리 모두 '과제 통과'와 '좋은 성적'이라는 같은 배를 탔음을 상기시키세요.", color: 'blue' },
                  { title: '타협과 양보의 자세', desc: "모두가 만족할 순 없어도, 조금씩 양보하며 '윈-윈' 할 수 있는 타협점을 찾으세요.", color: 'pink' }
                ].map((item, i) => (
                  <div key={i} className={`p-6 bg-white rounded-[24px] border-[3px] border-vp-ink shadow-[4px_4px_0px_var(--color-vp-ink)] space-y-2`}>
                    <h4 className={`text-lg font-black ${
                        item.color === 'emerald' ? 'text-vp-primary-green' :
                        item.color === 'amber' ? 'text-vp-primary-yellow' :
                        item.color === 'blue' ? 'text-vp-primary-blue' : 'text-vp-primary-pink'
                    } brightness-75`}>{i+1}. {item.title}</h4>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleStart}
                className="mt-8 w-full py-5 bg-vp-ink text-white rounded-[20px] font-black text-xl border-[3px] border-vp-ink shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                메인으로 돌아가기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
