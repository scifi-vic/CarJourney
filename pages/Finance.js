// src/pages/Finance.js
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import "./../styles/Finance.css";

// Payment Calculator
const Finance = () => {
  // Track the active tab
  const [tab, setTab] = useState("finance"); 

  // State for Finance Calculator
  const [financeData, setFinanceData] = useState({
    carPrice: '',
    interestRate: '',
    loanTerm: 60,
    salesTaxRate: '',
    downPayment: '',
    tradeValue: '',
    tradeOwed: '',
  });

  // State for Affordability Calculator
  const [affordabilityData, setAffordabilityData] = useState({
    preferredPayment: '',
    affordInterestRate: '',
    affordLoanTerm: 60,
    affordSalesTaxRate: '',
    affordDownPayment: '',
    affordTradeValue: '',
    affordTradeOwed: '',
  });

  // State for Lease Calculator
  const [leaseData, setLeaseData] = useState({
    leaseCarPrice: '',
    leaseSalesTax: '',
    leaseTerm: 60,
    leaseInterestRate: '',
    leaseTradeValue: '',
    leaseTradeOwed: '',
    leaseDownPayment: '',
    residualValue: '',
    leaseMiles: '',
  });

  // Handle results screen changes
  const [financeResults, setFinance] = useState(null); // Finance results
  const [affordabilityResults, setAffordability] = useState(null); // Affordability results
  const [leaseResults, setLease] = useState(null); // Lease results

  // Handle tab change
  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFinanceData((prev) => ({ ...prev, [id]: parseFloat(value)}));
    setAffordabilityData((prev) => ({ ...prev, [id]: parseFloat(value)}));
    setLeaseData((prev) => ({ ...prev, [id]: parseFloat(value)}));
  };

  // Calculate results for the Finance tab
  useEffect(() => {
    if (tab === "finance") {
      // Variables
      // Set variables to 0 if it's not a number, float, or integer
      const carPrice = parseFloat(financeData.carPrice || 0);
      const loanTerm = parseInt(financeData.loanTerm || 60);
      const downPayment = parseFloat(financeData.downPayment || 0);
      const tradeValue = parseFloat(financeData.tradeValue || 0);
      const tradeOwed = parseFloat(financeData.tradeOwed || 0);

      // Convert Rates
      const interestRate = parseFloat(financeData.interestRate || 0) / 100; // Divides by 100 to convert to percentage
      const salesRate = parseFloat(financeData.salesTaxRate || 0) / 100; // Divides by 100 to convert to percentage

      const monthlyRate = interestRate / 12;  // Interest rate per month

      /*  Calculate Sales Tax
          Sales Tax has its own formula apart from the Rate   */
      const salesTax = (carPrice) * (salesRate);

      /*  Calculate Total Finance  
              From: https://www.autotrader.com/car-payment-calculator   */
      const totalFinanced = carPrice + salesTax - downPayment - tradeValue + tradeOwed;

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

      // Save results to state
      setFinance ({
        monthlyPayment: monthlyPayment.toFixed(2), // Rounds to 2 decimal places
        carPrice: carPrice,
        salesTax: salesTax.toFixed(),
        downPayment: downPayment,
        tradeValue: tradeValue,
        tradeOwed: tradeOwed,
        totalFinanced: totalFinanced.toFixed(), // Round number
        totalInterest: totalInterest.toFixed(),
        totalLoan: totalLoan.toFixed(),
      });
    }
  }, [financeData, tab]); // Re-run calculations whenever financeData or tab changes

  // Calculate results for the Affordability tab
  useEffect(() => {
    if (tab === "affordability") {
      // Variables
      // Set variables to 0 if it's not a number, float, or integer
      const preferredPayment = parseFloat(affordabilityData.preferredPayment || 0);
      const affordLoanTerm = parseInt(affordabilityData.affordLoanTerm || 60);
      const affordDownPayment = parseFloat(affordabilityData.affordDownPayment || 0);
      const affordTradeValue = parseFloat(affordabilityData.affordTradeValue || 0);
      const affordTradeOwed = parseFloat(affordabilityData.affordTradeOwed || 0);

      // Convert Rates
      const affordInterestRate = parseFloat(affordabilityData.affordInterestRate || 0) / 100;  // Divides by 100 to convert to percentage
      const affordSalesTaxRate = parseFloat(affordabilityData.affordSalesTaxRate || 0) / 100;    // Divides by 100 to convert to percentage

      const monthlyRate = affordInterestRate / 12;  // Interest rate per month

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
      const afford_salesTax = (afford_totalFinanced) * (affordSalesTaxRate);

      // Calculate Total Interest
      const afford_totalInterest = (afford_totalLoan) - (afford_totalFinanced);

      // Calculate Estimated Car Price
      const afford_carPrice = (afford_totalFinanced) - (afford_salesTax) + (affordDownPayment) + (affordTradeValue) - (affordTradeOwed);

      // Save results to state
      setAffordability({
        afford_carPrice: afford_carPrice.toFixed(2),
        preferredPayment: preferredPayment,
        afford_salesTax: afford_salesTax.toFixed(),
        affordDownPayment: affordDownPayment,
        affordTradeValue: affordTradeValue,
        affordTradeOwed: affordTradeOwed,
        afford_totalFinanced: afford_totalFinanced.toFixed(),
        afford_totalInterest: afford_totalInterest.toFixed(),
        afford_totalLoan: afford_totalLoan.toFixed(),
      });
    }
  }, [affordabilityData, tab]); // Re-run calculations

  // Calculate results for the Lease tab
  useEffect(() => {
    if (tab === "lease") {
      // Variables
      // Set variables to 0 if it's not a number, float, or integer
      const leaseCarPrice = parseFloat(leaseData.leaseCarPrice || 0);
      const leaseTerm = parseInt(leaseData.leaseTerm || 60);
      const leaseTradeValue = parseFloat(leaseData.leaseTradeValue || 0);
      const leaseTradeOwed = parseFloat(leaseData.leaseTradeOwed || 0);
      const leaseDownPayment = parseFloat(leaseData.leaseDownPayment || 0);

      // Convert Rates
      const leaseInterestRate = parseFloat(leaseData.leaseInterestRate || 0) / 100;  // Divides by 100 to convert to percentage
      const leaseSalesRate = parseFloat(leaseData.leaseSalesTax || 0) / 100;    // Divides by 100 to convert to percentage
      const residualValue = parseFloat(leaseData.residualValue || 62.0) / 100;    // Divides by 100 to convert to percentage

      // Misc
      var residualAmount = leaseCarPrice * (residualValue);
      var deprecCost = leaseCarPrice - residualAmount;
      var monthlyDeprec = deprecCost / leaseTerm;
      var avgCarValue = (leaseCarPrice + residualValue) / 2;
      var moneyFactor = leaseInterestRate / 2400;
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

      // Save results to state
      setLease({
        monthlyLease: monthlyLease.toFixed(2),
        leaseCarPrice: leaseCarPrice,
        lease_salesTax: lease_salesTax.toFixed(2),
        netTrade: netTrade.toFixed(2),
        leaseDownPayment: leaseDownPayment.toFixed(2),
        totalLease: totalLease.toFixed(2),
        leaseTotalInterest: leaseTotalInterest.toFixed(2),
        leaseTotalLoan: leaseTotalLoan.toFixed(2),
      });
    }
  }, [leaseData, tab]); // Re-run calculations

  // HTML Portion
  return (
    // Handle tabs
    <div className="calculator-section">
      <h2>Car Loan Calculators</h2>
      <p>Choose a calculator to estimate your car payment options:</p>
      <div className="tabs">
        <button
          className={tab === "finance" ? "active" : ""}
          onClick={() => handleTabChange("finance")}
        >
          Finance
        </button>
        <button
          className={tab === "affordability" ? "active" : ""}
          onClick={() => handleTabChange("affordability")}
        >
          Affordability
        </button>
        <button
          className={tab === "lease" ? "active" : ""}
          onClick={() => handleTabChange("lease")}
        >
          Lease
        </button>
      </div>

    {/* Finance Section */}
      {tab === "finance" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="carPrice">Car Price</label>
            <input
              type="number"
              id="carPrice"
              placeholder="$0"
              value={financeData.carPrice}
              onChange={handleInputChange}
            />
            <label htmlFor="interestRate">Interest Rate</label>
            <input
              type="number"
              id="interestRate"
              placeholder="$0"
              value={financeData.interestRate}
              onChange={handleInputChange}
            />
            <label htmlFor="loanTerm">Loan Term (months)</label>
              <select id="loanTerm" value={financeData.loanTerm} onChange={handleInputChange}>
                <option value="12">12</option>
                <option value="24">24</option>
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
              value={financeData.salesTaxRate}
              onChange={handleInputChange}
            />
            <label htmlFor="downPayment">Down Payment</label>
            <input
              type="number"
              id="downPayment"
              placeholder="$0"
              value={financeData.downPayment}
              onChange={handleInputChange}
            />
            <label htmlFor="tradeValue">Trade-In Value</label>
            <input
              type="number"
              id="tradeValue"
              placeholder="$0"
              value={financeData.tradeValue}
              onChange={handleInputChange}
            />
            <label htmlFor="tradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="tradeOwed"
              placeholder="$0"
              value={financeData.tradeOwed}
              onChange={handleInputChange}
            />
          </div>
          {/* Finance Results */}
          {tab === "finance" && financeResults && (
            <div className="calculator-results">
              <h3>Est. Monthly Payment</h3>
              <p><strong id="financeMonthlyPayment">${financeResults.monthlyPayment}/month</strong></p>
              <ul>
                <li>Car Price: <span id="price">${financeResults.carPrice}</span></li>
                <li>Sales Tax: <span id="salesTax">${financeResults.salesTax}</span></li>
                <li>Down Payment: <span id="downPaymentDisplay">${financeResults.downPayment}</span></li>
                <li>Trade-In Value: <span id="tradeInDisplay">${financeResults.tradeValue}</span></li>
                <li>Amount Owed on Trade: <span id="amountOwedDisplay">${financeResults.tradeOwed}</span></li>
                <li>Est. Total Financed: <span id="totalFinancedDisplay">${financeResults.totalFinanced}</span></li>
                <li>Est. Total Interest: <span id="totalInterest">${financeResults.totalInterest}</span></li>
                <li>Est. Total Loan: <span id="totalLoan">${financeResults.totalLoan}</span></li>
              </ul>
            </div>
          )}
        </div>
      )}

    {/* Affordability Section */}
      {tab === "affordability" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="preferredPayment">Preferred Monthly Payment</label>
            <input
              type="number"
              id="preferredPayment"
              placeholder="$0"
              value={affordabilityData.preferredPayment}
              onChange={handleInputChange}
            />
            <label htmlFor="affordInterestRate">Interest Rate</label>
            <input
              type="number"
              id="affordInterestRate"
              placeholder="$0"
              value={affordabilityData.affordInterestRate}
              onChange={handleInputChange}
            />
            <label htmlFor="affordLoanTerm">Loan Term (months)</label>
              <select id="affordLoanTerm" value={affordabilityData.affordLoanTerm} onChange={handleInputChange}>
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
              value={affordabilityData.affordSalesTaxRate}
              onChange={handleInputChange}
            />
            <label htmlFor="affordDownPayment">Down Payment</label>
            <input
              type="number"
              id="affordDownPayment"
              placeholder="$0"
              value={affordabilityData.affordDownPayment}
              onChange={handleInputChange}
            />
            <label htmlFor="affordTradeValue">Trade-In Value</label>
            <input
              type="number"
              id="affordTradeValue"
              placeholder="$0"
              value={affordabilityData.affordTradeValue}
              onChange={handleInputChange}
            />
            <label htmlFor="affordTradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="affordTradeOwed"
              placeholder="$0"
              value={affordabilityData.affordTradeOwed}
              onChange={handleInputChange}
            />
          </div>
          {/* Affordability Results */}
          {tab === "affordability" && affordabilityResults && (
            <div className="calculator-results">
              <h3>Est. Car Price</h3>
              <p><strong id="affordEstCarPrice">${affordabilityResults.afford_carPrice}</strong></p>
              <ul>
                <li>Preferred Payment: <span id="preferredDisplay">${affordabilityResults.preferredPayment}/month</span></li>
                <li>Sales Tax: <span id="affordSalesTaxDisplay">${affordabilityResults.afford_salesTax}</span></li>
                <li>Down Payment: <span id="affordDownPaymentDisplay">${affordabilityResults.affordDownPayment}</span></li>
                <li>Trade-In Value: <span id="affordTradeInDisplay">${affordabilityResults.affordTradeValue}</span></li>
                <li>Amount Owed on Trade: <span id="affordTradeOwedDisplay">${affordabilityResults.affordTradeOwed}</span></li>
                <li>Est. Total Financed: <span id="affordTotalFinanced">${affordabilityResults.afford_totalFinanced}</span></li>
                <li>Est. Total Interest: <span id="affordTotalInterest">${affordabilityResults.afford_totalInterest}</span></li>
                <li>Est. Total Loan: <span id="affordTotalLoan">${affordabilityResults.afford_totalLoan}</span></li>
              </ul>
            </div>
          )}
        </div>
      )}

    {/* Lease Section */}
      {tab === "lease" && (
        <div className="calculator-form">
          <div className="calculator-inputs">
            <label htmlFor="leaseCarPrice">Car Price</label>
            <input
              type="number"
              id="leaseCarPrice"
              placeholder="$0"
              value={leaseData.leaseCarPrice}
              onChange={handleInputChange}
            />
            <label htmlFor="leaseSalesTax">Sales Tax</label>
            <input
              type="number"
              id="leaseSalesTax"
              placeholder="0.0%"
              value={leaseData.leaseSalesTax}
              onChange={handleInputChange}
            />
            <label htmlFor="leaseTerm">Lease Term (months)</label>
              <select id="leaseTerm" value={leaseData.leaseTerm} onChange={handleInputChange}>
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
              value={leaseData.leaseInterestRate}
              onChange={handleInputChange}
            />
            <label htmlFor="leaseTradeValue">Trade-In Value</label>
            <input
              type="number"
              id="leaseTradeValue"
              placeholder="$0"
              value={leaseData.leaseTradeValue}
              onChange={handleInputChange}
            />
            <label htmlFor="leaseTradeOwed">Amount Owed on Trade</label>
            <input
              type="number"
              id="leaseTradeOwed"
              placeholder="$0"
              value={leaseData.leaseTradeOwed}   
              onChange={handleInputChange}      
            />
            <label htmlFor="leaseDownPayment">Add'l Down Payment</label>
            <input
              type="number"
              id="leaseDownPayment"
              placeholder="$0"
              value={leaseData.leaseDownPayment}
              onChange={handleInputChange}
            />
            <label htmlFor="residualValue">Residual Value</label>
            <input
              type="number"
              id="residualValue"
              placeholder="62.0%"
              value={leaseData.residualValue}
              onChange={handleInputChange}
            />
            <label htmlFor="leaseMiles">Miles Per Year</label>
            <input
              type="number"
              id="leaseMiles"
              placeholder="0"
              value={leaseData.leaseMiles}
              onChange={handleInputChange}
            />
          </div>
          {/* Lease Results */}
          {tab === "lease" && leaseResults && (
            <div className="calculator-results">
              <h3>Est. Monthly Lease Payment</h3>
              <p><strong id="leaseEstMonthlyPayment">${leaseResults.monthlyLease}/month</strong></p>
              <ul>
                <li>Car Price: <span id="leasePrice">${leaseResults.leaseCarPrice}</span></li>
                <li>Sales Tax: <span id="leaseSalesDisplay">${leaseResults.lease_salesTax}</span></li>
                <li>Net Trade-In Amount: <span id="netTradeDisplay">${leaseResults.netTrade}</span></li>
                <li>Add'l Down Payment: <span id="leaseDownPaymentDisplay">${leaseResults.leaseDownPayment}</span></li>
                <li>Est. Total Lease: <span id="leaseTotal">${leaseResults.totalLease}</span></li>
                <li>Est. Total Interest Paid: <span id="leaseTotalInterest">${leaseResults.leaseTotalInterest}</span></li>
                <li>Est. Total Loan: <span id="leaseTotalLoan">${leaseResults.leaseTotalLoan}</span></li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Finance;

