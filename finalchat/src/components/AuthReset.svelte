<script>
	import { authHandlers, authStore } from '../stores/authStore';

	let action = '';
	let newEmail = '';
	let newPass = '';

	async function handleSubmit() {
		if (!action) {
			return;
		}

		if (action === 'updatePass') {
			return await authHandlers.updatePassword(newPass);
		}

		if (action === 'updateEmail') {
            console.log(newEmail)
			return await authHandlers.updateEmail(newEmail);
		}
	}
</script>

<div class="container">
	<div class="window">
		<div class="title-bar">
			<div class="title">Settings</div>
			<div class="controls">
				<button class="close">✕</button>
			</div>
		</div>
		<div class="window-content">
			<div class="action-buttons">
				<button
					class="option-btn {action === 'updateEmail' ? 'active' : ''}"
					on:click={() => {
						action = 'updateEmail';
					}}>Update Email</button
				>
				<button
					class="option-btn {action === 'updatePass' ? 'active' : ''}"
					on:click={() => {
						action = 'updatePass';
					}}>Update Password</button
				>
			</div>
			
			{#if action === 'updatePass'}
				<div class="form-container">
					<div class="input-group">
						<label>New Password:</label>
						<input bind:value={newPass} type="password" placeholder="New Password" />
					</div>
					<div class="button-group">
						<button class="submit-btn" on:click={handleSubmit}>OK</button>
						<button class="cancel-btn" on:click={() => action = ''}>Cancel</button>
					</div>
				</div>
			{/if}
			
			{#if action === 'updateEmail'}
				<div class="form-container">
					<div class="input-group">
						<label>New Email:</label>
						<input bind:value={newEmail} type="email" placeholder="New Email" />
					</div>
					<div class="button-group">
						<button class="submit-btn" on:click={handleSubmit}>OK</button>
						<button class="cancel-btn" on:click={() => action = ''}>Cancel</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #ffff99;
		font-family: 'Courier New', monospace;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 20px;
	}

	.window {
		background-color: #00dcd4;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		width: 320px;
		border-radius: 0;
		overflow: hidden;
	}

	.title-bar {
		background-color: #00dcd4;
		border-bottom: 2px solid #000;
		padding: 5px 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-weight: bold;
		font-size: 14px;
	}

	.controls {
		display: flex;
	}

	.close {
		background-color: #00dcd4;
		border: 1px solid #000;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 12px;
		padding: 0;
	}

	.window-content {
		padding: 15px;
	}

	.action-buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		margin-bottom: 15px;
	}

	.option-btn {
		background-color: #00dcd4;
		border: 2px solid #000;
		padding: 5px 10px;
		font-weight: bold;
		cursor: pointer;
		font-family: 'Courier New', monospace;
	}

	.option-btn.active, .option-btn:hover {
		background-color: #00bbb4;
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding-top: 10px;
		border-top: 2px dotted #000;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	label {
		font-size: 14px;
		font-weight: bold;
	}

	input {
		border: 2px solid #000;
		background-color: white;
		padding: 5px 10px;
		font-family: 'Courier New', monospace;
	}

	.button-group {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.submit-btn, .cancel-btn {
		background-color: #00dcd4;
		border: 2px solid #000;
		padding: 5px 20px;
		font-weight: bold;
		cursor: pointer;
		width: 100px;
		font-family: 'Courier New', monospace;
	}

	.submit-btn:hover, .cancel-btn:hover {
		background-color: #00bbb4;
	}
</style>