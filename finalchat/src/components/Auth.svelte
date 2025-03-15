<script>
	import { authHandlers, authStore } from '../Stores/authstore.js';

	let register = false;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let phoneNumber = '';  
	let userName = '';     
	let processing = false;
	let errorMessage = '';

	async function handleSubmit() {
		if (!email || !password || (register && !confirmPassword) || (register && !phoneNumber) || (register && !userName)) {
			errorMessage = 'ERROR!!! All fields required';
			return;
		}

		if (register && password !== confirmPassword) {
			errorMessage = 'ERROR!!! Passwords do not match';
			return;
		}

		processing = true;
		errorMessage = '';
		
		try {
			if (register) {
				// Pass additional fields to signup function
				await authHandlers.signup(email, password, userName, phoneNumber);
			} else {
				await authHandlers.login(email, password);
			}
			
			if ($authStore.currentUser) {
				window.location.href = '/Chatbot';
			} else {
				errorMessage = 'ERROR!!! Authentication failed';
			}
		} catch (err) {
			console.log(err);
			errorMessage = `ERROR!!! ${err.message || 'Something went wrong'}`;
		} finally {
			processing = false;
		}
	}
</script>

<div class="container">
	<div class="bank-header">
		<div class="bank-logo">
			<div class="bank-icon">🏦</div>
			<div class="bank-text">BANK TERMINAL</div>
		</div>
	</div>

	<div class="window">
		<div class="title-bar">
			<div class="title-dots">
				{#each Array(20) as _, i}
					<span class="dot">·</span>
				{/each}
			</div>
			<div class="title">{register ? 'NEW ACCOUNT' : 'ACCESS TERMINAL'}</div>
			<div class="title-dots">
				{#each Array(20) as _, i}
					<span class="dot">·</span>
				{/each}
			</div>
			<div class="controls">
				<button class="control minimize">_</button>
				<button class="control maximize">□</button>
				<button class="control close">✕</button>
			</div>
		</div>

		<div class="window-content">
			{#if errorMessage}
				<div class="error-box">
					<div class="error-icon">⚠️</div>
					<div class="error-message">{errorMessage}</div>
					<button class="error-close" on:click={() => errorMessage = ''}>OK</button>
				</div>
			{/if}

			{#if processing}
				<div class="processing-box">
					<div class="processing-title">PLEASE WAIT...</div>
					<div class="progress-bar">
						<div class="progress-fill"></div>
					</div>
					<div class="processing-text">PROCESSING REQUEST</div>
				</div>
			{:else}
				<form on:submit|preventDefault={handleSubmit}>
					{#if register}
						<div class="input-group">
							<label>User Name:</label>
							<input bind:value={userName} type="text" placeholder="Enter Full Name" />
						</div>
					{/if}
					
					<div class="input-group">
						<label>User Email:</label>
						<input bind:value={email} type="email" placeholder="Enter Email Address" />
					</div>
					
					{#if register}
						<div class="input-group">
							<label>Phone Number:</label>
							<input bind:value={phoneNumber} type="tel" placeholder="Enter Phone Number" />
						</div>
					{/if}
					
					<div class="input-group">
						<label>Password:</label>
						<input bind:value={password} type="password" placeholder="Enter Secure Password" />
					</div>
					
					{#if register}
						<div class="input-group">
							<label>CONFIRM:</label>
							<input bind:value={confirmPassword} type="password" placeholder="Verify Secure Password" />
						</div>
					{/if}
					
					<div class="button-row">
						<button type="submit" class="action-btn">SUBMIT</button>
					</div>
				</form>
				
				<div class="action-buttons">
					{#if register}
						<button type="button" class="link-btn" on:click={() => { register = false; }}>
							→ EXISTING ACCOUNT LOGIN
						</button>
					{:else}
						<button type="button" class="link-btn" on:click={() => { register = true; }}>
							→ NEW ACCOUNT REGISTRATION
						</button>
						<button type="button" class="link-btn" on:click={() => authHandlers.resetPassword(email)}>
							→ PASSCODE RECOVERY
						</button>
					{/if}
				</div>
			{/if}
		</div>
		
		<div class="status-bar">
			<div class="status-item">SECURE CONNECTION</div>
			<div class="status-item blink">READY</div>
			<div class="status-item">V 1.0.5</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #ffff99;
		font-family: 'Courier New', monospace;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		width: 100%;
		padding: 2% 1%;
		box-sizing: border-box;
		gap: 2vh;
	}

	.bank-header {
		border: 0.3vw solid #000;
		background-color: white;
		width: 90%;
		max-width: 900px;
		height: 8vh;
		min-height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0.5vw 0.5vw 0 #000;
	}

	.bank-logo {
		display: flex;
		align-items: center;
		gap: 2%;
	}

	.bank-icon {
		font-size: clamp(16px, 4vw, 28px);
	}

	.bank-text {
		font-size: clamp(16px, 4vw, 28px);
		font-weight: bold;
		letter-spacing: 0.1vw;
	}

	.window {
		background-color: #00dcd4;
		border: 0.3vw solid #000;
		box-shadow: 0.5vw 0.5vw 0 #000;
		width: 90%;
		max-width: 900px;
		border-radius: 0;
		overflow: hidden;
	}

	.title-bar {
		background-color: #00dcd4;
		border-bottom: 0.2vw solid #000;
		padding: 1% 2%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.title-dots {
		display: flex;
		font-size: clamp(10px, 2vw, 16px);
		letter-spacing: -0.1vw;
		color: #000;
	}

	.title {
		font-weight: bold;
		font-size: clamp(12px, 2vw, 16px);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		background-color: #00dcd4;
		padding: 0 2%;
		z-index: 1;
		white-space: nowrap;
	}

	.controls {
		display: flex;
		gap: 0.5vw;
	}

	.control {
		background-color: #00dcd4;
		border: 0.1vw solid #000;
		width: clamp(16px, 2vw, 24px);
		height: clamp(16px, 2vw, 24px);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: clamp(8px, 1.5vw, 14px);
		padding: 0;
	}

	.window-content {
		padding: 3%;
	}

	.error-box {
		background-color: #ff9999;
		border: 0.2vw solid #ff0000;
		padding: 2%;
		margin-bottom: 3%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1vh;
	}

	.error-icon {
		font-size: clamp(16px, 4vw, 24px);
	}

	.error-message {
		font-weight: bold;
		text-align: center;
		font-size: clamp(12px, 2vw, 16px);
	}

	.error-close {
		background-color: #ff9999;
		border: 0.2vw solid #000;
		padding: 0.5vh 2vw;
		font-weight: bold;
		cursor: pointer;
		min-width: 20%;
	}

	.processing-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2vh;
		padding: 4% 0;
	}

	.processing-title {
		font-weight: bold;
		font-size: clamp(14px, 2.5vw, 18px);
	}

	.progress-bar {
		width: 100%;
		height: 3vh;
		min-height: 20px;
		border: 0.2vw solid #000;
		background-color: white;
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		position: absolute;
		height: 100%;
		width: 30%;
		background: repeating-linear-gradient(
			45deg,
			#00aaa4,
			#00aaa4 10px,
			#00dcd4 10px,
			#00dcd4 20px
		);
		animation: progress 2s infinite linear;
	}

	@keyframes progress {
		0% {
			left: -30%;
		}
		100% {
			left: 100%;
		}
	}

	.processing-text {
		font-size: clamp(10px, 1.5vw, 14px);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 2vh;
		width: 100%;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		width: 100%;
	}

	label {
		font-size: clamp(12px, 2vw, 16px);
		font-weight: bold;
	}

	input {
		border: 0.2vw solid #000;
		background-color: white;
		padding: 1vh 2%;
		width: 96%;
		font-family: 'Courier New', monospace;
		font-size: clamp(12px, 1.8vw, 16px);
	}

	.button-row {
		display: flex;
		justify-content: center;
		margin-top: 3vh;
		width: 100%;
	}

	.action-btn {
		background-color: #00dcd4;
		border: 0.2vw solid #000;
		padding: 1vh 0;
		font-weight: bold;
		cursor: pointer;
		font-family: 'Courier New', monospace;
		width: 50%;
		font-size: clamp(10px, 1.8vw, 14px);
		white-space: nowrap;
	}

	.action-btn:hover {
		background-color: #00bbb4;
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		margin-top: 3vh;
		border-top: 0.2vw dashed #000;
		padding-top: 3vh;
		width: 100%;
	}

	.link-btn {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: clamp(10px, 1.8vw, 14px);
		font-family: 'Courier New', monospace;
		padding: 0;
		text-align: left;
		font-weight: bold;
		width: 100%;
	}

	.status-bar {
		display: flex;
		justify-content: space-between;
		background-color: #000;
		color: #00ff00;
		padding: 1vh 2%;
		font-size: clamp(10px, 1.5vw, 12px);
	}

	.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% { opacity: 0; }
	}

	/* Media queries for better responsiveness */
	@media (max-width: 768px) {
		.bank-header {
			height: 7vh;
		}
		
		.bank-text {
			font-size: clamp(14px, 3.5vw, 24px);
		}
		
		.action-btn {
			width: 70%;
		}
		
		form {
			gap: 1.5vh;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 1%;
		}
		
		.bank-header {
			height: 6vh;
		}
		
		.title {
			font-size: clamp(10px, 3vw, 14px);
		}
		
		.controls {
			gap: 0.3vw;
		}
		
		.control {
			width: clamp(14px, 5vw, 20px);
			height: clamp(14px, 5vw, 20px);
		}
		
		form {
			gap: 1vh;
		}
		
		.input-group {
			gap: 0.5vh;
		}
	}

	@media (min-width: 1200px) {
		.bank-header, .window {
			width: 70%;
			max-width: 1200px;
		}
		
		.bank-header {
			height: 6vh;
		}
		
		input {
			padding: 0.8vh 1.5%;
			font-size: 16px;
		}
		
		.action-btn {
			font-size: 16px;
			width: 40%;
		}
	}

	@media (min-width: 1600px) {
		.bank-header, .window {
			width: 60%;
			max-width: 1400px;
		}
		
		.input-group {
			width: 80%;
			margin: 0 auto;
		}
		
		.bank-text {
			font-size: 28px;
		}
		
		.title {
			font-size: 18px;
		}
		
		label {
			font-size: 18px;
		}
		
		input {
			font-size: 18px;
			padding: 12px 2%;
		}
		
		.action-btn {
			font-size: 18px;
			padding: 12px 0;
			width: 30%;
		}
		
		.link-btn {
			font-size: 16px;
		}
	}

	/* Adjustments for different aspect ratios */
	@media (min-aspect-ratio: 16/9) {
		.container {
			padding: 1vh 2vw;
		}
		
		.bank-header {
			height: 10vh;
		}
		
		.window-content {
			padding: 2vh 3%;
		}
		
		form {
			gap: 1.5vh;
		}
	}

	/* Adjustments for very tall screens */
	@media (max-aspect-ratio: 9/16) {
		.container {
			padding: 5vh 2vw;
		}
		
		.gap-spacer {
			height: 4vh;
		}
		
		.input-group {
			margin-bottom: 1vh;
		}
	}

	/* Ultra-wide screen support */
	@media (min-width: 2000px) {
		.bank-header, .window {
			width: 50%;
			max-width: 1800px;
		}
		
		.bank-text {
			font-size: 32px;
		}
		
		.title {
			font-size: 20px;
		}
		
		.window-content {
			padding: 30px 5%;
		}
		
		.input-group {
			width: 70%;
			margin: 0 auto;
		}
		
		.action-btn {
			width: 25%;
			font-size: 20px;
		}
	}

	/* Print styles */
	@media print {
		.container {
			height: auto;
			padding: 5mm;
		}
		
		.bank-header, .window {
			width: 100%;
			max-width: none;
			box-shadow: none;
			border: 0.5mm solid #000;
		}
		
		.controls {
			display: none;
		}
	}
</style>