import json, sys, urllib.request
kind, finding, offset = sys.argv[1], sys.argv[2], float(sys.argv[3])
t = json.load(open('secrets.local.json'))['ticket']
body = json.dumps({"ticket": t, "finding": finding, "offset": offset}).encode()
req = urllib.request.Request(f"https://hq.mega.dev/challenges/who-said-what/api/{kind}", data=body, headers={"content-type": "application/json"})
try:
    r = urllib.request.urlopen(req); print(r.status); print(r.read().decode())
except urllib.error.HTTPError as e:
    print(e.code); print(e.read().decode())
