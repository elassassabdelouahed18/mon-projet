#!/usr/bin/env python3
"""The Chapter 21 milestone years, computed from financial-model.json.

One source for the table, so no year in the book is ever typed by hand.

Conventions, stated in the book and in Appendix H:
  - The gap at month 24 is contributed at the end of each year.
  - Cash milestones (free from fear, free to walk) earn 0% after inflation.
    This is why they are slower than a reader expects; Appendix H says so.
  - The portfolio milestone earns 5% a year after inflation.
  - "Free" is 25 times a year of living costs.
  - The crossover is where the portfolio's own growth first passes 20 times
    the annual contribution; at 5% that is 1.05^n > 2, so year 15 whatever
    the contribution is, which is the point the chapter makes.

    python3 freedom-milestones.py
"""
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REAL_RETURN = 0.05
TARGET_MULTIPLE = 25
CROSSOVER_MULTIPLE = 20


def years_cash(target, annual):
    """0% after inflation: you simply add it up."""
    return math.ceil(target / annual)


def years_growing(target, annual, r=REAL_RETURN):
    """End-of-year contributions into a portfolio earning r after inflation."""
    n, balance = 0, 0.0
    while balance < target and n < 200:
        n += 1
        balance = balance * (1 + r) + annual
    return n


def crossover(r=REAL_RETURN):
    return years_growing(CROSSOVER_MULTIPLE, 1.0, r)


def milestones(name, model=None, month=24):
    model = model or json.load(open(os.path.join(HERE, 'financial-model.json'), encoding='utf-8'))
    row = next(r for r in model[name]['rows'] if r['month'] == month)
    gap, living = row['gap'], row['living']
    annual = gap * 12
    return {
        'gap': gap, 'living': living, 'income': row['income'],
        'rate': 100 * gap / row['income'],
        'fear': years_cash(6 * living, annual),
        'walk': years_cash(12 * living, annual),
        'crossover': crossover(),
        'free': years_growing(TARGET_MULTIPLE * 12 * living, annual),
    }


if __name__ == '__main__':
    for who in ('Marcus', 'Maya'):
        m = milestones(who)
        print(f"{who:7} month 24  gap ${m['gap']:,.2f} of ${m['income']:,.2f} = {m['rate']:.1f}%"
              f"  living ${m['living']:,.2f}")
        print(f"        fear year {m['fear']} · walk year {m['walk']} "
              f"· crossover year {m['crossover']} · free year {m['free']}")
