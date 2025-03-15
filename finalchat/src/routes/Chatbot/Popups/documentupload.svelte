<script>
  // States for tracking uploads
  let aadharFile = null;
  let panFile = null;
  let aadharPreview = '';
  let panPreview = '';
  let isUploading = false;
  let uploadProgress = 0;
  let showSuccess = false;
  let errorMessage = '';
  
  // Handle Aadhar file selection
  function handleAadharChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    aadharFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      aadharPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  // Handle PAN file selection
  function handlePanChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    panFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      panPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  // Submit the files
  function handleSubmit() {
    if (!aadharFile && !panFile) {
      errorMessage = "Please upload at least one document";
      return;
    }
    
    errorMessage = "";
    isUploading = true;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      uploadProgress += 5;
      if (uploadProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          isUploading = false;
          showSuccess = true;
        }, 500);
      }
    }, 200);
  }
  
  // Reset the form
  function resetForm() {
    aadharFile = null;
    panFile = null;
    aadharPreview = '';
    panPreview = '';
    isUploading = false;
    uploadProgress = 0;
    showSuccess = false;
    errorMessage = '';
  }
</script>

<main>
  <div class="title-bar">
    <div class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <h1>DOCUMENT UPLOADER</h1>
    <div class="close-btn">✕</div>
  </div>
  
  {#if showSuccess}
    <div class="window success-window">
      <div class="window-header">
        <div class="title">Success!</div>
        <div class="close-btn" on:click={resetForm}>✕</div>
      </div>
      <div class="window-content">
        <div class="icon">✓</div>
        <p>Your documents have been uploaded successfully!</p>
        <button class="retro-button" on:click={resetForm}>OK</button>
      </div>
    </div>
  {:else if isUploading}
    <div class="window progress-window">
      <div class="window-header">
        <div class="title">Please wait...</div>
      </div>
      <div class="window-content">
        <div class="progress-container">
          <div class="progress-bar" style="width: {uploadProgress}%"></div>
        </div>
        <div class="progress-text">{uploadProgress}% Complete</div>
      </div>
    </div>
  {:else}
    <div class="window-container">
      <div class="window upload-window">
        <div class="window-header">
          <div class="title">Upload Documents</div>
          <div class="window-controls">
            <span>_</span>
            <span>□</span>
            <span>✕</span>
          </div>
        </div>
        
        <div class="window-content">
          {#if errorMessage}
            <div class="error-message">
              <div class="error-icon">!</div>
              <p>Oops! {errorMessage}</p>
            </div>
          {/if}
          
          <div class="upload-section">
            <div class="document-type">
              <div class="icon-container">
                <div class="document-icon">📄</div>
              </div>
              <h3>Aadhar Card</h3>
              
              <label class="file-input-container">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  on:change={handleAadharChange}
                />
                <span class="retro-button">Select File</span>
              </label>
              
              {#if aadharPreview}
                <div class="preview">
                  <div class="preview-header">
                    <span>Preview</span>
                    <span class="remove-btn" on:click={() => { aadharFile = null; aadharPreview = ''; }}>✕</span>
                  </div>
                  <div class="preview-content">
                    {#if aadharFile.type.includes('image')}
                      <img src={aadharPreview} alt="Aadhar Preview" />
                    {:else}
                      <div class="file-icon">📄 {aadharFile.name}</div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
            
            <div class="document-type">
              <div class="icon-container">
                <div class="document-icon">🆔</div>
              </div>
              <h3>PAN Card</h3>
              
              <label class="file-input-container">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  on:change={handlePanChange}
                />
                <span class="retro-button">Select File</span>
              </label>
              
              {#if panPreview}
                <div class="preview">
                  <div class="preview-header">
                    <span>Preview</span>
                    <span class="remove-btn" on:click={() => { panFile = null; panPreview = ''; }}>✕</span>
                  </div>
                  <div class="preview-content">
                    {#if panFile.type.includes('image')}
                      <img src={panPreview} alt="PAN Preview" />
                    {:else}
                      <div class="file-icon">📄 {panFile.name}</div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </div>
          
          <div class="buttons-container">
            <button class="retro-button upload-btn" on:click={handleSubmit}>Upload Files</button>
            <button class="retro-button cancel-btn" on:click={resetForm}>Cancel</button>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="status-bar">
          <div class="status-item">Ready</div>
          <div class="status-item date">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  
  :global(body) {
    margin: 0;
    font-family: 'VT323', monospace;
    background-color: #ffff99;
    color: #000;
    padding: 20px;
  }
  
  main {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .title-bar {
    background: #00CED1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border: 3px solid #000;
    box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
    margin-bottom: 20px;
  }
  
  .title-bar h1 {
    font-size: 32px;
    margin: 0;
    letter-spacing: 2px;
    text-shadow: 2px 2px 0 #ffffff;
  }
  
  .dots {
    display: flex;
  }
  
  .dots span {
    width: 15px;
    height: 15px;
    border: 2px solid #000;
    border-radius: 50%;
    margin-right: 5px;
    background-color: #fff;
  }
  
  .close-btn {
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
  }
  
  .window-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .window {
    background: #00CED1;
    border: 3px solid #000;
    box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
  }
  
  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: #00CED1;
    border-bottom: 2px solid #000;
  }
  
  .window-header .title {
    font-size: 18px;
    font-weight: bold;
  }
  
  .window-controls {
    display: flex;
    gap: 8px;
  }
  
  .window-controls span {
    border: 1px solid #000;
    background: #fff;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
  }
  
  .window-content {
    padding: 20px;
    background: #f0f0f0;
  }
  
  .upload-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .document-type {
    flex: 1;
    min-width: 260px;
    background: #fff;
    padding: 15px;
    border: 2px solid #000;
    text-align: center;
  }
  
  .icon-container {
    margin-bottom: 10px;
  }
  
  .document-icon {
    font-size: 40px;
    margin-bottom: 5px;
  }
  
  .document-type h3 {
    margin: 0 0 15px 0;
    font-size: 20px;
  }
  
  .file-input-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  
  .file-input-container input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .retro-button {
    background-color: #00CED1;
    border: 2px solid #000;
    padding: 8px 15px;
    font-family: 'VT323', monospace;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
    transition: all 0.1s;
  }
  
  .retro-button:hover {
    background-color: #00BFBF;
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  }
  
  .retro-button:active {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
  
  .preview {
    margin-top: 15px;
    border: 2px solid #000;
    overflow: hidden;
  }
  
  .preview-header {
    background: #00CED1;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #000;
  }
  
  .remove-btn {
    cursor: pointer;
    font-weight: bold;
  }
  
  .preview-content {
    background: #fff;
    padding: 10px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .preview-content img {
    max-width: 100%;
    max-height: 200px;
  }
  
  .file-icon {
    font-size: 18px;
    text-align: center;
    word-break: break-all;
  }
  
  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .upload-btn {
    background-color: #32CD32;
  }
  
  .upload-btn:hover {
    background-color: #2AB22A;
  }
  
  .cancel-btn {
    background-color: #FF6347;
  }
  
  .cancel-btn:hover {
    background-color: #E65C41;
  }
  
  .footer {
    margin-top: 10px;
  }
  
  .status-bar {
    background: #00CED1;
    border: 3px solid #000;
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
  }
  
  .error-message {
    background: #FF6347;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    border: 2px solid #000;
  }
  
  .error-icon {
    background: #fff;
    border: 2px solid #000;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .progress-window {
    max-width: 500px;
    margin: 100px auto;
  }
  
  .progress-container {
    height: 30px;
    background: #fff;
    border: 2px solid #000;
    margin-bottom: 10px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background: #32CD32;
    transition: width 0.2s;
  }
  
  .progress-text {
    text-align: center;
    font-size: 18px;
  }
  
  .success-window {
    max-width: 400px;
    margin: 100px auto;
    text-align: center;
  }
  
  .success-window .icon {
    font-size: 50px;
    color: #32CD32;
    margin: 20px 0;
  }
  
  /* Responsive adjustments */
  /* Responsive adjustments */
@media (max-width: 768px) {
  .title-bar h1 {
    font-size: 24px;
  }
  
  .upload-section {
    flex-direction: column;
  }
  
  .document-type {
    min-width: 100%;
  }
  
  .buttons-container {
    flex-direction: column;
  }
  
  .retro-button {
    width: 100%;
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .title-bar h1 {
    font-size: 18px;
  }
  
  .window-header .title {
    font-size: 16px;
  }
  
  .document-icon {
    font-size: 30px;
  }
}
</style>

