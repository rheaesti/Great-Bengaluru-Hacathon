<script>
    import { onMount, tick } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import './style.css';

    let messages = [];
    let inputText = "";
    let isTyping = false;
    let theme = "dark"; // Keeping theme functionality but both themes are retro now
    let userName = "USER";
    let botName = "CHAT-BOT";
    let showEmojis = false;
    let emojis = ["😊", "😂", "👍", "❤️", "🤔", "👀", "🎉", "🔥", "✨", "🙌"];
    
    // Animation settings
    let animationEnabled = true;
    
    // Message suggestions
    let suggestions = [
        "Loan Eligibility Check",
        "Financial Literacy Tips",
        "Document Uploader",
        "Loan Application Form"
    ];

    onMount(() => {
        // Welcome message
        setTimeout(() => {
            messages = [...messages, { 
                text: `WELCOME! I'M YOUR BANKING ASSISTANT. HOW CAN I HELP YOU TODAY?`, 
                sender: "bot" 
            }];
        }, 500);
    });

    async function sendMessage(text = inputText) {
        if (!text.trim()) return;

        // Add user message with animation
        messages = [...messages, { text, sender: "user", timestamp: new Date() }];
        let userMessage = text;
        inputText = "";
        isTyping = true;
        await tick();

        // Auto-scroll to bottom
        scrollToBottom();

        try {
            let res = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            let data = await res.json();
            
            // Simulate typing effect
            setTimeout(() => {
                isTyping = false;
                
                // Add bot response with timestamp
                messages = [...messages, { 
                    text: data.response, 
                    sender: "bot", 
                    timestamp: new Date() 
                }];
                
                tick().then(() => scrollToBottom());
            }, 1000); // Longer delay for retro feel
            
        } catch (error) {
            console.error("Error sending message:", error);
            isTyping = false;
            
            // Error message with retro styling
            messages = [...messages, { 
                text: "ERROR! CONNECTION FAILED. PLEASE TRY AGAIN LATER.", 
                sender: "bot", 
                isError: true,
                timestamp: new Date() 
            }];
            
            await tick();
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        setTimeout(() => {
            let chatContainer = document.querySelector(".chat-container");
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 100);
    }

    function toggleTheme() {
        theme = theme === "dark" ? "light" : "dark";
        // In our retro theme, both light and dark are similar
    }

    function addEmoji(emoji) {
        inputText += emoji;
        showEmojis = false;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function clearChat() {
        messages = [];
        // Add welcome message again with retro styling
        setTimeout(() => {
            messages = [...messages, { 
                text: `SYSTEM CLEARED! HOW MAY I ASSIST YOU?`, 
                sender: "bot" 
            }];
        }, 300);
    }
</script>

<div class="chat-app {theme}-theme">
    <div class="chat-header">
        <div class="logo">
            <span class="icon">💾</span>
            <h1>BANKING TERMINAL</h1>
        </div>
        <div class="controls">
            <button class="theme-toggle" on:click={toggleTheme}>
                {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button class="clear-chat" on:click={clearChat}>
                🗑️
            </button>
        </div>
    </div>

    <div class="chat-wrapper">
        <div class="chat-container">
            {#if messages.length === 0}
                <div class="empty-chat">
                    <div class="welcome" transition:scale>
                        <div class="welcome-icon">💻</div>
                        <h2>WELCOME TO BANK-OS v1.0</h2>
                        <p>INITIALIZING BANKING ASSISTANT...</p>
                        <div class="progress-bar">
                            <div class="progress-bar-filled" style="width: 35%;"></div>
                        </div>
                    </div>
                </div>
            {/if}
            
            {#each messages as msg, i (i)}
                <div 
                    class="message-wrapper {msg.sender}-wrapper"
                    in:fly={{y: 20, duration: animationEnabled ? 300 : 0, delay: animationEnabled ? 100 : 0}}
                >
                    <div class="avatar">
                        {msg.sender === "user" ? "👤" : "💾"}
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="sender-name">{msg.sender === "user" ? userName : botName}</span>
                            {#if msg.timestamp}
                                <span class="timestamp">{formatTime(msg.timestamp)}</span>
                            {/if}
                        </div>
                        <div class="message {msg.sender} {msg.isError ? 'error' : ''}" 
                             in:fade={{duration: animationEnabled ? 200 : 0}}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            {/each}

            {#if isTyping}
                <div class="message-wrapper bot-wrapper" in:fly={{y: 10, duration: 200}}>
                    <div class="avatar">💾</div>
                    <div class="typing-indicator">
                        <div class="typing-bubble"></div>
                        <div class="typing-bubble"></div>
                        <div class="typing-bubble"></div>
                    </div>
                </div>
            {/if}
        </div>

        {#if messages.length > 0 && messages.length < 3}
        <div class="suggestion-chips">
            {#each suggestions as suggestion}
                {#if suggestion === "Loan Eligibility Check"}
                    <button 
                        class="suggestion-chip"
                        on:click={() => window.location.href = '/Chatbot/popup'}
                        in:scale={{duration: 200, delay: 300, easing: backOut}}
                    >
                        {suggestion}
                    </button>
                {:else if suggestion === "Document Uploader"}
                    <button 
                        class="suggestion-chip"
                        on:click={() => window.location.href = '/Chatbot/Popups'}
                        in:scale={{duration: 200, delay: 300, easing: backOut}}
                    >
                        {suggestion}
                    </button>
                {:else if suggestion === "Loan Application Form"}
                    <button 
                        class="suggestion-chip"
                        on:click={() => window.location.href = '/Chatbot/Pops'}
                        in:scale={{duration: 200, delay: 300, easing: backOut}}
                    >
                        {suggestion}
                    </button>
                {:else}
                    <button 
                        class="suggestion-chip"
                        on:click={() => sendMessage(suggestion)}
                        in:scale={{duration: 200, delay: 300, easing: backOut}}
                    >
                        {suggestion}
                    </button>
                {/if}
            {/each}
        </div>
        {/if}

        <div class="input-container">
            <button class="emoji-button" on:click={() => showEmojis = !showEmojis}>
                😊
            </button>
            
            {#if showEmojis}
                <div class="emoji-picker" transition:scale={{duration: 150}}>
                    {#each emojis as emoji}
                        <button class="emoji" on:click={() => addEmoji(emoji)}>
                            {emoji}
                        </button>
                    {/each}
                </div>
            {/if}
            
            <input 
                bind:value={inputText} 
                on:keydown={(e) => e.key === 'Enter' && sendMessage()} 
                placeholder="TYPE YOUR MESSAGE..." 
            />
            <button class="send-button" on:click={sendMessage} disabled={!inputText.trim()}>
                <span class="send-icon">➤</span>
            </button>
        </div>
    </div>
</div>