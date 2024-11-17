// src/pages/Finance.js
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import "./../styles/Finance.css";

const Finance = () => {
  // States for form inputs
  const [carPrice, setCarPrice] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState(60);
  const [salesTaxRate, setSalesTaxRate] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tradeValue, setTradeValue] = useState('');
  const [tradeOwed, setTradeOwed] = useState('');

  // State for displaying results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalFinanced, setTotalFinanced] = useState(0);

  // Calculation function
  const calculateFinance = () => {
    const price = parseFloat(carPrice) || 0;
    const rate = parseFloat(interestRate) / 100 / 12 || 0;
    const term = parseInt(loanTerm);
    const taxRate = parseFloat(salesTaxRate) / 100 || 0;
    const down = parseFloat(downPayment) || 0;
    const tradeIn = parseFloat(tradeValue) || 0;
    const tradeOwe = parseFloat(tradeOwed) || 0;

    const totalLoan = price - down - tradeIn + tradeOwe + (price * taxRate);
    setTotalFinanced(totalLoan);

    if (rate > 0) {
      const monthly = (totalLoan * rate) / (1 - Math.pow(1 + rate, -term));
      setMonthlyPayment(monthly.toFixed(2));
      setTotalInterest((monthly * term - totalLoan).toFixed(2));
    } else {
      const monthly = totalLoan / term;
      setMonthlyPayment(monthly.toFixed(2));
      setTotalInterest(0);
    }
  };

  return (
    <div>

      {/* Main Content */}
      <main>
        <section className="calculator-section">
          <h2>Car Loan Calculators</h2>
          <p>Choose a calculator to estimate your car payment options:</p>

          {/* Finance Calculator */}
          <div id="finance-calculator" className="calculator-form">
            <div className="calculator-inputs">
              <label htmlFor="carPrice">Car Price</label>
              <input type="number" id="carPrice" placeholder="$0" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} />

              <label htmlFor="interestRate">Interest Rate</label>
              <input type="number" id="interestRate" placeholder="0.0%" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />

              <label htmlFor="loanTerm">Loan Term (months)</label>
              <select id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)}>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60">60</option>
                <option value="72">72</option>
              </select>

              <label htmlFor="salesTaxRate">Sales Tax Rate</label>
              <input type="number" id="salesTaxRate" placeholder="0.0%" value={salesTaxRate} onChange={(e) => setSalesTaxRate(e.target.value)} />

              <label htmlFor="downPayment">Down Payment</label>
              <input type="number" id="downPayment" placeholder="$0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />

              <label htmlFor="tradeValue">Trade-In Value</label>
              <input type="number" id="tradeValue" placeholder="$0" value={tradeValue} onChange={(e) => setTradeValue(e.target.value)} />

              <label htmlFor="tradeOwed">Amount Owed on Trade</label>
              <input type="number" id="tradeOwed" placeholder="$0" value={tradeOwed} onChange={(e) => setTradeOwed(e.target.value)} />
            </div>

            <div className="calculator-results">
              <h3>Est. Monthly Payment</h3>
              <ul>
                <li>Car Price: <span id="price">${carPrice || 0}</span></li>
                <li>Sales Tax: <span id="salesTax">${(parseFloat(carPrice) * (salesTaxRate / 100)).toFixed(2) || 0}</span></li>
                <li>Down Payment: <span id="downPaymentDisplay">${downPayment || 0}</span></li>
                <li>Trade-In Value: <span id="tradeInDisplay">${tradeValue || 0}</span></li>
                <li>Amount Owed on Trade: <span id="amountOwedDisplay">${tradeOwed || 0}</span></li>
                <li>Est. Total Financed: <span id="totalFinancedDisplay">${totalFinanced || 0}</span></li>
                <li>Est. Total Interest: <span id="totalInterest">${totalInterest || 0}</span></li>
                <li>Est. Monthly Payment: <span id="monthlyPayment">${monthlyPayment || 0}</span></li>
              </ul>
            </div>

          </div>
        </section>
      </main>

    </div>
  );
};

export default Finance;
