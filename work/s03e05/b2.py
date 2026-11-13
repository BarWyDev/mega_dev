import csv, sys, statistics as st
from collections import defaultdict, Counter
from datetime import datetime, timedelta
def load(p):
    rows=list(csv.DictReader(open(p)))
    for r in rows: r["t"]=datetime.fromisoformat(r["ts"].replace("Z","+00:00"))
    return rows

ac=load(sys.argv[1]); bk=load(sys.argv[2])
print("=== 0010 auto-close ===")
print("sites per arm:", Counter(a for a in {r["site_id"]:r["arm"] for r in ac}.values()))
inc=defaultdict(list)
for r in ac: inc[r["incident_id"]].append(r)
for k in inc: inc[k].sort(key=lambda r:r["t"])
# open at 06:00 UTC of the night's morning
openat=Counter(); total=Counter(); autoc=Counter(); reop=Counter(); durs=defaultdict(list)
for i,evs in inc.items():
    arm=evs[0]["arm"]; total[arm]+=1
    t0=evs[0]["t"]
    night=datetime.fromisoformat(evs[0]["night"]+"T00:00:00+00:00")
    cutoff=night+timedelta(days=1, hours=6)
    names={e["event"] for e in evs}
    ends=[e["t"] for e in evs if e["event"] in ("incident_resolved","incident_auto_closed")]
    end=min(ends) if ends else None
    if end is None or end>cutoff: openat[arm]+=1
    if "incident_auto_closed" in names: autoc[arm]+=1
    if "incident_reopened" in names: reop[arm]+=1
    res=[e["t"] for e in evs if e["event"]=="incident_resolved"]
    if res: durs[arm].append((min(res)-t0).total_seconds()/60)
for arm in ("control","flag"):
    print(f"{arm:8} incidents={total[arm]:5} open_at_0600={openat[arm]:4} ({100*openat[arm]/total[arm]:.2f}%) auto_closed={autoc[arm]:4} reopened={reop[arm]:3} ({100*reop[arm]/total[arm]:.2f}%) median_ttr={st.median(durs[arm]):.2f}")
o=openat; print(f"open-at-06:00 change: {100*(o['flag']/total['flag']-o['control']/total['control'])/(o['control']/total['control']):+.1f}% (rate basis)")
print(f"open-at-06:00 raw counts: {o['control']} -> {o['flag']}  {100*(o['flag']-o['control'])/o['control']:+.1f}%")
print(f"median ttr change: {100*(st.median(durs['flag'])-st.median(durs['control']))/st.median(durs['control']):+.2f}%")
print(f"reopened pp change: {100*reop['flag']/total['flag']-100*reop['control']/total['control']:+.2f}pp")

print()
print("=== 0011 bulk-ack ===")
print("sites per arm:", Counter(a for a in {r["site_id"]:r["arm"] for r in bk}.values()))
inc2=defaultdict(list)
for r in bk: inc2[r["incident_id"]].append(r)
for k in inc2: inc2[k].sort(key=lambda r:r["t"])
cnt=defaultdict(set)
for i,evs in inc2.items():
    if evs[0]["event"]=="incident_opened": cnt[(evs[0]["site_id"],evs[0]["night"],evs[0]["arm"])].add(i)
bad={k for k,v in cnt.items() if len(v)>=3}
ack=defaultdict(list); a2r=defaultdict(list); miss=Counter(); tot2=Counter()
for i,evs in inc2.items():
    arm=evs[0]["arm"]; key=(evs[0]["site_id"],evs[0]["night"],arm)
    tot2[arm]+=1
    if "page_missed" in {e["event"] for e in evs}: miss[arm]+=1
    t0=[e["t"] for e in evs if e["event"]=="incident_opened"]
    ta=[e["t"] for e in evs if e["event"]=="incident_acked"]
    tr=[e["t"] for e in evs if e["event"]=="incident_resolved"]
    if t0 and ta and key in bad: ack[arm].append((ta[0]-t0[0]).total_seconds()/60)
    if ta and tr: a2r[arm].append((tr[0]-ta[0]).total_seconds()/60)
for arm in ("control","flag"):
    print(f"{arm:8} incidents={tot2[arm]:5} badnight_acks={len(ack[arm]):4} median_ack={st.median(ack[arm]):6.2f} median_ack_to_res={st.median(a2r[arm]):6.2f} missed_pages={miss[arm]:3} ({100*miss[arm]/tot2[arm]:.2f}%)")
print(f"ack change: {100*(st.median(ack['flag'])-st.median(ack['control']))/st.median(ack['control']):+.1f}%")
print(f"ack->resolve change: {100*(st.median(a2r['flag'])-st.median(a2r['control']))/st.median(a2r['control']):+.2f}%")
print(f"missed pages pp: {100*miss['flag']/tot2['flag']-100*miss['control']/tot2['control']:+.2f}pp")
