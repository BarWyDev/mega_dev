# Reading a screen recording in full

Sampling a clip at 45%, 72% and 99% missed a second application that was on
screen for 1.4 s in two clips of four, and that application held the answer.

```bash
# every frame, cropped below the header so a ticking clock does not mask changes
ffmpeg -nostdin -v error -y -i clip.mp4 -vf "crop=1280:600:0:90" frames/b%04d.png
```

Then diff consecutive frames over a 16x12 grid and print the frames where a
large region changed (`diffscan2.py` pattern):

```python
from PIL import Image, ImageChops
# resize each frame to 128x96, compare 8x8 cells, report cells whose max
# difference exceeds 40; ignore cells that hold a counter that always ticks.
```

Read every frame the scan reports. A whole-screen change (most cells at once)
means the recording left the application you were watching: open those frames
at full resolution and quote what the other screen says.

For audio, convert to 16 kHz mono and run `whisper-cli` with the shared model in
`~/.cache/whisper/`.
