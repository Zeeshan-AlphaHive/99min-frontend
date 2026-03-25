export const getVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    // First, wait for metadata so we know duration
    video.onloadedmetadata = () => {
      // Seek to 1s or halfway if video is short
      video.currentTime = Math.min(1, video.duration / 2);
    };

    // Fire AFTER the seek completes
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg'));
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('');
    };
  });
};