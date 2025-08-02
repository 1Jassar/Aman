from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import string
import os
import json  
from datetime import datetime
from flask_sock import Sock

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)
sock = Sock(app)  # Initialize WebSocket support
clients = set()  # Store WebSocket clients

# In-memory storage (for demo purposes)
users = {
    "demo": "demo123",
    "test": "test123",
    "admin": "admin123"
}

# Sample card data - This will be updated with new CVVs
card_data = {
    "card_number": "83840742168075216433",
    "cvv": ''.join(random.choices(string.digits, k=3)), # Randomized initial CVV
    "expiry_date": "02/28",
    "balance": 0,  
    "is_active": True
}

# Main account balance (separate from card balance)
main_account_balance = 250000

def generate_new_cvv():
    """Generate a new random CVV"""
    return ''.join(random.choices(string.digits, k=3))

@app.route('/')
def serve_frontend():
    """Serve the React frontend"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files and handle React routing"""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # For React Router, serve index.html for unknown routes
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health')
def health():
    return jsonify({"message": "Alinma Bank Security Card API", "status": "running"})

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Simple authentication endpoint - accepts any credentials for demo"""
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    
    # For demo purposes, accept any non-empty credentials
    if username and password:
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        return jsonify({
            "success": True,
            "token": token,
            "message": "تم تسجيل الدخول بنجاح"
        })
    else:
        return jsonify({
            "success": False,
            "message": "اسم المستخدم وكلمة المرور مطلوبان"
        }), 400

@app.route('/api/card/info')
def get_card_info():
    """Get current card information"""
    return jsonify({
        "success": True,
        "card": card_data,
        "message": "تم جلب معلومات البطاقة بنجاح"
    })

@app.route('/api/account/balance')
def get_account_balance():
    """Get main account balance"""
    return jsonify({
        "success": True,
        "balance": main_account_balance,
        "message": "تم جلب رصيد الحساب الرئيسي بنجاح"
    })

@app.route('/api/card/request', methods=['POST'])
def request_card():
    """Request a new security card"""
    return jsonify({
        "success": True,
        "message": "تم طلب البطاقة بنجاح",
        "card_id": "SEC_" + ''.join(random.choices(string.digits, k=8))
    })

@sock.route('/ws')
def websocket(ws):
    """Handle WebSocket connections"""
    clients.add(ws)
    try:
        while True:
            data = ws.receive()
    except:
        clients.remove(ws)

def broadcast_cvv_update(new_cvv, new_balance):
    """Broadcast CVV update to all connected WebSocket clients"""
    message = {
        "type": "cvv_update",
        "new_cvv": new_cvv,
        "new_balance": new_balance,
        "timestamp": datetime.now().isoformat()
    }
    
    disconnected_clients = set()
    for client in clients:
        try:
            client.send(json.dumps(message))
        except:
            disconnected_clients.add(client)
    
    # Remove disconnected clients
    clients.difference_update(disconnected_clients)

@app.route('/api/card/transaction', methods=['POST'])
def simulate_transaction():
    """Simulate a transaction and update CVV"""
    global card_data, main_account_balance
    
    # Get card info from the request body
    data = request.get_json()
    incoming_cvv = data.get('cvv')
    incoming_card_number = data.get('cardNumber')
    incoming_expiry = data.get('expiry')
    # Get product information if available
    product_name = data.get('productName', '').lower()
    product_price = data.get('productPrice', None)

    # --- CVV Validation Logic ---
    # Check if the incoming CVV matches the current valid CVV
    if incoming_cvv != card_data["cvv"]:
        print(f"CVV Mismatch: Incoming '{incoming_cvv}', Expected '{card_data['cvv']}'")
        return jsonify({
            "success": False,
            "message": "CVV is incorrect"
        }), 400 # Return 400 Bad Request for invalid input
    
    if incoming_expiry != card_data["expiry_date"]:
        print(f"Expiry Date Mismatch: Incoming '{incoming_expiry}', Expected '{card_data['expiry_date']}'")
        return jsonify({
            "success": False,
            "message": "Expiry date is incorrect."
        }), 400

    # After successful validation, update CVV and process transaction
    old_cvv = card_data["cvv"]
    new_cvv = generate_new_cvv()
    card_data["cvv"] = new_cvv
    
    # Broadcast CVV update to all connected clients immediately
    broadcast_cvv_update(new_cvv, card_data["balance"])
    
    # Define product prices
    shop_prices = {
        'iphone 16': 3199,  # iPhone 16
        'iphone 16 plus': 4999,  # iPhone 16 Plus  
    }
    
    # Determine transaction amount based on product name or price sent from frontend
    if product_price and isinstance(product_price, (int, float)):
        # Use the price sent from frontend
        transaction_amount = product_price
    elif product_name:
        # Try to match product name to our price list
        for product_key, price in shop_prices.items():
            if product_key in product_name:
                transaction_amount = price
                break
        else:
            # Default price if no match found
            transaction_amount = shop_prices['iphone 16']
    else:
        # Fallback if no product info provided
        transaction_amount = shop_prices['iphone 16']
    
    # Deduct from both card balance and main account balance for store transactions
    card_data["balance"] = max(0, card_data["balance"] - transaction_amount)
    main_account_balance = max(0, main_account_balance - transaction_amount)
    
    # Broadcast updated CVV and balance to all clients
    broadcast_cvv_update(new_cvv, card_data["balance"])
    
    # Update WebSocket message to include new CVV
    message = {
        "type": "transaction_complete",
        "timestamp": datetime.now().isoformat(),
        "new_cvv": new_cvv,  # Include new CVV in WebSocket message
        "balance": card_data["balance"],
        "main_balance": main_account_balance
    }
    
    # Send WebSocket notifications with proper error handling
    for client in list(clients):
        try:
            client.send(json.dumps(message))
        except Exception as e:
            print(f"WebSocket Error: {str(e)}")
            try:
                clients.remove(client)
            except:
                pass

    return jsonify({
        "success": True,
        "message": "Transaction successful.",
        "transaction_amount": transaction_amount,
        "old_cvv": old_cvv,
        "new_cvv": new_cvv,
        "new_balance": card_data["balance"],
        "new_main_balance": main_account_balance
    })

@app.route('/api/card/freeze', methods=['POST'])
def freeze_card():
    """Freeze/unfreeze the card"""
    global card_data
    card_data["is_active"] = not card_data["is_active"]
    status = "مجمدة" if not card_data["is_active"] else "نشطة"
    
    return jsonify({
        "success": True,
        "message": f"تم تغيير حالة البطاقة إلى {status}",
        "is_active": card_data["is_active"]
    })

@app.route('/api/card/balance', methods=['POST'])
def update_balance():
    global main_account_balance
    data = request.json
    amount = data.get('amount', 0)
    
    if amount <= 0 or amount > 250000:  
        return jsonify({
            'success': False,
            'message': 'Invalid amount or exceeds transfer limit'
        })
    
    
    card_data['balance'] += amount
    
    return jsonify({
        'success': True,
        'new_card_balance': card_data['balance'],
        'new_main_balance': main_account_balance,  # Main balance stays the same
        'message': 'Balance updated successfully'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)