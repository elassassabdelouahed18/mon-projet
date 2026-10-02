"""Rotate a wordmark onto the brand hues, keeping each pixel's lightness and
chroma so the antialiasing survives.  Green -> hue 150.4 (the cover leather),
gold -> hue 72.2 (the dot in the logo).  This is what produced
assets/befree-header-logo.webp from the emerald raster in the draft, whose
green sat at hue 164.7 — 20.6 ΔE away from the rest of the package.

    python3 tools/recolour-wordmark.py <source.webp|png>
"""
import math, sys
from PIL import Image
import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'oklch.py'),encoding='utf-8').read().split('names={')[0])
def oklab_rgb(r,g,b):
    r,g,b=srgb_lin(r),srgb_lin(g),srgb_lin(b)
    l=(0.4122214708*r+0.5363325363*g+0.0514459929*b)**(1/3)
    m=(0.2119034982*r+0.6806995451*g+0.1073969566*b)**(1/3)
    s=(0.0883024619*r+0.2817188376*g+0.6299787005*b)**(1/3)
    return (0.2104542553*l+0.7936177850*m-0.0040720468*s,
            1.9779984951*l-2.4285922050*m+0.4505937099*s,
            0.0259040371*l+0.7827717662*m-0.8086757660*s)
def rgb_oklab(L,A,B):
    l=(L+0.3963377774*A+0.2158037573*B)**3
    m=(L-0.1055613458*A-0.0638541728*B)**3
    s=(L-0.0894841775*A-1.2914855480*B)**3
    out=[]
    for c in ( 4.0767416621*l-3.3077115913*m+0.2309699292*s,
              -1.2684380046*l+2.6097574011*m-0.3413193965*s,
              -0.0041960863*l-0.7034186147*m+1.7076147010*s):
        c=12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
        out.append(max(0,min(255,round(c*255))))
    return tuple(out)

src=Image.open(sys.argv[1]).convert('RGBA')
px=list(src.getdata()); out=[]; moved=[0,0]
for r,g,b,a in px:
    if a==0: out.append((r,g,b,a)); continue
    L,A,B=oklab_rgb(r,g,b); C=math.hypot(A,B); H=math.degrees(math.atan2(B,A))%360
    if C<0.012: out.append((r,g,b,a)); continue          # neutral: leave alone
    if 130<=H<=210: target,i=150.4,0                      # the green
    elif 40<=H<=110: target,i=72.2,1                      # the gold
    else: out.append((r,g,b,a)); continue
    moved[i]+=1
    hr=math.radians(target)
    nr,ng,nb=rgb_oklab(L,C*math.cos(hr),C*math.sin(hr))
    out.append((nr,ng,nb,a))
dst=Image.new('RGBA',src.size); dst.putdata(out)
print('pixels moved: green',moved[0],' gold',moved[1],' of',len(px))
# 480px wide covers 154px at dpr3; the 900px original is 5.8x oversized
w=480; h=round(src.size[1]*w/src.size[0])
out=os.path.join(HERE,'..','assets','befree-header-logo.webp')
dst.resize((w,h),Image.LANCZOS).save(out,'WEBP',quality=92,method=6)
print('wrote %s  480x%d'%(out,h))
