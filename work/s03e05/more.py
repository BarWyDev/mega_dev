import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime, date
rows=list(csv.DictReader(open(sys.argv[1])))
for r in rows: r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
print("site-068 arm:", {r["arm"] for r in rows if r["site_id"]=="site-068"} or "not present")

def wk(n): return 1 if date.fromisoformat(n)<=date(2026,10,21) else 2
# TTR + resolved within 30m by week/arm
op={}; res=defaultdict(list)
for r in rows:
    if r["event"]=="incident_opened": op[r["incident_id"]]=(r["t"],r["arm"],wk(r["night"]))
    elif r["event"]=="incident_resolved": res[r["incident_id"]].append(r["t"])
for w in (1,2):
    for arm in ("control","flag"):
        d=[(min(res[i])-t0).total_seconds()/60 for i,(t0,a,ww) in op.items() if a==arm and ww==w and res[i]]
        print(f"week{w} {arm:8} n={len(d):4} median={st.median(d):6.2f} within30m={100*sum(1 for x in d if x<=30)/len(d):5.1f}%")
print()
# concurrent duplicate incidents at same site: same detail open at once
opened=defaultdict(list)
for r in rows:
    if r["event"]=="incident_opened": opened[r["incident_id"]]=r
closed={}
for r in rows:
    if r["event"]=="incident_resolved": closed.setdefault(r["incident_id"], r["t"])
bysite=defaultdict(list)
for i,r in opened.items():
    bysite[(r["site_id"],r["night"])].append((r["t"], closed.get(i), r["detail"], r["arm"], i))
dup=0; tot=0; dup_ids=[]
for k,v in bysite.items():
    v.sort()
    for a in range(len(v)):
        for b in range(a+1,len(v)):
            tot+=1
            if v[a][2]==v[b][2] and v[a][1] and v[b][0]<v[a][1]:
                dup+=1; dup_ids.append((k,v[a][2],v[a][4],v[b][4]))
print(f"overlapping same-cause incident pairs at one site-night: {dup} of {tot} pairs")
print("incidents involved:", len({x for d in dup_ids for x in d[2:]}), "of", len(opened))
c=Counter(d[1] for d in dup_ids); print("by detail:", dict(c))
ca=Counter(opened[d[2]]["arm"] for d in dup_ids); print("by arm:", dict(ca))
print("examples:", dup_ids[:3])
