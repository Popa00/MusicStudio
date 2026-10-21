"""Analizza i WAV esportati: misure, controlli, spettrogrammi, rapporto.

Uso: python -I analyze.py <cartella out> <baseline.json> [--update-baseline]
Codice di uscita 1 se ci sono ERRORI (non per i semplici avvisi).
"""
import json
import sys
from pathlib import Path

# Con -I (modalità isolata) la cartella dello script non è nel percorso: la aggiungiamo noi.
sys.path.insert(0, str(Path(__file__).resolve().parent))

import checks  # noqa: E402
import plots  # noqa: E402
import report  # noqa: E402
from metrics import measure  # noqa: E402


def main(out_dir: Path, baseline_path: Path, update_baseline: bool) -> int:
    scenarios = json.loads((out_dir / "scenarios.json").read_text(encoding="utf-8"))
    wav_dir = out_dir / "wav"
    results = []
    for s in scenarios:
        metrics = measure(wav_dir / f"{s['name']}.wav")
        expect = dict(s["expect"], balance=s["category"] == "bilanciamento")
        results.append({**s, "metrics": metrics, "issues": checks.check_scenario(metrics, expect)})
    group_issues = checks.check_groups(results)

    baseline = json.loads(baseline_path.read_text(encoding="utf-8")) if baseline_path.exists() else {}
    changes = {r["description"]: c for r in results if r["name"] in baseline and (c := checks.compare(r["metrics"], baseline[r["name"]]))}

    sheets = [p for c in report.CATEGORY_TITLES if (p := plots.sheet(results, wav_dir, out_dir / f"spettrogrammi-{c}.png", c))]
    text = report.build(results, group_issues, changes, sheets, bool(baseline))
    (out_dir / "report.md").write_text(text, encoding="utf-8")
    (out_dir / "metrics.json").write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")

    if update_baseline:
        merged = {**baseline, **{r["name"]: r["metrics"] for r in results}}
        baseline_path.write_text(json.dumps(merged, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"Riferimento aggiornato: {baseline_path}")

    errors = sum(1 for r in results for lvl, _ in r["issues"] if lvl == checks.ERROR) + sum(1 for lvl, _ in group_issues if lvl == checks.ERROR)
    print(f"Rapporto: {out_dir / 'report.md'} ({len(results)} suoni, {errors} errori)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1]), Path(sys.argv[2]), "--update-baseline" in sys.argv[3:]))
