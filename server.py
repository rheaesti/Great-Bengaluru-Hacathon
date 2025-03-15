from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows Svelte frontend to communicate with Flask backend

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    print(data)
    user_message = data.get("message", "")

    # Process the message (Replace this with your AI logic)
    bot_response = f"You said: {user_message}"

    return jsonify({"response": bot_response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)