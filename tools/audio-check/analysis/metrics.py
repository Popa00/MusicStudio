"""Misure oggettive di un file audio: volume, picchi, timbro, durata della coda."""
import numpy as np
import pyloudnorm
from scipy.io import wavfile
from scipy.signal import resample_poly, welch

# Bande di frequenza con nomi comprensibili (Hz).
BANDS = {
    "sub (<60)": (20, 60),
    "bassi (60-250)": (60, 250),
    "medio-bassi (250-1k)": (250, 1000),
    "medi (1k-4k)": (1000, 4000),
    "acuti (4k-10k)": (4000, 10000),
    "aria (>10k)": (10000, 20000),
}
SILENCE_DB = -90.0


def read_wav(path):
    """Restituisce (campioni float in [-1, 1] con forma (n, canali), frequenza di campionamento)."""
    rate, data = wavfile.read(path)
    x = data.astype(np.float64) / 32768.0 if data.dtype == np.int16 else data.astype(np.float64)
    return (x[:, None] if x.ndim == 1 else x), rate


def db(value):
    return float(20 * np.log10(max(value, 1e-9)))


def envelope_db(mono, rate, frame_s=0.01):
    """Volume (dB) ogni 10 ms."""
    n = max(1, int(rate * frame_s))
    frames = len(mono) // n
    if frames == 0:
        return np.array([SILENCE_DB])
    rms = np.sqrt(np.mean(mono[: frames * n].reshape(frames, n) ** 2, axis=1))
    return 20 * np.log10(np.maximum(rms, 1e-9))


def decay_seconds(env, frame_s=0.01, drop_db=60.0):
    """Tempo dal punto più forte a quando il suono resta per sempre sotto (picco - 60 dB)."""
    peak = int(np.argmax(env))
    above = np.nonzero(env[peak:] > env[peak] - drop_db)[0]
    return float((above[-1] + 1) * frame_s) if len(above) else 0.0


def longest_silence(env, frame_s=0.01):
    """Il silenzio continuo più lungo tra il primo e l'ultimo suono (un buco nel brano = qualcosa si è bloccato)."""
    active = np.nonzero(env > -50)[0]
    if len(active) == 0:
        return 0.0
    longest = run = 0
    for silent in env[active[0] : active[-1]] < SILENCE_DB + 5:
        run = run + 1 if silent else 0
        longest = max(longest, run)
    return float(longest * frame_s)


def spectrum(mono, rate):
    freqs, power = welch(mono, rate, nperseg=min(4096, len(mono)))
    total = float(np.sum(power)) or 1e-20
    centroid = float(np.sum(freqs * power) / total)
    bands = {name: round(100 * float(np.sum(power[(freqs >= lo) & (freqs < hi)])) / total, 1) for name, (lo, hi) in BANDS.items()}
    return centroid, bands


def measure(path):
    x, rate = read_wav(path)
    mono = x.mean(axis=1)
    env = envelope_db(mono, rate)
    peak = float(np.max(np.abs(x)))
    true_peak = float(np.max(np.abs(resample_poly(x, 4, 1, axis=0))))
    rms = float(np.sqrt(np.mean(x**2)))
    duration = len(x) / rate
    lufs = pyloudnorm.Meter(rate).integrated_loudness(x) if duration >= 0.5 else float("-inf")
    centroid, bands = spectrum(mono, rate)
    corr = float(np.corrcoef(x[:, 0], x[:, 1])[0, 1]) if x.shape[1] > 1 and np.std(x[:, 0]) > 0 and np.std(x[:, 1]) > 0 else 1.0
    tail = mono[-int(rate * 0.1):]
    return {
        "durata_s": round(duration, 2),
        "picco_db": round(db(peak), 1),
        "picco_reale_db": round(db(true_peak), 1),
        "rms_db": round(db(rms), 1),
        "lufs": round(float(lufs), 1) if np.isfinite(lufs) else None,
        "dinamica_db": round(db(peak) - db(rms), 1),
        "saturazione_pct": round(100 * float(np.mean(np.abs(x) >= 0.885)), 3),
        "dc": round(float(np.mean(mono)), 4),
        "brillantezza_hz": round(centroid),
        "bande_pct": bands,
        "coda_s": round(decay_seconds(env), 2),
        "fine_db": round(db(float(np.sqrt(np.mean(tail**2)))), 1),
        "silenzio_piu_lungo_s": round(longest_silence(env), 2),
        "correlazione_stereo": round(corr, 2),
    }
