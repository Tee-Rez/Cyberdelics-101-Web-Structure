import json
from pathlib import Path

BASE = Path("Modules")

lines = []
for manifest in sorted(BASE.glob("**/Combined-Lesson.json")):
    try:
        data = json.loads(manifest.read_text(encoding="utf-8-sig"))
    except Exception:
        data = json.loads(manifest.read_text(encoding="utf-8"))

    quiz_q = []
    scenarios = []

    def walk(node):
        if isinstance(node, list):
            for i in node:
                walk(i)
        elif isinstance(node, dict):
            t = node.get("type", "")
            if t == "quiz":
                qs = node.get("content", {}).get("questions", [])
                for q in qs:
                    correct = q.get("correctAnswer", "")
                    opts = [o.get("id", "") for o in q.get("options", [])]
                    if opts:
                        correct_idx = opts.index(correct) if correct in opts else -1
                        flag = " <-- FLAGGED" if cidx in (1, 2) else ""
                        quiz_q.append(f"  QUIZ  Q:{q.get('id','')[:50]}  correct=opt[{correct_idx}] of {len(opts)}")
            elif t == "scenario-based":
                scenes = node.get("content", {}).get("scenes", [])
                has_reflect = any(s.get("id") == "reflection" for s in scenes)
                scenarios.append(f"  SCEN  {node.get('id','')[:40]}  has_reflection={has_reflect}")
            for v in node.values():
                walk(v)

    walk(data)

    mod_name = "/".join(manifest.parts[-5:-2])
    if quiz_q or scenarios:
        lines.append(f"\n== {mod_name} ==")
        lines.extend(quiz_q)
        lines.extend(scenarios)

Path("audit_output.txt").write_text("\n".join(lines), encoding="utf-8")
print("Done")
print("\n".join(lines))
