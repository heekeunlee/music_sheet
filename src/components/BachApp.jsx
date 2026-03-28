import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const PRELUDE_NOTES = [
  // M1
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  { note: 'B3', string: 'D', pos: 4, piano: 'B3', label: '시' },
  { note: 'A3', string: 'D', pos: 1, piano: 'A3', label: '라' },
  { note: 'B3', string: 'D', pos: 4, piano: 'B3', label: '시' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  // M1 repeat
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  { note: 'B3', string: 'D', pos: 4, piano: 'B3', label: '시' },
  { note: 'A3', string: 'D', pos: 1, piano: 'A3', label: '라' },
  { note: 'B3', string: 'D', pos: 4, piano: 'B3', label: '시' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'D3', string: 'D', pos: 0, piano: 'D3', label: '레' },
  // M2
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
  { note: 'C4', string: 'A', pos: 2, piano: 'C4', label: '도' },
  { note: 'B3', string: 'A', pos: 1, piano: 'B3', label: '시' },
  { note: 'C4', string: 'A', pos: 2, piano: 'C4', label: '도' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
  // M2 repeat
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
  { note: 'C4', string: 'A', pos: 2, piano: 'C4', label: '도' },
  { note: 'B3', string: 'A', pos: 1, piano: 'B3', label: '시' },
  { note: 'C4', string: 'A', pos: 2, piano: 'C4', label: '도' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
  { note: 'G2', string: 'G', pos: 0, piano: 'G2', label: '솔' },
  { note: 'E3', string: 'D', pos: 1, piano: 'E3', label: '미' },
];

const PIANO_KEYS = [
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
];

export default function BachApp() {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [bpm, setBpm] = useState(60);
  const [userScore, setUserScore] = useState(null);
  const synth = useRef(null);

  useEffect(() => {
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.current.set({ envelope: { attack: 0.05, release: 1 } });
  }, []);

  const handlePlay = async () => {
    if (Tone.context.state !== 'running') await Tone.start();
    if (playing) {
      Tone.Transport.stop(); Tone.Transport.cancel();
      setPlaying(false); setCurrentIndex(-1);
      return;
    }
    setPlaying(true);
    Tone.Transport.bpm.value = bpm;
    const seq = new Tone.Sequence((time, noteData) => {
      synth.current.triggerAttackRelease(noteData.note, '16n', time);
      Tone.Draw.schedule(() => setCurrentIndex(prev => (prev + 1) % PRELUDE_NOTES.length), time);
    }, PRELUDE_NOTES, "16n");
    seq.start(0);
    Tone.Transport.start();
  };

  const current = currentIndex >= 0 ? PRELUDE_NOTES[currentIndex] : null;

  return (
    <div className="bach-app-container">
      <div className="header"><h1>BACH MASTER v2</h1></div>

      <div className="control-panel">
        <button className="play-button" onClick={handlePlay}>{playing ? 'STOP' : 'PLAY'}</button>
        <input type="range" min="30" max="100" value={bpm} onChange={e => setBpm(e.target.value)} />
        <span>{bpm} BPM</span>
      </div>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={e => setUserScore(URL.createObjectURL(e.target.files[0]))} />
        {userScore && <img src={userScore} className="score-preview" alt="User Score" />}
      </div>

      <div className="viz-layer">
        <span className="section-label">Cello Guide (With Tapes)</span>
        <div className="cello-fingerboard">
          {[12, 22, 33, 38].map((l, i) => (
            <div key={i} className="tape" style={{ left: `${l}%` }}><span className="tape-label">{i+1}</span></div>
          ))}
          {['A', 'D', 'G', 'C'].map(s => (
            <div key={s} className="string">
              {current?.string === s && <div className="note-marker" style={{ left: `${current.pos === 0 ? 0 : current.pos === 1 ? 12 : current.pos === 3 ? 33 : 38}%` }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="viz-layer">
        <span className="section-label">Piano Keyboard</span>
        <div className="piano-keyboard">
          {PIANO_KEYS.map(k => (
            <div key={k} className={`key ${k.includes('#') ? 'black-key' : 'white-key'} ${current?.piano === k ? 'active' : ''}`} />
          ))}
        </div>
      </div>
      
      <p>{current ? `현 위치: ${current.string}현 ${current.pos === 0 ? '개방현' : current.pos + '번 손가락'}` : '연습을 시작하려면 PLAY를 누르세요.'}</p>
    </div>
  );
}
