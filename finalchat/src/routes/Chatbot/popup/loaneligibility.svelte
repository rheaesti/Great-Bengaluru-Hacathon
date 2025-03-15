<script>
  import { onMount } from 'svelte';
  
  // Form data
  let loanData = {
    "Loan_ID": "LP001234",
    "ApplicantIncome": 50000,
    "CoapplicantIncome": 20000,
    "LoanAmount": 150,
    "Loan_Amount_Term": 360,
    "Credit_History": 1.0,
    "Married": "Yes",
    "Education": "Graduate",
    "Property_Area": "Urban",
    "Loan_Type": "Home Loan"
  };
  
  // Validation and options
  const propertyAreaOptions = ["Urban", "Semi-Urban", "Rural"];
  const educationOptions = ["Graduate", "Non-Graduate"];
  const creditHistoryOptions = [1.0, 0.0];
  const marriedOptions = ["Yes", "No"];
  const loanTypeOptions = ["Home Loan", "Personal Loan", "Education Loan", "Car Loan", "Business Loan"];
  
  // Results
  let showResults = false;
  let eligible = false;
  let interestRate = 0;
  let monthlyPayment = 0;
  let processing = false;
  
  // Window states
  let minimized = false;
  let isOpen = true;
  
  // Generate a new loan ID
  function generateLoanId() {
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    loanData.Loan_ID = `LP${randomNum}`;
  }
  
  // Fixed position at top
  let offsetX = 0;
  let offsetY = 0;
  
  function positionWindowAtTop() {
    const windowWidth = 440;
    
    // Center horizontally, fix at top vertically with small margin
    offsetX = Math.max(0, (window.innerWidth - windowWidth) / 2);
    offsetY = 20; // Fixed at top with 20px margin
  }
  
  // Window controls
  function toggleMinimize() {
    minimized = !minimized;
  }
  
  function closeWindow() {
    isOpen = false;
  }
  
  // Calculate loan eligibility
  function calculateEligibility() {
    processing = true;
    
    // Simulate processing delay for retro feel
    setTimeout(() => {
      // Calculate total income
      const totalIncome = loanData.ApplicantIncome + loanData.CoapplicantIncome;
      
      // Calculate loan amount in thousands
      const loanAmountInThousands = loanData.LoanAmount;
      
      // Credit history factor
      const creditFactor = loanData.Credit_History === 1.0 ? 1 : 0.4;
      
      // Education factor
      const educationFactor = loanData.Education === "Graduate" ? 1 : 0.9;
      
      // Property area factor
      let propertyFactor = 1;
      switch(loanData.Property_Area) {
        case "Urban": propertyFactor = 1; break;
        case "Semi-Urban": propertyFactor = 0.95; break;
        case "Rural": propertyFactor = 0.9; break;
      }
      
      // Loan type factor
      let loanTypeFactor = 1;
      let baseInterestRate = 8.5;
      
      switch(loanData.Loan_Type) {
        case "Home Loan": 
          loanTypeFactor = 1.1;
          baseInterestRate = 8.0;
          break;
        case "Personal Loan": 
          loanTypeFactor = 0.85;
          baseInterestRate = 9.5;
          break;
        case "Education Loan": 
          loanTypeFactor = 1.05;
          baseInterestRate = 7.5;
          break;
        case "Car Loan": 
          loanTypeFactor = 0.95;
          baseInterestRate = 8.5;
          break;
        case "Business Loan": 
          loanTypeFactor = 0.9;
          baseInterestRate = 9.0;
          break;
      }
      
      // Calculate income to loan ratio
      const incomeToLoanRatio = totalIncome / (loanAmountInThousands * 1000);
      
      // Calculate eligibility score
      const eligibilityScore = incomeToLoanRatio * creditFactor * educationFactor * propertyFactor * loanTypeFactor;
      
      // Determine eligibility
      eligible = eligibilityScore > 0.5 && loanData.Credit_History === 1.0;
      
      // Determine interest rate
      if (eligible) {
        interestRate = baseInterestRate - (eligibilityScore * 1.5);
        interestRate = Math.max(6.0, Math.min(interestRate, 12.0));
      } else {
        interestRate = baseInterestRate + 4.0;
      }
      
      // Calculate monthly payment
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanData.Loan_Amount_Term;
      monthlyPayment = (loanAmountInThousands * 1000) * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      showResults = true;
      processing = false;
    }, 1500);
  }
  
  onMount(() => {
    // Generate a new loan ID on component mount
    generateLoanId();
    
    // Position the window at top
    positionWindowAtTop();
    
    // Reposition on window resize
    window.addEventListener('resize', positionWindowAtTop);
    
    return () => {
      window.removeEventListener('resize', positionWindowAtTop);
    };
  });
