// src/pages/Finance.js
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import "./../styles/Finance.css";

// Payment Calculator
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
    affordInterestRate: 0,
    affordLoanTerm: 60,
    affordSalesTaxRate: 0,
    affordDownPayment: 0,
    affordTradeValue: 0,
    affordTradeOwed: 0,
  });

  // State for Lease Calculator
  const [leaseData, setLeaseData] = useState({
    leaseCarPrice: 0,
    leaseSalesTax: 0,
    leaseTerm: 60,
    leaseInterestRate: 0,
    leaseTradeValue: 0,
    leaseTradeOwed: 0,
    leaseDownPayment: 0,
    residualValue: 62,
    leaseMiles: 0,
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
      affordInterestRate,
      affordLoanTerm,
      affordSalesTaxRate,
      affordDownPayment,
      affordTradeValue,
      affordTradeOwed,
    } = affordabilityData;

    // Convert Rates
    var salesRate = affordSalesTaxRate / 100; // Divides by 100 to convert to percentage
    var interestRate_per = affordInterestRate / 100;  // Divides by 100 to convert to percentage

    const monthlyRate = interestRate_per / 12;  // Interest rate per month

    /*  Calculate Total Finance
        https://www.calculatorsoup.com/calculators/financial/loan-calculator.php  */
    const afford_totalFinanced =
      monthlyRate === 0
        ? preferredPayment * affordLoanTerm
        : (preferredPayment / monthlyRate) * (1 - ((1) / ((1 + monthlyRate) ** affordLoanTerm)))

    /* Calculate Total Loan
       preferredPayment * affordLoanTerm  */
    const afford_totalLoan = (preferredPayment) * (affordLoanTerm);

    /* Calculate Sales Tax
       totalFinanced * salesRate  */
    const afford_salesTax = (afford_totalFinanced) * (salesRate);

    // Calculate Total Interest
    const afford_totalInterest = (afford_totalLoan) - (afford_totalFinanced);

    // Calculate Estimated Car Price
    const afford_carPrice = (afford_totalFinanced) - (afford_salesTax) + (affordDownPayment) + (affordTradeValue) - (affordTradeOwed);

    return {
      afford_salesTax,
      afford_totalLoan,
      afford_totalFinanced,
      afford_totalInterest,
      afford_carPrice,
    };
  };

  // Lease Calculation
  const calculateLease = () => {
    const {
      leaseCarPrice,
      leaseSalesTax,
      leaseTerm,
      leaseInterestRate,
      leaseTradeValue,
      leaseTradeOwed,
      leaseDownPayment,
      residualValue,
    } = leaseData;

    // Convert Rates
    var leaseSalesRate = leaseSalesTax / 100; // Divides by 100 to convert to percentage
    var interestRate_per = leaseInterestRate / 100;  // Divides by 100 to convert to percentage
    var residualValue_per = residualValue / 100;  // Divides by 100 to convert to percentage

    // Misc
    var residualAmount = leaseCarPrice * (residualValue_per);
    var deprecCost = leaseCarPrice - residualAmount;
    var monthlyDeprec = deprecCost / leaseTerm;
    var avgCarValue = (leaseCarPrice + residualValue_per) / 2;
    var moneyFactor = interestRate_per / 2400;
    var monthlyFinanceCharge = avgCarValue * moneyFactor;

    // Calculate Monthly Lease Payment
    const monthlyLease = monthlyDeprec + monthlyFinanceCharge

    // Calculate Sales Tax
    const lease_salesTax = (leaseCarPrice) * (leaseSalesRate);
    
    // Calculate Net Trade-In Amount
    const netTrade = (leaseTradeValue) - (leaseTradeOwed);

    // Calculate Total Lease Amount
    const totalLease = (leaseCarPrice) + (lease_salesTax) - (leaseDownPayment) - (netTrade);

    // Calculate Total Interest
    const leaseTotalInterest = totalLease + residualAmount - leaseCarPrice;

    // Calculate Total Interest
    const leaseTotalLoan = totalLease + leaseTotalInterest;

    return {
      monthlyLease,
      lease_salesTax,
      netTrade,
      totalLease,
      leaseTotalInterest,
      leaseTotalLoan
    };
  };

  // Calculation Variables
  // Finance
  const {
    salesTax,
    totalFinanced,
    monthlyPayment,
    totalLoan,
    totalInterest,
  } = calculatorType === "finance" ? calculateFinance() : {};

  // Affordability
  const {
    afford_salesTax,
    afford_totalLoan,
    afford_totalFinanced,
    afford_totalInterest,
    afford_carPrice,
  } = calculatorType === "affordability" ? calculateAffordability() : {};

  // Lease
  const {
    monthlyLease,
    lease_salesTax,
    netTrade,
    totalLease,
    leaseTotalInterest,
    leaseTotalLoan
  } = calculatorType === "lease" ? calculateLease() : {};

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
                <option value="60" selected>60</option>
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

    {/* Affordability Section */}
      {calculatorType === "affordability" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="preferredPayment">Preferred Monthly Payment</label>
            <input
              type="number"
              id="preferredPayment"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            <label htmlFor="affordInterestRate">Interest Rate</label>
            <input
              type="number"
              id="affordInterestRate"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            <label htmlFor="affordLoanTerm">Loan Term (months)</label>
              <select id="affordLoanTerm" value={affordabilityData.affordLoanTerm} onChange={(e) => handleInputChange(e, setAffordabilityData)}>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60" selected>60</option>
                <option value="72">72</option>
              </select>
            <label htmlFor="affordSalesTaxRate">Sales Tax Rate</label>
            <input
              type="number"
              id="affordSalesTaxRate"
              placeholder="0.0%"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            <label htmlFor="affordDownPayment">Down Payment</label>
            <input
              type="number"
              id="affordDownPayment"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            <label htmlFor="affordTradeValue">Trade-In Value</label>
            <input
              type="number"
              id="affordTradeValue"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
            <label htmlFor="affordTradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="affordTradeOwed"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setAffordabilityData)}
            />
          </div>
          {/* Affordability Results */}
          <div className="calculator-results">
            <h3>Est. Car Price</h3>
            <p><strong id="affordEstCarPrice">${afford_carPrice.toFixed(2)}</strong></p>
            <ul>
              <li>Preferred Payment: <span id="preferredDisplay">${affordabilityData.preferredPayment}/month</span></li>
              <li>Sales Tax: <span id="affordSalesTaxDisplay">${afford_salesTax.toFixed()}</span></li>
              <li>Down Payment: <span id="affordDownPaymentDisplay">${affordabilityData.affordDownPayment}</span></li>
              <li>Trade-In Value: <span id="affordTradeInDisplay">${affordabilityData.affordTradeValue}</span></li>
              <li>Amount Owed on Trade: <span id="affordTradeOwedDisplay">${affordabilityData.affordTradeOwed}</span></li>
              <li>Est. Total Financed: <span id="affordTotalFinanced">${afford_totalFinanced.toFixed()}</span></li>
              <li>Est. Total Interest: <span id="affordTotalInterest">${afford_totalInterest.toFixed()}</span></li>
              <li>Est. Total Loan: <span id="affordTotalLoan">${afford_totalLoan.toFixed()}</span></li>
            </ul>
          </div>
        </div>
      )}

    {/* Lease Section */}
      {calculatorType === "lease" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="leaseCarPrice">Car Price</label>
            <input
              type="number"
              id="leaseCarPrice"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseSalesTax">Sales Tax</label>
            <input
              type="number"
              id="leaseSalesTax"
              placeholder="0.0%"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseTerm">Lease Term (months)</label>
              <select id="leaseTerm" value={leaseData.leaseTerm} onChange={(e) => handleInputChange(e, setLeaseData)}>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60" selected>60</option>
                <option value="72">72</option>
              </select>
            <label htmlFor="leaseInterestRate">Interest Rate (APR)</label>
            <input
              type="number"
              id="leaseInterestRate"
              placeholder="0.0%"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseTradeValue">Trade-In Value</label>
            <input
              type="number"
              id="leaseTradeValue"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseTradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="leaseTradeOwed"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseDownPayment">Add'l Down Payment</label>
            <input
              type="number"
              id="leaseDownPayment"
              placeholder="$0"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="residualValue">Residual Value</label>
            <input
              type="number"
              id="residualValue"
              placeholder="62.0%"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
            <label htmlFor="leaseMiles">Miles Per Year</label>
            <input
              type="number"
              id="leaseMiles"
              placeholder="0"
              onChange={(e) => handleInputChange(e, setLeaseData)}
            />
          </div>
          {/* Lease Results */}
          <div className="calculator-results">
            <h3>Est. Monthly Lease Payment</h3>
            <p><strong id="leaseEstMonthlyPayment">${monthlyLease.toFixed(2)}/month</strong></p>
            <ul>
              <li>Car Price: <span id="leasePrice">${leaseData.leaseCarPrice}</span></li>
              <li>Sales Tax: <span id="leaseSalesDisplay">${lease_salesTax.toFixed(2)}</span></li>
              <li>Net Trade-In Amount: <span id="netTradeDisplay">${netTrade.toFixed(2)}</span></li>
              <li>Add'l Down Payment: <span id="leaseDownPaymentDisplay">${leaseData.leaseDownPayment.toFixed(2)}</span></li>
              <li>Est. Total Lease: <span id="leaseTotal">${totalLease.toFixed(2)}</span></li>
              <li>Est. Total Interest Paid: <span id="leaseTotalInterest">${leaseTotalInterest.toFixed(2)}</span></li>
              <li>Est. Total Loan: <span id="leaseTotalLoan">${leaseTotalLoan.toFixed(2)}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;

