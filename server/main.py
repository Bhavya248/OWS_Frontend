from flask import (
    Flask,
    request,
    abort,
    jsonify,
)
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.secret_key = os.urandom(24)

IP_WHITELIST = ["127.0.0.1"]


@app.route("/validate-credentials", methods=["POST"])
def validate_credentials():
    if request.remote_addr not in IP_WHITELIST:
        abort(404)

    payload = request.form

    if payload["email"] and payload["password"]:
        username = payload["email"].split("@", 1)[0]
        return jsonify(
            {
                "found": True,
                "email": payload["email"],
                "username": username,
                "DID": "did:morpheus:" + username,
                "status":"active"
                # "did": "did:morpheus:ezbeWGSY2dqcUBqT8K7R14xr",
            }
        )
    else:
        return jsonify({"found": False, "error": "User Not Found"})


@app.route("/get-user-from-did", methods=["POST"])
def get_user_from_did():
    if request.remote_addr not in IP_WHITELIST:
        abort(404)

    payload = request.json

    if payload.get("DID", None):
        username = payload.get("DID").split("did:morpheus:", 1)[1]
        return jsonify({"username": username, "email": username + "@gmsil.com"})

    return jsonify({"found": False, "error": "Invalid DID"})


# @app.route("/did", methods=["POST"])
# def did():
#     if request.remote_addr not in IP_WHITELIST:
#         abort(404)

#     payload = request.json

#     if payload.get("DID", None):
#         if payload.get("address", None):
#             try:
#                 # add this address to the database and in the smart contract 
#                 return jsonify({"status": "success"})
#             except Exception as e:
#                 return jsonify({"status": "error", "error": str(e)})

#     return jsonify({"status": "failed", "error": "Invalid Payload"})
@app.route("/did", methods=["POST"])
def register_erc20_against_did():
    print(request.remote_addr)
    if request.remote_addr not in IP_WHITELIST:
        abort(404)

    payload = request.json
    print(f"Received payload: {payload}")  # Log received payload

    if payload.get("DID", None):
        if payload.get("address", None):
            try:
                # Add this address to the database and in the smart contract 
                return jsonify({"status": "success"})
            except Exception as e:
                return jsonify({"status": "error", "error": str(e)})

    return jsonify({"status": "failed", "error": "Invalid Payload"})

@app.route("/increment-swap-amount-for-did", methods=["POST"])
def increment_swap_amount_for_did():
    if request.remote_addr not in IP_WHITELIST:
        abort(404)

    payload = request.json

    if payload.get("DID", None):
        if payload.get("USDT_amount", None):
            try:
                # add the USDT amount to the database
                return jsonify({"Status": "Success"})
            except Exception as e:
                return jsonify({"status": "error", "error": str(e)})

    return jsonify({"status": "falied", "error": "Invalid Payload"})

# @app.route('/', methods=['POST'])
# def 


if __name__ == "__main__":
    app.run(debug=True)
