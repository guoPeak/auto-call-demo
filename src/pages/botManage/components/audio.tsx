import React, { useRef, useEffect } from 'react';

function RemoteAudioPlayer({ url }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const remoteAudioUrl = url; // 远程音频文件的URL
    audioRef.current.src = remoteAudioUrl;
    audioRef.current.play();
  }, []);

  return (
    <audio ref={audioRef} style={{ display: 'none' }}></audio>
  );
}

export default RemoteAudioPlayer;