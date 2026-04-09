export const playBeep = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 1200;
  gainNode.gain.value = 1;

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 150);
};
