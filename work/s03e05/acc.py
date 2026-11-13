import csv,sys
from collections import defaultdict
from datetime import datetime,date
rows=list(csv.DictReader(open(sys.argv[1])))
for r in rows: r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
inc=defaultdict(list)
for r in rows: inc[r["incident_id"]].append(r)
def wk(n): return 1 if date.fromisoformat(n)<=date(2026,10,21) else 2
out=defaultdict(lambda:[0,0])
for i,evs in inc.items():
    evs.sort(key=lambda r:r["t"])
    names=[e["event"] for e in evs]
    if "suggestion_accepted" not in names: continue
    arm=evs[0]["arm"]; w=wk(evs[0]["night"])
    res=[e["t"] for e in evs if e["event"]=="incident_resolved"]
    if not res: continue
    d=(min(res)-evs[0]["t"]).total_seconds()/60
    out[(arm,w)][0]+=1
    if d<=30: out[(arm,w)][1]+=1
for k in sorted(out):
    n,r=out[k]; print(f"{k} accepted={n} within30m={r} rate={r/n:.3f}")
