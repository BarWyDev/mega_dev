import sys, os
from PIL import Image, ImageChops
d=sys.argv[1]; fps=25.0
files=sorted(os.listdir(d))
prev=None; prevname=None
GW,GH=16,12
for i,f in enumerate(files):
    im=Image.open(os.path.join(d,f)).convert("L")
    small=im.resize((GW*8,GH*8))
    if prev is not None:
        diff=ImageChops.difference(small,prev)
        cells=[]
        for gy in range(GH):
            for gx in range(GW):
                box=diff.crop((gx*8,gy*8,gx*8+8,gy*8+8))
                mx=max(box.getdata())
                if mx>40: cells.append((gx,gy))
        if cells:
            print(f"t={i/fps:6.2f}s frame={f} cells={len(cells)} {cells[:14]}")
    prev=small
