"""Spettrogrammi: immagini delle frequenze nel tempo, raggruppate per categoria."""
import math

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from scipy.signal import spectrogram  # noqa: E402

from metrics import envelope_db, read_wav  # noqa: E402


def draw(ax, path, title, max_seconds=None):
    x, rate = read_wav(path)
    mono = x.mean(axis=1)
    freqs, times, power = spectrogram(mono, rate, nperseg=2048, noverlap=1536)
    image = 10 * np.log10(np.maximum(power, 1e-14))
    mesh = ax.pcolormesh(times, freqs, image, shading="auto", cmap="magma", vmin=-120, vmax=-30)
    ax.set_yscale("log")
    ax.set_ylim(30, rate / 2)
    ax.set_title(title, fontsize=9)
    ax.set_xlabel("secondi", fontsize=8)
    ax.set_ylabel("Hz", fontsize=8)
    ax.tick_params(labelsize=7)
    # Linea bianca: volume nel tempo (scala a destra, dB).
    env = envelope_db(mono, rate)
    twin = ax.twinx()
    twin.plot(np.arange(len(env)) * 0.01, env, color="white", linewidth=0.8)
    twin.set_ylim(-100, 0)
    twin.tick_params(labelsize=7, colors="gray")
    if max_seconds:
        ax.set_xlim(0, max_seconds)
    return mesh


def sheet(results, wav_dir, out_path, category):
    """Una sola immagine con gli spettrogrammi di tutta la categoria."""
    items = [r for r in results if r["category"] == category]
    if not items:
        return None
    cols = 2 if len(items) > 1 else 1
    rows = math.ceil(len(items) / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(7 * cols, 2.8 * rows), squeeze=False)
    for ax, r in zip(axes.flat, items):
        m = r["metrics"]
        title = f"{r['name']} · picco {m['picco_db']} dB · {m['brillantezza_hz']} Hz · coda {m['coda_s']} s"
        # Colpi singoli: si mostra solo la parte che suona, non i secondi di silenzio finale.
        crop = min(m["durata_s"], m["coda_s"] + 0.5) if r["expect"].get("singleHit") else None
        draw(ax, wav_dir / f"{r['name']}.wav", title, crop)
    for ax in list(axes.flat)[len(items):]:
        ax.axis("off")
    fig.suptitle(f"Spettrogrammi: {category} (colore = energia, linea bianca = volume)", fontsize=11)
    fig.tight_layout()
    fig.savefig(out_path, dpi=70)
    plt.close(fig)
    return out_path
