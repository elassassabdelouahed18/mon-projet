#!/usr/bin/env python3
"""Appendix H, Model four: what the engine is worth, if it works.

Three scenarios from Marcus's position in month 36, when his last debt is gone.
Nothing here is a prediction. Each one answers a reader who has done everything
the book asked and wants to know whether the arithmetic ever gets shorter than
a working life.

Every figure comes from a source, not from an assumption:

  2026 federal brackets and standard deduction
      IRS Rev. Proc. 2025-32, §3.01 Table 3 and §3.14, read 9 October 2026
  Marcus's state and local rates
      Appendix D's own take-home table: FICA 7.65%, Ohio 2.75%, Columbus 2.5%
  The supervisor's wage
      BLS OEWS May 2025, SOC 53-1047, Columbus OH: median $62,260 a year
      (sources/bls-oews-columbus-may2025.json). The median, not the mean of
      $65,420, because the mean is pulled up by trucking and rail supervisors
      inside the same occupation code.
  Marcus's own occupation, for scale
      BLS OEWS May 2025, SOC 53-7062, Columbus OH: median $41,200. He earns
      about $42,000, so he is already paid the going local rate.

    python3 scenarios.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

# IRS Rev. Proc. 2025-32, unmarried individuals, tax year 2026
BRACKETS = [(12_400, 0.10), (50_400, 0.12), (105_700, 0.22), (201_775, 0.24),
            (256_225, 0.32), (640_600, 0.35), (float('inf'), 0.37)]
STANDARD_DEDUCTION = 16_100
FICA, OHIO, COLUMBUS = 0.0765, 0.0275, 0.025

# Appendix D's month-0 assumptions for Marcus
GROSS_NOW = 42_003
PRETAX_HEALTH = 1_430
# BLS OEWS May 2025, Columbus OH
SUPERVISOR = 62_260

REAL_RETURN = 0.05
TARGET_MULTIPLE = 25


def federal(taxable):
    tax, last = 0.0, 0.0
    for top, rate in BRACKETS:
        if taxable <= last:
            break
        tax += (min(taxable, top) - last) * rate
        last = top
    return tax


NET_NOW = 33_231          # Appendix D's own take-home table


def tax_on_raise(gross_from, gross_to, pretax=PRETAX_HEALTH):
    """What a raise actually costs in tax, bracket by bracket.

    Anchored to Appendix D rather than re-deriving his whole return: only the
    increment is computed here, which is the figure errata A2 was about.
    FICA skips the cafeteria-plan health premium, so the premium does not
    change when the wage does.
    """
    t_from = max(0.0, gross_from - pretax - STANDARD_DEDUCTION)
    t_to = max(0.0, gross_to - pretax - STANDARD_DEDUCTION)
    step = gross_to - gross_from
    return (federal(t_to) - federal(t_from)) + step * (FICA + OHIO + COLUMBUS)


def marginal_on_raise(gross_from, gross_to):
    return tax_on_raise(gross_from, gross_to) / (gross_to - gross_from)


def years_to_free(income, living, raise_pct=0.0, to_gap=0.75,
                  extra=0.0, extra_from_year=0, r=REAL_RETURN, cap=99):
    """Years until the portfolio reaches 25 times a year of living costs.

    income and living are monthly. A raise is real, above inflation, and the
    share of it named by to_gap never reaches the lifestyle.
    """
    balance = 0.0
    for year in range(1, cap + 1):
        add = extra if year >= extra_from_year else 0.0
        balance = balance * (1 + r) + (income + add - living) * 12
        if balance >= TARGET_MULTIPLE * living * 12:
            return year
        rise = income * raise_pct
        income += rise
        living += rise * (1 - to_gap)
    return None


def base():
    m = json.load(open(os.path.join(HERE, 'financial-model.json'), encoding='utf-8'))
    row = next(r for r in m['Marcus']['rows'] if r['month'] == 24)
    # month 36 of the same plan: the debts are gone and their minimums with them
    return 3123.58, 2506.72, row


if __name__ == '__main__':
    income, living, _ = base()
    step = SUPERVISOR - GROSS_NOW
    tax = tax_on_raise(GROSS_NOW, SUPERVISOR)
    raise_net = (step - tax) / 12

    print(f'Marcus at month 36: ${income:,.2f} in, ${living:,.2f} out, '
          f'gap ${income - living:,.2f} ({(income - living) / income * 100:.1f}%)\n')
    print(f'gross now              ${GROSS_NOW:,}   (take-home ${NET_NOW:,}, Appendix D)')
    print(f'gross as supervisor    ${SUPERVISOR:,}   (BLS Columbus median, SOC 53-1047)')
    print(f'the step               ${step:,} a year gross')
    print(f'tax on the step        ${tax:,.0f}  =  '
          f'{marginal_on_raise(GROSS_NOW, SUPERVISOR) * 100:.1f}% marginal')
    taxable_after = SUPERVISOR - PRETAX_HEALTH - STANDARD_DEDUCTION
    print(f'   taxable income after the raise ${taxable_after:,}, still inside the 12% '
          f'bracket, which tops out at $50,400')
    print(f'the promotion is worth ${raise_net:,.0f} a month net\n')

    rows = [
        ('1 · As he stands, nothing new',
         years_to_free(income, living, raise_pct=0.02, to_gap=0.75)),
        ('2 · Engine Zero: shift supervisor in year 3',
         years_to_free(income, living, raise_pct=0.02, to_gap=0.75,
                       extra=raise_net * 0.75, extra_from_year=3)),
        ('3 · A side service reaching $500 a month net in year 2',
         years_to_free(income, living, raise_pct=0.02, to_gap=0.75,
                       extra=500, extra_from_year=2)),
        ('4 · Both',
         years_to_free(income, living, raise_pct=0.02, to_gap=0.75,
                       extra=raise_net * 0.75 + 500, extra_from_year=3)),
    ]
    for label, y in rows:
        print(f'  {label:52} {y} years')
