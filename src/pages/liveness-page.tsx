import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';

export function LivenessPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getByUser, updateSubmissionStatus } = useSubmissions();

  useEffect(() => {
    const start = async () => {
      if (!navigator.mediaDevices) return setCameraError('Camera not available');
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(s);
        setCameraError(null);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err: any) {
        setCameraError(err?.message || 'Unable to access camera');
      }
    };
    start();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setCaptured(true);
  };

  const handleVerify = async () => {
    if (!user) return navigate('/login');
    const submission = getByUser(user.id);
    if (!submission) return navigate('/onboarding');
    setProcessing(true);
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 1500));
    // Simulate liveness score
    const score = Math.floor(30 + Math.random() * 70);
    let status: any = 'review';
    if (score >= 75) status = 'approved';
    else if (score < 50) status = 'rejected';
    else status = 'review';

    updateSubmissionStatus(submission.id, status, { livenessScore: score });
    setProcessing(false);
    navigate('/status');
  };

  return (
    <main className="px-4 md:px-10 max-w-[900px] mx-auto w-full py-12">
      <h1 className="text-2xl font-bold mb-4">Liveness Check</h1>
      <p className="text-sm text-muted mb-6">Please follow the on-screen prompts and capture a brief selfie.</p>

      <div className="bg-white rounded-xl p-6 shadow-md">
        {cameraError ? (
          <div className="p-6">
            <div className="text-red-600 font-semibold mb-2">Camera Error</div>
            <div className="text-sm text-muted mb-4">{cameraError}</div>
            <div className="flex gap-2">
              <button onClick={() => { setCameraError(null); navigator.mediaDevices?.getUserMedia?.({ video: true }).then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s; }).catch((e) => setCameraError(e?.message || 'Permission denied')); }} className="px-3 py-2 bg-primary text-white rounded">Retry</button>
              <button onClick={() => navigate('/onboarding')} className="px-3 py-2 bg-surface border rounded">Back</button>
            </div>
          </div>
        ) : (
          <>
            <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCapture} className="px-4 py-2 bg-primary text-white rounded">Capture</button>
              <button onClick={handleVerify} disabled={!captured || processing} className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50">{processing ? 'Verifying...' : 'Verify Liveness'}</button>
              <button onClick={() => navigate('/onboarding')} className="px-4 py-2 bg-surface border rounded">Cancel</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default LivenessPage;
