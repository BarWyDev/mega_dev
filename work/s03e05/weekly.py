import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime, date
rows = list(csv.DictReader(open(sys.argv[1])))
def wk(n):
    d = date.fromisoformat(n)
    return 1 if d <= date(2026,10,21) else 2
inc = defaultdict(set); restarts = Counter()
for r in rows:
    k=(r["site_id"], r["night"], r["arm"], wk(r["night"]))
    if r["event"]=="incident_opened": inc[k].add(r["incident_id"])
    if r["event"]=="restart": restarts[k]+=1
for w in (1,2):
    out=[]
    for arm in ("control","flag"):
        bad=[k for k,v in inc.items() if k[2]==arm and k[3]==w and len(v)>=3]
        tr=sum(restarts[k] for k in bad)
        out.append((arm,len(bad),tr,tr/len(bad)))
    c,f=out
    print(f"week{w}: control {c[3]:.3f} (n={c[1]}) | flag {f[3]:.3f} (n={f[1]}) | delta {100*(f[3]-c[3])/c[3]:+.1f}%")
# per night
print()
for night in sorted({r["night"] for r in rows}):
    vals={}
    for arm in ("control","flag"):
        bad=[k for k,v in inc.items() if k[1]==night and k[2]==arm and len(v)>=3]
        tr=sum(restarts[k] for k in bad)
        vals[arm]=(len(bad), tr/len(bad) if bad else float('nan'))
    c=vals["control"]; f=vals["flag"]
    d = 100*(f[1]-c[1])/c[1] if c[1]==c[1] and c[1] else float('nan')
    print(f"{night}  control {c[1]:.2f} (n={c[0]:>3})   flag {f[1]:.2f} (n={f[0]:>3})   {d:+.0f}%")
