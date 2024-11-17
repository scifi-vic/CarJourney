// src/pages/Finance.js
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import "./../styles/Finance.css";

const Finance = () => {
  const [calculatorType, setCalculatorType] = useState("finance");

  // State for Finance Calculator
  const [financeData, setFinanceData] = useState({
    carPrice: 0,
    interestRate: 0,
    loanTerm: 60,
    salesTaxRate: 0,
    downPayment: 0,
    tradeValue: 0,
    tradeOwed: 0,
  });

  // State for Affordability Calculator
  const [affordabilityData, setAffordabilityData] = useState({
    preferredPayment: 0,
    interestRate: 0,
    loanTerm: 60,
    salesTaxRate: 0,
    downPayment: 0,
    tradeValue: 0,
    tradeOwed: 0,
  });

  // State for Lease Calculator
  const [leaseData, setLeaseData] = useState({
    carPrice: 0,
    salesTaxRate: 0,
    leaseTerm: 36,
    interestRate: 0,
    downPayment: 0,
    tradeValue: 0,
    tradeOwed: 0,
    residualValue: 62,
    milesPerYear: 0,
  });

  const handleInputChange = (e, setData) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  // Finance Calculation
  const calculateFinance = () => {
    const {
      carPrice,
      interestRate,
      loanTerm,
      salesTaxRate,
      downPayment,
      tradeValue,
      tradeOwed,
    } = financeData;

    // Convert Rates
    var salesRate = salesTaxRate / 100; // Divides by 100 to convert to percentage
    var interestRate_per = interestRate / 100;  // Divides by 100 to convert to percentage

    const monthlyRate = interestRate_per / 12;  // Interest rate per month

    /*  Calculate Sales Tax
        Sales Tax has its own formula apart from the Rate   */
    const salesTax = (carPrice) * (salesRate);

    /*  Calculate Total Finance  
            From: https://www.autotrader.com/car-payment-calculator   */
    const totalFinanced =
      carPrice + salesTax - downPayment - tradeValue + tradeOwed;

    /*  Calculate Monthly Payment
        Formula for Monthly Payment was taken from these 2 websites:
            https://www.calculatorsoup.com/calculators/financial/loan-calculator.php
            https://www.rocketloans.com/learn/financial-smarts/how-to-calculate-monthly-payment-on-a-loan   */  
    const monthlyPayment =
      monthlyRate === 0
        ? totalFinanced / loanTerm
        : totalFinanced * ((monthlyRate) * ((1 + monthlyRate) ** loanTerm)) / (((1 + monthlyRate) ** loanTerm) - 1);;

    /*  Calculate Total Interest
            Formula: https://www.reddit.com/r/HelpMeFind/comments/12mtb62/what_does_est_total_interest_mean_im_confused/  */ 
    const totalInterest = (monthlyPayment * loanTerm) - totalFinanced;

    // Calculate Total Loan
    const totalLoan = (totalFinanced) + (totalInterest);

    return {
      salesTax,
      totalFinanced,
      monthlyPayment,
      totalLoan,
      totalInterest,
    };
  };

  // Affordability Calculation
  const calculateAffordability = () => {
    const {
      preferredPayment,
      interestRate,
      loanTerm,
      salesTaxRate,
      downPayment,
      tradeValue,
      tradeOwed,
    } = affordabilityData;

    const monthlyRate = interestRate / 100 / 12;
    const totalLoan =
      monthlyRate === 0
        ? preferredPayment * loanTerm
        : (preferredPayment * (Math.pow(1 + monthlyRate, loanTerm) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, loanTerm));
    const salesTax = totalLoan / (1 + salesTaxRate / 100);
    const totalFinanced = totalLoan + salesTax - downPayment;
    const carPrice = totalFinanced + tradeValue - tradeOwed;

    return {
      salesTax,
      totalLoan,
      totalFinanced,
      carPrice,
    };
  };

  // Lease Calculation
  const calculateLease = () => {
    const {
      carPrice,
      salesTaxRate,
      leaseTerm,
      interestRate,
      downPayment,
      tradeValue,
      tradeOwed,
      residualValue,
      milesPerYear,
    } = leaseData;

    const salesTax = (carPrice * salesTaxRate) / 100;
    const netTrade = tradeValue - tradeOwed;
    const totalLeaseCost =
      carPrice - (carPrice * residualValue) / 100 + salesTax;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyLease =
      (totalLeaseCost * monthlyRate +
        (carPrice - (carPrice * residualValue) / 100) / leaseTerm) /
      (1 - Math.pow(1 + monthlyRate, -leaseTerm));

    return {
      salesTax,
      netTrade,
      totalLeaseCost,
      monthlyLease,
      milesPerYear,
    };
  };

  const {
    salesTax,
    totalFinanced,
    monthlyPayment,
    totalLoan,
    totalInterest,
  } = calculatorType === "finance" ? calculateFinance() : {};

  const { carPrice: affordCarPrice } =
    calculatorType === "affordability" ? calculateAffordability() : {};

  const { monthlyLease, milesPerYear } =
    calculatorType === "lease" ? calculateLease() : {};

  return (
    <div className="calculator-section">
      <h2>Car Loan Calculators</h2>
      <p>Choose a calculator to estimate your car payment options:</p>
      <div className="tabs">
        <button
          className={calculatorType === "finance" ? "active" : ""}
          onClick={() => setCalculatorType("finance")}
        >
          Finance
        </button>
        <button
          className={calculatorType === "affordability" ? "active" : ""}
          onClick={() => setCalculatorType("affordability")}
        >
          Affordability
        </button>
        <button
          className={calculatorType === "lease" ? "active" : ""}
          onClick={() => setCalculatorType("lease")}
        >
          Lease
        </button>
      </div>

    {/* Finance Section */}
      {calculatorType === "finance" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="carPrice">Car Price</label>
            <input
              type="number"
              id="carPrice"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
            <label htmlFor="interestRate">Interest Rate</label>
            <input
              type="number"
              id="interestRate"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
            <label htmlFor="loanTerm">Loan Term (months)</label>
              <select id="loanTerm" value={financeData.loanTerm} onChange={(e) => handleInputChange(e, setFinanceData)}>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60">60</option>
                <option value="72">72</option>
              </select>
            <label htmlFor="salesTaxRate">Sales Tax Rate</label>
            <input
              type="number"
              id="salesTaxRate"
              placeholder="0.0%"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
            <label htmlFor="downPayment">Down Payment</label>
            <input
              type="number"
              id="downPayment"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
            <label htmlFor="tradeValue">Trade-In Value</label>
            <input
              type="number"
              id="tradeValue"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
            <label htmlFor="tradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="tradeOwed"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setFinanceData)}
            />
          </div>
          {/* Finance Results */}
          <div className="calculator-results">
            <h3>Est. Monthly Payment</h3>
            <p><strong id="financeMonthlyPayment">${monthlyPayment.toFixed(2)}/month</strong></p>
            <ul>
              <li>Car Price: <span id="price">${financeData.carPrice}</span></li>
              <li>Sales Tax: <span id="salesTax">${salesTax.toFixed()}</span></li>
              <li>Down Payment: <span id="downPaymentDisplay">${financeData.downPayment}</span></li>
              <li>Trade-In Value: <span id="tradeInDisplay">${financeData.tradeValue}</span></li>
              <li>Amount Owed on Trade: <span id="amountOwedDisplay">${financeData.tradeOwed}</span></li>
              <li>Est. Total Financed: <span id="totalFinancedDisplay">${totalFinanced.toFixed()}</span></li>
              <li>Est. Total Interest: <span id="totalInterest">${totalInterest.toFixed()}</span></li>
              <li>Est. Total Loan: <span id="totalLoan">${totalLoan.toFixed()}</span></li>
            </ul>
          </div>
        </div>
      )}

      {calculatorType === "affordability" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="preferredPayment">Preferred Monthly Payment</label>
            <input
              type="number"
              id="preferredPayment"
              value={affordabilityData.preferredPayment}
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            {/* Add more inputs as needed */}
          </div>
          <div className="calculator-results">
            <h3>Est. Car Price</h3>
            <p>${affordCarPrice?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {calculatorType === "lease" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="carPrice">Car Price</label>
            <input
              type="number"
              id="carPrice"
              value={leaseData.carPrice}
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            {/* Add more inputs as needed */}
          </div>
          <div className="calculator-results">
            <h3>Est. Monthly Lease Payment</h3>
            <p>${monthlyLease?.toFixed(2)}</p>
            <p>Miles Per Year: {milesPerYear}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;

