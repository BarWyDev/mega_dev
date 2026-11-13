import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime
rows=list(csv.DictReader(open(sys.argv[1])))
for r in rows: r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
inc=defaultdict(dict)
for r in rows: inc[r["incident_id"]][r["event"]]=r
# group acks sharing site+operator+exact ack time
acks=defaultdict(list)
for i,e in inc.items():
    if "incident_acked" in e:
        a=e["incident_acked"]; acks[(a["site_id"],a["operator_id"],a["ts"])].append(i)
sz=Counter()
for k,v in acks.items(): sz[(inc[v[0]]["incident_opened"]["arm"], len(v))]+=1
print("bulk ack group sizes (arm, size): count")
for k in sorted(sz): print("  ",k, sz[k])
print()
# ack latency by whether in a group
lat=defaultdict(list); a2r=defaultdict(list); miss=defaultdict(int); n=defaultdict(int)
for k,v in acks.items():
    g = len(v)>1
    for i in v:
        e=inc[i]; arm=e["incident_opened"]["arm"]
        key=(arm,"grouped" if g else "single")
        n[key]+=1
        lat[key].append((e["incident_acked"]["t"]-e["incident_opened"]["t"]).total_seconds()/60)
        if "incident_resolved" in e:
            a2r[key].append((e["incident_resolved"]["t"]-e["incident_acked"]["t"]).total_seconds()/60)
        if "page_missed" in e: miss[key]+=1
for k in sorted(n):
    print(f"{k[0]:8} {k[1]:8} n={n[k]:5} median_ack={st.median(lat[k]):6.2f} median_ack_to_res={st.median(a2r[k]):6.2f} missed={miss[k]:3} ({100*miss[k]/n[k]:.2f}%)")
print()
bad=sum(1 for i,e in inc.items() if "incident_acked" in e and e["incident_acked"]["t"]<e["incident_opened"]["t"])
print("acked before opened:", bad)
print("incidents without resolve:", sum(1 for i,e in inc.items() if "incident_resolved" not in e))
# same cause check within groups
mixed=0
for k,v in acks.items():
    if len(v)>1 and len({inc[i]["incident_opened"]["detail"] for i in v})>1: mixed+=1
print("bulk groups mixing causes:", mixed, "of", sum(1 for v in acks.values() if len(v)>1))
