"""Years to 25x spending, from Marcus's position once his debts are gone."""
INC, LIV = 3123.58, 2506.72  # month 36 of the model: the debts are gone
# (financial-model.cjs, MONTHS=48). Marcus clears his last balance in month 35.

def years(inc=INC, liv=LIV, cut=0.0, raise_pct=0.0, to_gap=1.0, r=0.05, mult=25, cap=99):
    inc, liv = inc, liv - cut
    bal = 0.0
    for y in range(1, cap + 1):
        bal = bal * (1 + r) + (inc - liv) * 12
        if bal >= mult * liv * 12:
            return y
        rise = inc * raise_pct
        inc += rise
        liv += rise * (1 - to_gap)      # the part you let your life absorb
    return None

def rate(cut=0.0):
    return 100 * (INC - (LIV - cut)) / INC

print(f'base gap rate {rate():.1f}%  years {years()}')
print()
print('one lever at a time')
for cut in (200, 300, 400):
    print(f'  cut {cut:3}/mo   rate {rate(cut):4.1f}%   years {years(cut=cut)}')
for sh in (0.5, 0.75, 1.0):
    print(f'  2% raise, {sh:.0%} of it to the gap        years {years(raise_pct=.02, to_gap=sh)}')
print()
print('both levers, 2% real raises')
for cut in (0, 200, 400):
    for sh in (0.5, 0.75):
        print(f'  cut {cut:3} + {sh:.0%} of raises   years {years(cut=cut, raise_pct=.02, to_gap=sh)}')
print()
print('sensitivity to the raise size, 75% to the gap, no cut')
for rp in (0.01, 0.02, 0.03):
    print(f'  {rp:.0%}  years {years(raise_pct=rp, to_gap=.75)}')
