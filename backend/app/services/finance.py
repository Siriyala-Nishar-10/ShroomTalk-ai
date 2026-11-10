import numpy as np


def _r(value: float, digits: int = 2) -> float:
    return round(float(value), digits)


def calculate_loan(principal: float, annual_rate_percent: float, tenure_months: int) -> dict:
    n = int(tenure_months)
    p = float(principal)
    r = float(annual_rate_percent) / 1200.0
    k = np.arange(1, n + 1, dtype=float)

    if r == 0:
        emi = p / n
        balance = p - emi * k
    else:
        growth = (1.0 + r) ** k
        emi = p * r * (1.0 + r) ** n / ((1.0 + r) ** n - 1.0)
        balance = p * growth - emi * (growth - 1.0) / r

    balance = np.maximum(balance, 0.0)
    opening = np.concatenate(([p], balance[:-1]))
    interest = opening * r
    principal_paid = emi - interest

    yearly = []
    for start in range(0, n, 12):
        part = slice(start, min(start + 12, n))
        yearly.append(
            {
                "year": start // 12 + 1,
                "principal_paid": _r(principal_paid[part].sum()),
                "interest_paid": _r(interest[part].sum()),
                "closing_balance": _r(balance[part][-1]),
            }
        )

    total_payment = emi * n
    total_interest = max(total_payment - p, 0.0)

    return {
        "monthly_emi": _r(emi),
        "total_payment": _r(total_payment),
        "total_interest": _r(total_interest),
        "interest_share_percent": _r(total_interest / total_payment * 100) if total_payment > 0 else 0.0,
        "yearly": yearly,
    }


def calculate_cultivation(
    number_of_bags: int,
    substrate_cost_per_bag: float,
    spawn_cost_per_bag: float,
    labour_cost: float,
    utilities_cost: float,
    other_costs: float,
    expected_yield_kg_per_bag: float,
    wastage_percent: float,
    selling_price_per_kg: float,
) -> dict:
    bags = float(number_of_bags)
    production_kg = bags * float(expected_yield_kg_per_bag) * (1.0 - float(wastage_percent) / 100.0)
    revenue = production_kg * float(selling_price_per_kg)
    total_cost = (
        bags * (float(substrate_cost_per_bag) + float(spawn_cost_per_bag))
        + float(labour_cost)
        + float(utilities_cost)
        + float(other_costs)
    )
    profit = revenue - total_cost

    changes = np.array([-20.0, -10.0, 0.0, 10.0, 20.0])
    prices = float(selling_price_per_kg) * (1.0 + changes / 100.0)
    revenues = production_kg * prices
    profits = revenues - total_cost
    sensitivity = [
        {
            "price_change_percent": int(changes[i]),
            "selling_price_per_kg": _r(prices[i]),
            "revenue": _r(revenues[i]),
            "profit": _r(profits[i]),
        }
        for i in range(len(changes))
    ]

    return {
        "expected_production_kg": _r(production_kg),
        "total_cost": _r(total_cost),
        "revenue": _r(revenue),
        "profit": _r(profit),
        "profit_margin_percent": _r(profit / revenue * 100) if revenue > 0 else 0.0,
        "cost_per_kg": _r(total_cost / production_kg) if production_kg > 0 else None,
        "break_even_price_per_kg": _r(total_cost / production_kg) if production_kg > 0 else None,
        "sensitivity": sensitivity,
    }


def calculate_business(
    monthly_revenue: float,
    monthly_operating_costs: float,
    monthly_loan_emi: float,
    initial_investment: float,
) -> dict:
    revenue = float(monthly_revenue)
    emi = float(monthly_loan_emi)
    before_emi = revenue - float(monthly_operating_costs)
    after_emi = before_emi - emi
    coverage = before_emi / emi if emi > 0 else None

    if before_emi <= 0:
        assessment = "loss"
    elif emi == 0:
        assessment = "no_loan"
    elif coverage >= 1.5:
        assessment = "strong"
    elif coverage >= 1.2:
        assessment = "adequate"
    elif coverage >= 1.0:
        assessment = "tight"
    else:
        assessment = "weak"

    investment = float(initial_investment)
    payback = investment / after_emi if after_emi > 0 and investment > 0 else None

    return {
        "monthly_profit_before_emi": _r(before_emi),
        "monthly_profit_after_emi": _r(after_emi),
        "profit_margin_percent": _r(before_emi / revenue * 100) if revenue > 0 else 0.0,
        "emi_coverage_ratio": _r(coverage) if coverage is not None else None,
        "payback_months": _r(payback, 1) if payback is not None else None,
        "assessment": assessment,
    }