import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QrCode, Scan, X, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader } from '@zxing/browser';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Given a scanned QR text, determine if it's an internal app URL.
 * Returns { isInternal, path } or null if not a valid URL.
 */
const parseQRText = (text) => {
  try {
    const url = new URL(text);
    const isInternal =
      url.hostname === window.location.hostname ||
      url.hostname === 'localhost';

    return {
      isInternal,
      path: url.pathname + url.search + url.hash,
      href: url.href,
      displayText: text.length > 60 ? text.slice(0, 57) + '…' : text,
    };
  } catch {
    // Not a URL — return raw text
    return {
      isInternal: false,
      path: null,
      href: null,
      displayText: text.length > 60 ? text.slice(0, 57) + '…' : text,
    };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export const QuickScanReport = ({ onQRDetected }) => {
  const [showModal, setShowModal] = useState(false);
  const [scanState, setScanState] = useState('idle'); // idle | requesting | scanning | detected | error
  const [scannedResult, setScannedResult] = useState(null); // { isInternal, path, href, displayText }
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null); // ZXing stream controls

  const navigate = useNavigate();

  // ── Stop camera stream ─────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      try { controlsRef.current.stop(); } catch { /* ignore */ }
      controlsRef.current = null;
    }
  }, []);

  // ── Start camera + QR decode loop ─────────────────────────────────────────
  const startScanner = useCallback(async () => {
    setScanState('requesting');
    setErrorMessage('');

    try {
      // Request camera permission explicitly first for a better UX message
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch {
      setScanState('error');
      setErrorMessage('Camera access denied. Please allow camera permission and try again.');
      return;
    }

    setScanState('scanning');

    try {
      readerRef.current = new BrowserQRCodeReader();
      controlsRef.current = await readerRef.current.decodeFromVideoDevice(
        undefined, // use default (back) camera
        videoRef.current,
        (result, error) => {
          if (result) {
            stopCamera();
            const parsed = parseQRText(result.getText());
            setScannedResult(parsed);
            setScanState('detected');
          }
          // Suppress NotFoundException (no QR in frame yet — normal during scanning)
        }
      );
    } catch (err) {
      setScanState('error');
      setErrorMessage('Could not start camera. Please try again.');
    }
  }, [stopCamera]);

  // ── Modal open/close ───────────────────────────────────────────────────────
  const openModal = () => {
    setScannedResult(null);
    setScanState('idle');
    setErrorMessage('');
    setShowModal(true);
  };

  const closeModal = useCallback(() => {
    stopCamera();
    setShowModal(false);
    setScanState('idle');
    setScannedResult(null);
  }, [stopCamera]);

  const handleRetry = () => {
    stopCamera();
    setScannedResult(null);
    startScanner();
  };

  // Auto-start scanner when modal opens
  useEffect(() => {
    if (showModal) {
      startScanner();
    }
    return () => stopCamera();
  }, [showModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Handle result actions ──────────────────────────────────────────────────

  /** Navigate to internal app URL (e.g. /report?eq=X&id=Y) */
  const handleGoToLink = () => {
    if (!scannedResult) return;

    if (scannedResult.isInternal && scannedResult.path) {
      closeModal();
      navigate(scannedResult.path);
    } else if (scannedResult.href) {
      window.open(scannedResult.href, '_blank', 'noopener,noreferrer');
    }
  };

  /** If QR is an internal report URL, parse params and prefill form directly */
  const handleUseForReport = () => {
    if (!scannedResult?.path) return;

    try {
      const params = new URLSearchParams(scannedResult.path.split('?')[1] ?? '');
      const equipmentId = params.get('id');
      const equipmentCode = params.get('eq');

      if (equipmentId || equipmentCode) {
        // Navigate to report page with QR params → useReportForm will auto-prefill
        closeModal();
        navigate(`/report?${params.toString()}`);
        return;
      }
    } catch { /* fall through */ }

    // Fallback: just go to the link
    handleGoToLink();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Trigger card ── */}
      <div className="dashboard-card p-[1.5rem] mb-[2rem] flex flex-col sm:flex-row items-center justify-between rounded-[2rem] gap-[1rem]">
        <div className="flex items-center gap-[1rem]">
          <div className="w-[3rem] h-[3rem] bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[1rem] flex items-center justify-center shrink-0">
            <Scan className="text-[#1E2B58] dark:text-slate-300 w-[1.5rem] h-[1.5rem]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-[#1E2B58] dark:text-white">Quick Scan Report</h3>
            <p className="text-[0.75rem] text-slate-500 dark:text-slate-400">Scan QR code on equipment to report instantly</p>
          </div>
        </div>
        <button
          onClick={openModal}
          className="bg-[#1E2B58] text-white px-[1.5rem] py-[0.625rem] rounded-xl font-bold text-[0.875rem] flex items-center gap-[0.5rem] transition-all hover:bg-[#1E2B58]/90 hover:scale-105 active:scale-95 whitespace-nowrap shadow-md"
        >
          <QrCode className="w-[1.125rem] h-[1.125rem]" strokeWidth={2.5} />
          Scan QR Code
        </button>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="dashboard-card rounded-[2rem] p-8 w-full max-w-sm shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Quick Scan</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white mb-6">
              {scanState === 'requesting' && 'Requesting Camera…'}
              {scanState === 'scanning'   && 'Point at QR Code'}
              {scanState === 'detected'   && 'QR Code Detected'}
              {scanState === 'error'      && 'Scan Failed'}
              {scanState === 'idle'       && 'Starting…'}
            </h3>

            {/* Camera viewport / state display */}
            <div className="relative w-full aspect-square max-w-[14rem] mx-auto mb-6 rounded-[1.5rem] bg-[#1E2B58]/5 dark:bg-slate-800/60 border-2 border-[#1E2B58]/10 dark:border-white/10 overflow-hidden flex items-center justify-center">

              {/* Live camera feed — always rendered so ref is available */}
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover ${scanState === 'scanning' ? 'opacity-100' : 'opacity-0'}`}
                muted
                playsInline
              />

              {/* Corner brackets overlay (shown while scanning) */}
              {scanState === 'scanning' && (
                <>
                  {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 right-3 rotate-180', 'bottom-3 left-3 -rotate-90'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 border-t-2 border-l-2 border-white rounded-tl z-10`} />
                  ))}
                  {/* Scan line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent z-10"
                    style={{ animation: 'scanDown 1.5s ease-in-out infinite' }}
                  />
                  <style>{`@keyframes scanDown { 0%{top:10%} 50%{top:85%} 100%{top:10%} }`}</style>
                </>
              )}

              {/* Requesting camera */}
              {(scanState === 'requesting' || scanState === 'idle') && (
                <div className="flex flex-col items-center gap-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E2B58]/20 border-t-[#1E2B58] dark:border-white/20 dark:border-t-white" />
                  <p className="text-[0.625rem] font-bold text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest">
                    {scanState === 'requesting' ? 'Requesting…' : 'Starting…'}
                  </p>
                </div>
              )}

              {/* Success */}
              {scanState === 'detected' && (
                <div className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
              )}

              {/* Error */}
              {scanState === 'error' && (
                <div className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Scanned result info */}
            {scanState === 'detected' && scannedResult && (
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-5 space-y-2">
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
                  {scannedResult.href ? 'Link detected' : 'Text detected'}
                </p>
                <p className="text-xs font-semibold text-[#1E2B58] dark:text-white break-all">
                  {scannedResult.displayText}
                </p>
                {scannedResult.isInternal && (
                  <span className="inline-flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Internal link
                  </span>
                )}
                {scannedResult.href && !scannedResult.isInternal && (
                  <span className="inline-flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-sky-500">
                    <ExternalLink className="w-3 h-3" /> External link
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={scanState === 'scanning' ? closeModal : handleRetry}
                className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {scanState === 'scanning' ? 'Cancel' : 'Retry'}
              </button>

              {scanState === 'detected' && scannedResult?.href && (
                <button
                  onClick={handleGoToLink}
                  className="flex-[2] py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
                >
                  {scannedResult.isInternal
                    ? <><Scan className="w-4 h-4" /> Open</>
                    : <><ExternalLink className="w-4 h-4" /> Open Link</>
                  }
                </button>
              )}

              {scanState === 'detected' && !scannedResult?.href && (
                <button
                  onClick={closeModal}
                  className="flex-[2] py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#1E2B58]/90 transition-all shadow-lg shadow-[#1E2B58]/20"
                >
                  Done
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
