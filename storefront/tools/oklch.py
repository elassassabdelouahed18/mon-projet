"""OKLab/OKLCH helpers, plus a table of the package's colours when run.

The other tools pull the functions out with
    exec(open('oklch.py').read().split('names={')[0])
so everything above the `names` table must stay import-free.
"""
import json, math
def srgb_lin(c):
    c/=255
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def oklab(h):
    h=h.lstrip('#'); r,g,b=[srgb_lin(int(h[i:i+2],16)) for i in (0,2,4)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b
    m=0.2119034982*r+0.6806995451*g+0.1073969566*b
    s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=l**(1/3),m**(1/3),s**(1/3)
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s
    A=1.9779984951*l-2.4285922050*m+0.4505937099*s
    B=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L,A,B
def lch(h):
    L,A,B=oklab(h)
    return L*100, math.hypot(A,B)*100, math.degrees(math.atan2(B,A))%360
def lum(h):
    h=h.lstrip('#'); r,g,b=[srgb_lin(int(h[i:i+2],16)) for i in (0,2,4)]
    return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b):
    l1,l2=sorted([lum(a),lum(b)],reverse=True)
    return (l1+0.05)/(l2+0.05)
def dE(a,b):
    x=oklab(a); y=oklab(b)
    return 100*math.dist(x,y)

names={
 'HEADER bg':'#F8F6EF','HEADER ink':'#183E32','HEADER button':'#0C4234',
 'HEADER btn-ink':'#FFFDF5','HEADER gold':'#C39946',
 'ANN bg':'#0C3028','ANN alt':'#164A3C','ANN cream':'#F6F4EB','ANN gold':'#DEC17E',
 'BRAND anchor (cover)':'#01401A','BRAND forest':'#1C4C2A','BRAND plate':'#123B1F',
 'BRAND c2':'#447E52','BRAND paper':'#F9FDF9','BRAND panel':'#E6F1E8',
 'LOGO plate':'#063F2E','LOGO ring':'#E8D1BA','LOGO dot':'#EDA335',
 'AMBER fixed':'#FFB754','AMBER old':'#EDA335',
 'ANN dark prop':'#133F20','ANN mid prop':'#255A34','ANN cream prop':'#FBF6EE',
}
print(f"{'name':24} {'hex':9} {'L':>6} {'C':>6} {'H':>7}")
for k,v in names.items():
    L,C,H=lch(v); print(f"{k:24} {v:9} {L:6.1f} {C:6.1f} {H:7.1f}")
print()
print("contrast checks")
for a,b,label in [('#183E32','#F8F6EF','header ink on bg'),
                  ('#FFFDF5','#0C4234','button text on button'),
                  ('#C39946','#F8F6EF','gold on bg (13px nav underline/label)'),
                  ('#0C4234','#F8F6EF','button bg vs page bg'),
                  ('#183E32','#FFFFFF','ink on white')]:
    print(f"  {label:38} {cr(a,b):5.2f}:1")
print()
print("distance from the brand (dE x100, OKLab)")
for a,b,label in [('#0C4234','#01401A','header button vs cover green'),
                  ('#0C4234','#123B1F','header button vs brand plate'),
                  ('#0C4234','#063F2E','header button vs LOGO plate'),
                  ('#183E32','#1C4C2A','header ink vs brand forest'),
                  ('#F8F6EF','#F9FDF9','header bg vs book paper'),
                  ('#C39946','#EDA335','header gold vs logo dot'),
                  ('#0C3028','#0C4234','announcement vs header green'),
                  ('#F6F4EB','#F8F6EF','announcement vs header cream'),
                  ('#DEC17E','#C39946','announcement vs header gold')]:
    print(f"  {label:38} {dE(a,b):5.2f}")
