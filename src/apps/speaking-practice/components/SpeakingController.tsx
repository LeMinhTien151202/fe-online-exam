import {
AudioFilled,
CaretRightOutlined,
CheckCircleOutlined,
PauseCircleFilled,
PlayCircleFilled,
ReloadOutlined
} from '@ant-design/icons';
import { Button,Progress,Space,message } from 'antd';
import React,{ useEffect,useRef,useState } from 'react';
import styled,{ keyframes } from 'styled-components';
import { AudioWaveform } from './AudioWaveform';

interface SpeakingControllerProps {
  prepTime: number; // thời gian chuẩn bị (s)
  recordingTime: number; // thời gian ghi âm (s)
  onCompleted?: (audioUrl: string | null) => void;
  onReset?: () => void;
  statusColor?: string; // Tông màu chủ đạo
  title?: string;
}

export const SpeakingController: React.FC<SpeakingControllerProps> = ({
  prepTime,
  recordingTime,
  onCompleted,
  onReset,
  statusColor = '#3b5b8c',
  title = ''
}) => {
  const [step, setStep] = useState<'IDLE' | 'PREPARATION' | 'RECORDING' | 'COMPLETED'>('IDLE');
  const [prepCountdown, setPrepCountdown] = useState(prepTime);
  const [recCountdown, setRecCountdown] = useState(recordingTime);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  
  // Custom Audio playback state
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // MediaRecorder refs
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Timer intervals
  const prepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play electronic beep using Web Audio API
  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime); // 800 Hz beep
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35); // Duration 350ms
    } catch (e) {
      console.warn('Web Audio beep failed:', e);
    }
  };

  // Reset all state when prepTime or recordingTime changes (e.g. changing question)
  useEffect(() => {
    resetAll();
  }, [prepTime, recordingTime, title]);

  // Handle Prep countdown
  useEffect(() => {
    if (step === 'PREPARATION') {
      if (prepCountdown > 0) {
        prepTimerRef.current = setTimeout(() => {
          setPrepCountdown(prev => prev - 1);
        }, 1000);
      } else {
        // Prep time over -> auto start recording
        startRecording();
      }
    }
    return () => {
      if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    };
  }, [step, prepCountdown]);

  // Handle Recording countdown
  useEffect(() => {
    if (step === 'RECORDING') {
      if (recCountdown > 0) {
        recTimerRef.current = setTimeout(() => {
          setRecCountdown(prev => prev - 1);
        }, 1000);
      } else {
        // Recording time over -> auto stop
        stopRecording();
      }
    }
    return () => {
      if (recTimerRef.current) clearTimeout(recTimerRef.current);
    };
  }, [step, recCountdown]);

  const resetAll = () => {
    stopPlayback();
    if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    
    // Stop mic stream if active
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    
    setStep('IDLE');
    setPrepCountdown(prepTime);
    setRecCountdown(recordingTime);
    setRecordedUrl(null);
    setAudioStream(null);
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    if (onReset) onReset();
  };

  const startPreparation = () => {
    if (prepTime === 0) {
      // Go directly to recording
      startRecording();
    } else {
      setStep('PREPARATION');
      setPrepCountdown(prepTime);
    }
  };

  const startRecording = async () => {
    if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    playBeep();
    setStep('RECORDING');
    setRecCountdown(recordingTime);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
        setStep('COMPLETED');
        if (onCompleted) onCompleted(url);
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Microphone access denied or unavailable, using simulated recording mode.', err);
      message.info('Sử dụng ghi âm giả lập do không kết nối được micrô.');
      // Simulated recording fallback
      setStep('RECORDING');
      // Wait for countdown to finish naturally or user click Stop
    }
  };

  const stopRecording = () => {
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    playBeep();
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Handle fallback mode completion
      setStep('COMPLETED');
      setRecordedUrl(null); // No actual audio URL
      if (onCompleted) onCompleted(null);
    }
  };

  // Playback handlers
  const togglePlayback = () => {
    if (!recordedUrl) {
      message.warning('Không có âm thanh thu âm thực tế để phát lại (chế độ giả lập).');
      return;
    }
    
    const audio = playbackAudioRef.current;
    if (!audio) return;

    if (isPlayingBack) {
      audio.pause();
      setIsPlayingBack(false);
    } else {
      audio.play().catch(e => console.log('Audio playback error', e));
      setIsPlayingBack(true);
    }
  };

  const stopPlayback = () => {
    const audio = playbackAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlayingBack(false);
  };

  useEffect(() => {
    const audio = playbackAudioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlayingBack(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [recordedUrl]);

  return (
    <CardContainer>
      {recordedUrl && (
        <audio ref={playbackAudioRef} src={recordedUrl} style={{ display: 'none' }} />
      )}

      {step === 'IDLE' && (
        <IdleWrapper>
          <MicrophoneIcon $color={statusColor}>
            <AudioFilled />
          </MicrophoneIcon>
          <StatusText>Thiết bị Ghi âm Sẵn sàng</StatusText>
          <PromptHint>
            {prepTime > 0 
              ? `Ấn nút dưới đây để bắt đầu ${prepTime} giây chuẩn bị.`
              : 'Phần thi này không có thời gian chuẩn bị. Ấn nút dưới đây để ghi âm ngay.'}
          </PromptHint>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              background: statusColor, 
              borderColor: statusColor,
              borderRadius: '2rem',
              fontWeight: 600,
              padding: '0 2.5rem',
              height: '3rem'
            }}
            onClick={startPreparation}
          >
            {prepTime > 0 ? 'Bắt đầu chuẩn bị' : 'Bắt đầu trả lời'}
          </Button>
        </IdleWrapper>
      )}

      {step === 'PREPARATION' && (
        <TimerWrapper>
          <Progress
            type="circle"
            percent={Math.round((prepCountdown / prepTime) * 100)}
            format={() => `${prepCountdown}s`}
            size={120}
            strokeColor={statusColor}
            strokeWidth={8}
          />
          <StatusText style={{ marginTop: '1.5rem', color: '#1e293b' }}>
            Thời gian chuẩn bị ý tưởng
          </StatusText>
          <PromptHint>
            Đọc kỹ đề bài và phác thảo các ý chính cần trả lời.
          </PromptHint>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              background: '#0f172a', 
              borderColor: '#0f172a',
              borderRadius: '2rem',
              fontWeight: 600,
              padding: '0 2rem'
            }}
            onClick={startRecording}
          >
            Nói ngay <CaretRightOutlined />
          </Button>
        </TimerWrapper>
      )}

      {step === 'RECORDING' && (
        <RecordingWrapper>
          <RecordingBadge $color={statusColor}>
            <span className="dot" /> Đang ghi âm bài nói
          </RecordingBadge>

          <Progress
            type="circle"
            percent={Math.round((recCountdown / recordingTime) * 100)}
            format={() => `${recCountdown}s`}
            size={110}
            strokeColor="#ef4444"
            strokeWidth={8}
          />

          <AudioWaveform isRecording={true} audioStream={audioStream} />

          <Button 
            type="primary" 
            danger
            size="large"
            icon={<CheckCircleOutlined />}
            style={{ 
              borderRadius: '2rem',
              fontWeight: 600,
              padding: '0 2.5rem',
              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
            }}
            onClick={stopRecording}
          >
            Hoàn thành nói
          </Button>
        </RecordingWrapper>
      )}

      {step === 'COMPLETED' && (
        <CompletedWrapper>
          <StatusText style={{ color: '#16a34a' }}>
            ✓ Đã hoàn thành ghi âm
          </StatusText>
          <PromptHint>
            {recordedUrl 
              ? 'Nhấn nút Play để nghe lại câu trả lời của bạn, hoặc chọn Ghi âm lại.'
              : 'Ghi âm giả lập thành công (Chế độ demo không thu micrô).'}
          </PromptHint>

          <AudioWaveform isRecording={false} />

          <Space size="large" style={{ marginTop: '1rem' }}>
            {recordedUrl && (
              <PlaybackButton onClick={togglePlayback} $color={statusColor}>
                {isPlayingBack ? <PauseCircleFilled /> : <PlayCircleFilled />}
                <span>{isPlayingBack ? 'Tạm dừng' : 'Nghe lại bài nói'}</span>
              </PlaybackButton>
            )}

            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetAll}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600 }}
            >
              Ghi âm lại
            </Button>
          </Space>
        </CompletedWrapper>
      )}
    </CardContainer>
  );
};

// Styled components
const CardContainer = styled.div`
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

const IdleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const pulse = keyframes`
  0% {
    transform: scale(0.92);
    box-shadow: 0 0 0 0 rgba(59, 91, 140, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(59, 91, 140, 0);
  }
  100% {
    transform: scale(0.92);
    box-shadow: 0 0 0 0 rgba(59, 91, 140, 0);
  }
`;

const MicrophoneIcon = styled.div<{ $color: string }>`
  font-size: 2.5rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: white;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s infinite;
`;

const StatusText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
  margin: 0 0 0.5rem 0;
`;

const PromptHint = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  margin: 0 0 1.5rem 0;
  max-width: 300px;
  line-height: 1.5;
`;

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const RecordingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const RecordingBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ef4444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;

  .dot {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    animation: ${blink} 1s infinite;
  }
`;

const CompletedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const PlaybackButton = styled.button<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid ${props => props.$color};
  color: ${props => props.$color};
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  .anticon {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${props => props.$color}10;
    transform: translateY(-1px);
  }
`;
