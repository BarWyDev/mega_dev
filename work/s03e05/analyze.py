import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime

path = sys.argv[1]
rows = list(csv.DictReader(open(path)))
print("rows", len(rows))

# arm consistency per site
site_arms = defaultdict(set)
for r in rows:
    site_arms[r["site_id"]].add(r["arm"])
mixed = {s:a for s,a in site_arms.items() if len(a)>1}
print("sites with >1 arm:", len(mixed))
arm_sites = Counter()
for s,a in site_arms.items():
    arm_sites[tuple(sorted(a))[0] if len(a)==1 else "mixed"] += 1
print("sites per arm:", dict(arm_sites))

# incidents per site-night
inc = defaultdict(set)
for r in rows:
    if r["event"]=="incident_opened":
        inc[(r["site_id"], r["night"], r["arm"])].add(r["incident_id"])
restarts = Counter()
for r in rows:
    if r["event"]=="restart":
        restarts[(r["site_id"], r["night"], r["arm"])] += 1

print()
for thresh in (3,):
    for arm in ("control","flag"):
        bad = [k for k,v in inc.items() if k[2]==arm and len(v)>=thresh]
        tot_r = sum(restarts[k] for k in bad)
        print(f"arm={arm} badnights={len(bad)} restarts={tot_r} per_bad_night={tot_r/len(bad):.4f}")
    # all nights for comparison
    for arm in ("control","flag"):
        allk = [k for k in inc if k[2]==arm]
        tot_r = sum(restarts[k] for k in allk)
        print(f"  [all site-nights] arm={arm} n={len(allk)} restarts={tot_r} per_night={tot_r/len(allk):.4f}")

# median time to resolve
opened = {}
resolved = defaultdict(list)
reopened = defaultdict(list)
for r in rows:
    t = datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
    if r["event"]=="incident_opened":
        opened[r["incident_id"]] = (t, r["arm"])
    elif r["event"]=="incident_resolved":
        resolved[r["incident_id"]].append(t)
    elif r["event"]=="incident_reopened":
        reopened[r["incident_id"]].append(t)
print()
for arm in ("control","flag"):
    durs=[]
    for iid,(t0,a) in opened.items():
        if a!=arm: continue
        if resolved[iid]:
            durs.append((min(resolved[iid])-t0).total_seconds()/60)
    print(f"arm={arm} incidents={sum(1 for i,(t,a) in opened.items() if a==arm)} resolved={len(durs)} median_ttr={st.median(durs):.2f} mean={st.mean(durs):.2f}")
print()
for arm in ("control","flag"):
    n = sum(1 for i,(t,a) in opened.items() if a==arm)
    ro = sum(1 for i in reopened if opened.get(i,(None,None))[1]==arm)
    print(f"arm={arm} incidents={n} reopened_incidents={ro} pct={100*ro/n:.2f}%")
