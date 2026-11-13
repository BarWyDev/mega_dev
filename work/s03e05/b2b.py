import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime, timedelta
rows=list(csv.DictReader(open(sys.argv[1])))
for r in rows: r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
inc=defaultdict(list)
for r in rows: inc[r["incident_id"]].append(r)
for k in inc: inc[k].sort(key=lambda r:r["t"])
print("the two replay incidents:")
for i in ("inc-63018","inc-65873"):
    for e in inc.get(i,[]): print("  ",e["event_id"],e["ts"],e["site_id"],e["arm"],e["event"],e["detail"])
    if not inc.get(i): print("  ",i,"NOT in this file")
print()
ac=[i for i,e in inc.items() if any(x["event"]=="incident_auto_closed" for x in e)]
print("auto-closed incidents:",len(ac))
after=Counter()
for i in ac:
    evs=inc[i]
    j=[k for k,x in enumerate(evs) if x["event"]=="incident_auto_closed"][0]
    tail=tuple(x["event"] for x in evs[j+1:])
    after[tail]+=1
for k,v in after.most_common(): print("  after auto-close:",k or "(nothing)",v)
print()
# open at 06:00 counting auto-close as NOT an end
tot=Counter(); o1=Counter(); o2=Counter()
for i,evs in inc.items():
    arm=evs[0]["arm"]; tot[arm]+=1
    night=datetime.fromisoformat(evs[0]["night"]+"T00:00:00+00:00"); cut=night+timedelta(days=1,hours=6)
    ends_any=[e["t"] for e in evs if e["event"] in ("incident_resolved","incident_auto_closed")]
    ends_real=[e["t"] for e in evs if e["event"]=="incident_resolved"]
    if not ends_any or min(ends_any)>cut: o1[arm]+=1
    if not ends_real or min(ends_real)>cut: o2[arm]+=1
for arm in ("control","flag"):
    print(f"{arm:8} n={tot[arm]} open@06 as-measured={o1[arm]} ({100*o1[arm]/tot[arm]:.2f}%)  open@06 if auto-close not an end={o2[arm]} ({100*o2[arm]/tot[arm]:.2f}%)")
r1=(o1['flag']/tot['flag'])/(o1['control']/tot['control'])-1
r2=(o2['flag']/tot['flag'])/(o2['control']/tot['control'])-1
print(f"as measured: {100*r1:+.1f}%   if auto-close is not an end: {100*r2:+.1f}%")
