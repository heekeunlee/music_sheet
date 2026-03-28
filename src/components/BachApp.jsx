import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const PRELUDE_NOTES = [
  { time: '0:0:0', note: 'G2', dur: '16n', string: 'G', pos: 0, finger: 0 },
  { time: '0:0:1', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },
  { time: '0:0:2', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:0:3', note: 'A3', dur: '16n', string: 'D', pos: 45, finger: 1 },
  { time: '0:1:0', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:1:1', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },
  { time: '0:1:2', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:1:3', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },

  { time: '0:2:0', note: 'G2', dur: '16n', string: 'G', pos: 0, finger: 0 },
  { time: '0:2:1', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },
  { time: '0:2:2', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:2:3', note: 'A3', dur: '16n', string: 'D', pos: 45, finger: 1 },
  { time: '0:3:0', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:3:1', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },
  { time: '0:3:2', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '0:3:3', note: 'D3', dur: '16n', string: 'D', pos: 0, finger: 0 },

  { time: '1:0:0', note: 'G2', dur: '16n', string: 'G', pos: 0, finger: 0 },
  { time: '1:0:1', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
  { time: '1:0:2', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:0:3', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '1:1:0', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:1:1', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
  { time: '1:1:2', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:1:3', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
  { time: '1:2:0', note: 'G2', dur: '16n', string: 'G', pos: 0, finger: 0 },
  { time: '1:2:1', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
  { time: '1:2:2', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:2:3', note: 'B3', dur: '16n', string: 'D', pos: 60, finger: 4 },
  { time: '1:3:0', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:3:1', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
  { time: '1:3:2', note: 'C4', dur: '16n', string: 'A', pos: 15, finger: 1 },
  { time: '1:3:3', note: 'E3', dur: '16n', string: 'A', pos: 0, finger: 0 },
];

const STRINGS = ['A', 'D', 'G', 'C'];
const TAPES = [
  { id: 1, pos: 15 },
  { id: 3, pos: 45 },
  { id: 4, pos: 60 }
];

const PIANO_KEYS = [
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'
];

export default function BachApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [currentNote, setCurrentNote] = useState(null);
  const [sheetImage, setSheetImage] = useState(null);
  const [instrument, setInstrument] = useState('cello');
  const [isSplash, setIsSplash] = useState(true);
  
  const samplerRef = useRef(null);
  const pianoRef = useRef(null);

  useEffect(() => {
    // Realistic Cello Sampler
    samplerRef.current = new Tone.Sampler({
      urls: {
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "G3": "G3.mp3",
        "D4": "D4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => console.log("Cello loaded")
    }).toDestination();

    // Realistic Piano Sampler
    pianoRef.current = new Tone.Sampler({
      urls: {
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "G3": "G3.mp3",
        "A3": "A3.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/casio/",
      onload: () => console.log("Piano loaded")
    }).toDestination();

    setTimeout(() => setIsSplash(false), 2500);

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const handlePlay = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
      setCurrentNote(null);
      return;
    }

    await Tone.start();
    setIsPlaying(true);

    const part = new Tone.Part((time, value) => {
      const activeSampler = instrument === 'cello' ? samplerRef.current : pianoRef.current;
      activeSampler.triggerAttackRelease(value.note, value.dur, time);
      Tone.Draw.schedule(() => {
        setCurrentNote(value);
      }, time);
    }, PRELUDE_NOTES);

    part.loop = true;
    part.loopEnd = '2:0:0';
    part.start(0);
    Tone.Transport.start();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSheetImage(URL.createObjectURL(file));
  };

  return (
    <div className="app-root">
      {/* Splash Screen */}
      <div className={`splash-screen ${!isSplash ? 'hidden' : ''}`}>
        <h1 className="splash-title">Bach Bridge</h1>
        <p className="splash-subtitle">Cello & Piano Smart Tutor</p>
      </div>

      <div className="app-container">
        <header className="header">
          <h1>BACH BRIDGE</h1>
          <div className="controls-card">
            <div className="control-row">
              <button className="btn-main" onClick={handlePlay}>
                {isPlaying ? 'STOP' : 'PLAY'}
              </button>
              <div className="tempo-box">
                <input 
                  type="range" min="30" max="120" value={bpm} 
                  onChange={(e) => setBpm(e.target.value)} 
                />
                <span style={{marginLeft: '10px'}}>{bpm} BPM</span>
              </div>
              
              <div className="instrument-selector">
                <button 
                  className={`inst-btn ${instrument === 'cello' ? 'active' : ''}`}
                  onClick={() => setInstrument('cello')}
                >
                  🎻 CELLO
                </button>
                <button 
                  className={`inst-btn ${instrument === 'piano' ? 'active' : ''}`}
                  onClick={() => setInstrument('piano')}
                >
                  🎹 PIANO
                </button>
              </div>
            </div>

            <div className="upload-box">
              <input type="file" onChange={handleFileChange} id="sheet-upload" style={{display:'none'}} />
              <label htmlFor="sheet-upload" className="btn-main" style={{display:'inline-block', fontSize:'0.8rem'}}>
                ADD SHEET PHOTO
              </label>
            </div>
          </div>
        </header>

        {sheetImage && (
          <div className="sheet-preview" style={{marginBottom: '40px'}}>
            <img src={sheetImage} alt="Sheet" style={{maxWidth:'100%', borderRadius:'10px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}} />
          </div>
        )}

        <div className="visualizer-grid">
          <section className="guide-section">
            <span className="guide-label">Cello Fingerboard (With Tapes)</span>
            <div className="cello-board">
              {STRINGS.map(s => (
                <div key={s} className="string">
                  {currentNote && currentNote.string === s && (
                    <div 
                      className="note-marker" 
                      style={{ left: `${currentNote.pos}%` }}
                    />
                  )}
                </div>
              ))}
              {TAPES.map(t => (
                <div key={t.id} className="tape" style={{left: `${t.pos}%`}}>
                  <span className="tape-num">{t.id}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="guide-section">
            <span className="guide-label">Piano Keyboard</span>
            <div className="piano-board">
              {PIANO_KEYS.map(k => (
                <div 
                  key={k} 
                  className={`key ${k.includes('#') ? 'black' : ''} ${currentNote?.note === k ? 'active' : ''}`} 
                />
              ))}
            </div>
          </section>
        </div>

        {currentNote && (
          <div className="status-text">
            Playing: <span style={{color:'var(--gold)'}}>{currentNote.note}</span> ({currentNote.string} String, Finger {currentNote.finger})
          </div>
        )}
      </div>
    </div>
  );
}
