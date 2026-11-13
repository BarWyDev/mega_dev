import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime
rows=list(csv.DictReader(open(sys.argv[1])))
byinc=defaultdict(list)
for r in rows:
    r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
    byinc[r["incident_id"]].append(r)
for k in byinc: byinc[k].sort(key=lambda r:r["t"])

# outcome classes in flag arm
cls=Counter(); restarts_by=defaultdict(list); ttr_by=defaultdict(list)
lag=defaultdict(list)
for iid,evs in byinc.items():
    arm=evs[0]["arm"]
    names=[e["event"] for e in evs]
    acc = "suggestion_accepted" in names
    dis = "suggestion_dismissed" in names
    shown = "suggestion_shown" in names
    k=(arm, "accepted" if acc else "dismissed" if dis else "shown-only" if shown else "no-suggestion")
    cls[k]+=1
    nr=sum(1 for n in names if n=="restart")
    restarts_by[k].append(nr)
    t0=evs[0]["t"]
    res=[e["t"] for e in evs if e["event"]=="incident_resolved"]
    if res: ttr_by[k].append((min(res)-t0).total_seconds()/60)
    if shown and (acc or dis):
        ts=[e["t"] for e in evs if e["event"]=="suggestion_shown"][0]
        ta=[e["t"] for e in evs if e["event"] in ("suggestion_accepted","suggestion_dismissed")][0]
        lag[k].append((ta-ts).total_seconds()/60)
print(f"{'arm/class':30} {'n':>5} {'restarts/inc':>13} {'median ttr':>11} {'median lag':>11}")
for k in sorted(cls):
    r=restarts_by[k]; t=ttr_by[k]; l=lag.get(k,[])
    print(f"{k[0]+'/'+k[1]:30} {cls[k]:>5} {sum(r)/len(r):>13.3f} {st.median(t):>11.2f} {(st.median(l) if l else float('nan')):>11.2f}")

# detail of suggestion_shown in flag vs control
print()
d=Counter()
for r in rows:
    if r["event"] in ("suggestion_shown","suggestion_accepted","suggestion_dismissed"):
        d[(r["arm"],r["event"],r["detail"])]+=1
for k in sorted(d): print(k, d[k])