</script>

{#if isOpen}
<div 
  class="window-container"
  style="transform: translate({offsetX}px, {offsetY}px)"
>
  <div class="window" class:minimized>
    <div class="title-bar">
      <div class="title-text">Loan Eligibility Calculator</div>
      <div class="window-controls">
        <button class="control-button minimize" on:click={toggleMinimize}>_</button>
        <button class="control-button close" on:click={closeWindow}>×</button>
      </div>
    </div>
    
    {#if !minimized}
      <div class="window-content">
        {#if !showResults}
          <div class="form-container">
            <div class="form-group">
              <label for="loanId">Loan ID:</label>
              <div class="readonly-field">
                <input 
                  type="text" 
                  id="loanId" 
                  bind:value={loanData.Loan_ID} 
                  readonly
                >
                <button class="btn btn-small" on:click={generateLoanId}>New</button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="loanType">Loan Type:</label>
              <select id="loanType" bind:value={loanData.Loan_Type} class="dropdown-select">
                {#each loanTypeOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            </div>
            
            <div class="form-group">
              <label for="applicantIncome">Applicant Income:</label>
              <input 
                type="number" 
                id="applicantIncome" 
                bind:value={loanData.ApplicantIncome} 
                min="0" 
                step="1000"
              >
            </div>
            
            <div class="form-group">
              <label for="coapplicantIncome">Co-applicant Income:</label>
              <input 
                type="number" 
                id="coapplicantIncome" 
                bind:value={loanData.CoapplicantIncome} 
                min="0" 
                step="1000"
              >
            </div>
            
            <div class="form-group">
              <label for="loanAmount">Loan Amount (thousands):</label>
              <input 
                type="number" 
                id="loanAmount" 
                bind:value={loanData.LoanAmount} 
                min="0" 
                step="10"
              >
            </div>
            
            <div class="form-group">
              <label for="loanTerm">Loan Term (months):</label>
              <select id="loanTerm" bind:value={loanData.Loan_Amount_Term} class="dropdown-select">
                <option value="120">120 months (10 years)</option>
                <option value="180">180 months (15 years)</option>
                <option value="240">240 months (20 years)</option>
                <option value="300">300 months (25 years)</option>
                <option value="360">360 months (30 years)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="creditHistory">Credit History:</label>
              <div class="radio-group">
                {#each creditHistoryOptions as option}
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="creditHistory" 
                      value={option} 
                      bind:group={loanData.Credit_History}
                    >
                    <span>{option === 1.0 ? "Good (1.0)" : "Poor (0.0)"}</span>
                  </label>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label for="married">Married:</label>
              <div class="radio-group">
                {#each marriedOptions as option}
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="married" 
                      value={option} 
                      bind:group={loanData.Married}
                    >
                    <span>{option}</span>
                  </label>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label for="education">Education:</label>
              <div class="radio-group">
                {#each educationOptions as option}
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="education" 
                      value={option} 
                      bind:group={loanData.Education}
                    >
                    <span>{option}</span>
                  </label>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label for="propertyArea">Property Area:</label>
              <select id="propertyArea" bind:value={loanData.Property_Area} class="dropdown-select">
                {#each propertyAreaOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            </div>
            
            <div class="button-container">
              <button class="btn btn-primary" on:click={calculateEligibility}>Calculate Eligibility</button>
              <button class="btn btn-secondary" on:click={closeWindow}>Cancel</button>
            </div>
          </div>
        {:else if processing}
          <div class="processing">
            <div class="dialog-window">
              <div class="dialog-title">Processing...</div>
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="progress-text">Calculating loan eligibility...</div>
              </div>
            </div>
          </div>
        {:else}
          <div class="results-container">
            <div class="dialog-window">
              <div class="dialog-title">Loan Eligibility Results</div>
              
              <div class="result-icon">
                {#if eligible}
                  <div class="icon-success">✓</div>
                {:else}
                  <div class="icon-error">×</div>
                {/if}
              </div>
              
              <div class="result-message">
                {#if eligible}
                  <h3>Congratulations!</h3>
                  <p>Your {loanData.Loan_Type} application has been pre-approved.</p>
                {:else}
                  <h3>We're Sorry!</h3>
                  <p>Your {loanData.Loan_Type} application cannot be approved at this time.</p>
                {/if}
              </div>
              
              <div class="result-details">
                <div class="detail-row">
                  <div class="detail-label">Loan ID:</div>
                  <div class="detail-value">{loanData.Loan_ID}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Loan Type:</div>
                  <div class="detail-value">{loanData.Loan_Type}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Loan Amount:</div>
                  <div class="detail-value">${(loanData.LoanAmount * 1000).toLocaleString()}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Loan Term:</div>
                  <div class="detail-value">{loanData.Loan_Amount_Term} months</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Interest Rate:</div>
                  <div class="detail-value">{interestRate.toFixed(2)}%</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Monthly Payment:</div>
                  <div class="detail-value">${monthlyPayment.toFixed(2)}</div>
                </div>
                {#if !eligible}
                <div class="detail-row rejection-reason">
                  <div class="detail-label">Possible reasons:</div>
                  <div class="detail-value">
                    {#if loanData.Credit_History === 0.0}
                      Poor credit history
                    {:else if loanData.Loan_Type === "Personal Loan" || loanData.Loan_Type === "Business Loan"}
                      Higher requirements for {loanData.Loan_Type}s
                    {:else}
                      Insufficient income for requested loan amount
                    {/if}
                  </div>
                </div>
                {/if}
              </div>
              
              <div class="button-container">
                <button class="btn btn-primary" on:click={() => showResults = false}>Try Again</button>
                <button class="btn btn-secondary" on:click={closeWindow}>Close</button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
:global(body) {
  font-family: "MS Sans Serif", Arial, sans-serif;
  background-color: #ffffc8;
  margin: 0;
  padding: 0;
}

.window-container {
  position: fixed;
  z-index: 1000;
  user-select: none;
}

.window {
  width: 440px;
  background-color: #c0c0c0;
  border: 3px outset #dcdcdc;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

.window.minimized {
  height: auto;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #00c8c8;
  color: black;
  padding: 4px 8px;
  cursor: default;
  font-weight: bold;
  border-bottom: 1px solid #008080;
}

.title-text {
  flex-grow: 1;
}

.window-controls {
  display: flex;
}

.control-button {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c0c0c0;
  border: 2px outset #dcdcdc;
  cursor: pointer;
}

.control-button:active {
  border-style: inset;
}

.window-content {
  padding: 16px;
  background-color: #c0c0c0;
  height: auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 4px;
  font-weight: bold;
}

input, select {
  padding: 6px;
  font-family: inherit;
  border: 2px inset #a0a0a0;
  background-color: white;
}

.dropdown-select {
  appearance: none;
  background-color: white;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px;
}

.readonly-field {
  display: flex;
  gap: 8px;
}

.readonly-field input {
  flex-grow: 1;
  background-color: #e8e8e8;
}

.btn-small {
  padding: 2px 8px;
  font-size: 12px;
  background-color: #c0c0c0;
  border: 2px outset #dcdcdc;
  cursor: pointer;
}

.btn-small:active {
  border-style: inset;
}

.radio-group {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.radio-label input {
  margin: 0;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.btn {
  padding: 6px 16px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  min-width: 80px;
  border: 2px outset #dcdcdc;
}

.btn-primary {
  background-color: #00c8c8;
  color: black;
}

.btn-secondary {
  background-color: #c0c0c0;
  color: black;
}

.btn:active {
  border-style: inset;
}

.processing {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dialog-window {
  background-color: #c0c0c0;
  border: 2px outset #dcdcdc;
  padding: 8px;
  width: 100%;
}

.dialog-title {
  background-color: #00c8c8;
  color: black;
  padding: 4px 8px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background-color: white;
  border: 2px inset #a0a0a0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #00c8c8;
  width: 0%;
  animation: progress 1.5s linear forwards;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.progress-text {
  font-size: 14px;
}

.results-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.result-icon {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.icon-success {
  width: 48px;
  height: 48px;
  background-color: #00c8c8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.icon-error {
  width: 48px;
  height: 48px;
  background-color: #ff6c6c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.result-message {
  text-align: center;
  margin-bottom: 16px;
}

.result-message h3 {
  margin: 0 0 8px 0;
}

.result-message p {
  margin: 0;
}

.result-details {
  background-color: white;
  border: 2px inset #a0a0a0;
  padding: 12px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: bold;
  min-width: 120px;
}

.detail-value {
  text-align: right;
  max-width: calc(100% - 130px);
  word-break: break-word;
}

.rejection-reason {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #a0a0a0;
  color: #cc0000;
}

/* Responsive adjustments for different desktop sizes */
@media (min-width: 768px) and (max-width: 1200px) {
  .window {
    width: 440px;
    max-width: 90vw;
  }
}

@media (max-width: 767px) {
  .window {
    width: calc(100vw - 20px);
    max-width: 440px;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-value {
    text-align: left;
    max-width: 100%;
  }
}
</style>