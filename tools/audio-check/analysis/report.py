"""Rapporto in Markdown, leggibile anche da chi non è esperto di audio."""

CATEGORY_TITLES = {
    "batteria": "Batteria (un colpo per suono)",
    "strumenti": "Strumenti (preset del sintetizzatore)",
    "effetti": "Effetti",
    "brani": "Brani completi",
    "bilanciamento": "Bilanciamento (ogni traccia da sola)",
}


def fmt(value, unit=""):
    return "–" if value is None else f"{value}{unit}"


def table(items):
    lines = [
        "| Suono | Picco | LUFS | Brillantezza | Coda | Esito |",
        "|---|---|---|---|---|---|",
    ]
    for r in items:
        m = r["metrics"]
        esito = "; ".join(f"**{level}**: {text}" for level, text in r["issues"]) or "ok"
        lines.append(
            f"| {r['description']} | {fmt(m['picco_db'], ' dB')} | {fmt(m['lufs'])} | "
            f"{fmt(m['brillantezza_hz'], ' Hz')} | {fmt(m['coda_s'], ' s')} | {esito} |"
        )
    return "\n".join(lines)


def build(results, group_issues, changes, sheets, has_baseline):
    errors = sum(1 for r in results for level, _ in r["issues"] if level == "ERRORE")
    errors += sum(1 for level, _ in group_issues if level == "ERRORE")
    warnings = sum(1 for r in results for level, _ in r["issues"] if level == "ATTENZIONE")
    warnings += sum(1 for level, _ in group_issues if level == "ATTENZIONE")
    out = [
        "# Controllo qualità del suono",
        "",
        f"**{len(results)} suoni analizzati · {errors} errori · {warnings} avvisi**",
        "",
        "Legenda: *picco* = punto più forte (max -1 dB); *LUFS* = volume percepito (musica tipica: da -16 a -10);",
        "*brillantezza* = baricentro delle frequenze (più alto = più acuto); *coda* = tempo per spegnersi di 60 dB.",
        "",
    ]
    if group_issues:
        out += ["## Confronti tra suoni", ""] + [f"- **{lvl}**: {txt}" for lvl, txt in group_issues] + [""]
    for category, title in CATEGORY_TITLES.items():
        items = [r for r in results if r["category"] == category]
        if items:
            out += [f"## {title}", "", table(items), ""]
    out += ["## Cambiamenti rispetto al riferimento", ""]
    if not has_baseline:
        out.append("Nessun riferimento salvato: esegui con `--update-baseline` quando il suono ti piace.")
    elif not changes:
        out.append("Nessun cambiamento rilevante.")
    else:
        out += [f"- {name}: {', '.join(diffs)}" for name, diffs in changes.items()]
    out += ["", "## Spettrogrammi", ""] + [f"- `{path.name}`" for path in sheets]
    return "\n".join(out) + "\n"
