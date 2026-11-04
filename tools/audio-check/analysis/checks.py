"""Regole di qualità: trasformano le misure in segnalazioni comprensibili."""
import statistics

ERROR, WARNING = "ERRORE", "ATTENZIONE"

# Volume percepito tipico della musica (LUFS): sotto è troppo basso, sopra satura.
MIX_LUFS_MIN, MIX_LUFS_MAX = -24.0, -8.0



def check_scenario(m, expect):
    """Segnalazioni per un singolo suono."""
    issues = []
    if m["picco_db"] < -60:
        issues.append((ERROR, "nessun suono (silenzio)"))
        return issues
    if m["saturazione_pct"] > 0.1:
        issues.append((WARNING, f"saturazione: {m['saturazione_pct']}% dei campioni al limite (suono distorto)"))
    if m["picco_reale_db"] > -0.3:
        issues.append((WARNING, f"picco a {m['picco_reale_db']} dB: troppo vicino al massimo"))
    if abs(m["dc"]) > 0.01:
        issues.append((WARNING, f"spostamento DC {m['dc']}: il suono è sbilanciato (spreca volume, può fare 'click')"))
    # Nei brani completi qualcosa suona sempre: un buco lungo indica uno strumento o effetto bloccato.
    if expect.get("mix") and not expect.get("balance") and m["silenzio_piu_lungo_s"] >= 1.0:
        issues.append((ERROR, f"{m['silenzio_piu_lungo_s']} s di silenzio improvviso nel mezzo: un effetto o strumento si è bloccato"))
    if m["correlazione_stereo"] < 0:
        issues.append((WARNING, "canali sinistro/destro in opposizione: in mono il suono si annulla"))
    if expect.get("singleHit") and m["fine_db"] > -60:
        issues.append((WARNING, f"la coda non si spegne entro la fine ({m['fine_db']} dB): eco o riverbero che non finisce"))
    lo, hi = expect.get("centroidMinHz"), expect.get("centroidMaxHz")
    if lo and m["brillantezza_hz"] < lo:
        issues.append((WARNING, f"timbro più cupo del previsto ({m['brillantezza_hz']} Hz, atteso ≥ {lo})"))
    if hi and m["brillantezza_hz"] > hi:
        issues.append((WARNING, f"timbro più brillante del previsto ({m['brillantezza_hz']} Hz, atteso ≤ {hi})"))
    if expect.get("mix") and m["lufs"] is not None and not expect.get("balance"):
        if m["lufs"] < MIX_LUFS_MIN:
            issues.append((WARNING, f"volume percepito basso ({m['lufs']} LUFS, tipico: da -16 a -10)"))
        if m["lufs"] > MIX_LUFS_MAX:
            issues.append((WARNING, f"volume percepito molto alto ({m['lufs']} LUFS): rischio di distorsione"))
    return issues


def check_groups(results):
    """Segnalazioni che confrontano più suoni tra loro."""
    issues = []
    reverbs = sorted((r for r in results if r["name"].startswith("effetto-riverbero")), key=lambda r: int(r["name"].split("-")[-1][:-1]))
    tails = [r["metrics"]["coda_s"] for r in reverbs]
    if len(tails) >= 2 and any(b <= a for a, b in zip(tails, tails[1:])):
        issues.append((WARNING, f"riverbero: la coda non si allunga con la durata impostata ({tails} s)"))
    issues += spread(results, "bilanciamento", "lufs", BALANCE_MAX_DB, "rispetto alle altre tracce")
    issues += spread(results, "batteria", "picco_db", DRUM_SPREAD_DB, "rispetto agli altri suoni della batteria")
    issues += spread(results, "strumenti", "lufs", PRESET_SPREAD_DB, "rispetto agli altri preset (cambiando preset il volume salta)")
    return issues


BALANCE_MAX_DB, DRUM_SPREAD_DB, PRESET_SPREAD_DB = 6.0, 12.0, 8.0


def spread(results, category, key, max_db, context):
    """Segnala i suoni di una categoria molto più forti o più deboli della mediana."""
    # Gli scenari "-piano" sono suonati piano apposta: non vanno confrontati con il volume normale.
    items = [r for r in results if r["category"] == category and not r["name"].endswith("-piano") and r["metrics"][key] is not None]
    if len(items) < 2:
        return []
    median = statistics.median(r["metrics"][key] for r in items)
    issues = []
    for r in items:
        diff = r["metrics"][key] - median
        if abs(diff) > max_db:
            verb = "copre gli altri" if diff > 0 else "si sente poco"
            issues.append((WARNING, f"{r['description']}: {diff:+.1f} dB {context}, {verb}"))
    return issues


TOLERANCES = {"lufs": 2.0, "rms_db": 2.0, "picco_db": 2.0, "brillantezza_hz": 0.2, "coda_s": 0.25}


def compare(metrics, previous):
    """Differenze rilevanti rispetto al riferimento salvato (cambiamenti, non per forza errori)."""
    changes = []
    for key, tol in TOLERANCES.items():
        old, new = previous.get(key), metrics.get(key)
        if old is None or new is None:
            continue
        relative = key in ("brillantezza_hz", "coda_s")
        delta = (new - old) / old if relative and old else new - old
        if abs(delta) > tol:
            changes.append(f"{key}: {old} → {new}")
    for band, old in previous.get("bande_pct", {}).items():
        new = metrics["bande_pct"].get(band, 0)
        if abs(new - old) > 15:  # il rumore della batteria è casuale: piccole variazioni sono normali
            changes.append(f"banda {band}: {old}% → {new}%")
    return changes
