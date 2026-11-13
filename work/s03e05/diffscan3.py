import sys, os
from PIL import Image, ImageChops
d=sys.argv[1]; fps=25.0
files=sorted(os.listdir(d))
prev=None
GW,GH=16,12
IGNORE={(5,2)}  # ticking queue-depth number
for i,f in enumerate(files):
    im=Image.open(os.path.join(d,f)).convert("L").resize((GW*8,GH*8))
    if prev is not None:
        diff=ImageChops.difference(im,prev)
        cells=[]
        for gy in range(GH):
            for gx in range(GW):
                if (gx,gy) in IGNORE: continue
                if max(diff.crop((gx*8,gy*8,gx*8+8,gy*8+8)).getdata())>40: cells.append((gx,gy))
        if len(cells)>=2:
            xs=[c[0] for c in cells]; ys=[c[1] for c in cells]
            print(f"t={i/fps:6.2f}s {f} ncells={len(cells)} x={min(xs)}-{max(xs)} y={min(ys)}-{max(ys)}")
    prev=im
