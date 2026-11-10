import pytest

from app.services.finance import calculate_business, calculate_cultivation, calculate_loan


def test_zero_interest_loan():
    result = calculate_loan(principal=120000, annual_rate_percent=0, tenure_months=12)
    assert result["monthly_emi"] == 10000.0
    assert result["total_interest"] == 0.0


def test_standard_emi():
    result = calculate_loan(principal=100000, annual_rate_percent=12, tenure_months=12)
    assert result["monthly_emi"] == pytest.approx(8884.88, abs=0.01)
    assert result["yearly"][0]["closing_balance"] == pytest.approx(0, abs=0.05)


def test_cultivation_profit():
    result = calculate_cultivation(
        number_of_bags=100,
        substrate_cost_per_bag=40,
        spawn_cost_per_bag=10,
        labour_cost=2000,
        utilities_cost=500,
        other_costs=500,
        expected_yield_kg_per_bag=1.0,
        wastage_percent=10,
        selling_price_per_kg=200,
    )
    assert result["expected_production_kg"] == pytest.approx(90.0)
    assert result["total_cost"] == pytest.approx(8000.0)
    assert result["profit"] == pytest.approx(10000.0)
    assert result["break_even_price_per_kg"] == pytest.approx(88.89, abs=0.01)


def test_business_coverage():
    result = calculate_business(
        monthly_revenue=50000,
        monthly_operating_costs=30000,
        monthly_loan_emi=10000,
        initial_investment=100000,
    )
    assert result["emi_coverage_ratio"] == pytest.approx(2.0)
    assert result["assessment"] == "strong"
    assert result["payback_months"] == pytest.approx(10.0)