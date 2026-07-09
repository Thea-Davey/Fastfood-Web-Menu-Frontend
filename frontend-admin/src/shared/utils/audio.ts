/**
 * Plays a simple "Ding!" notification sound using the Web Audio API.
 * This does not require any external MP3 files.
 */
export const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Creates a pleasant 'bell' or 'ding' tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime); // High pitch for attention
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);

    // Fade out quickly
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  } catch (err) {
    console.error('Audio playback failed:', err);
  }
};
