from flask import Flask, jsonify, send_from_directory
from scanner import run_scan
import os

# Serve the static files from the React build
app = Flask(__name__, static_folder='frontend/dist/assets', template_folder='frontend/dist')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/scan')
def api_scan():
    results = run_scan()
    total = len(results)
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    not_found = sum(1 for r in results if r['status'] == 'NOT FOUND')
    high = sum(1 for r in results if r['severity'] == 'High')
    medium = sum(1 for r in results if r['severity'] == 'Medium')
    low = sum(1 for r in results if r['severity'] == 'Low')

    svc_list = ['Nova', 'Cinder', 'Neutron', 'Swift']
    svc_pass = [sum(1 for r in results if r['service'] == s and r['status'] == 'PASS') for s in svc_list]
    svc_fail = [sum(1 for r in results if r['service'] == s and r['status'] == 'FAIL') for s in svc_list]
    svc_nf = [sum(1 for r in results if r['service'] == s and r['status'] == 'NOT FOUND') for s in svc_list]

    return jsonify({
        "results": results,
        "summary": {
            "total": total,
            "passed": passed,
            "failed": failed,
            "not_found": not_found,
            "high": high,
            "medium": medium,
            "low": low
        },
        "charts": {
            "services": svc_list,
            "pass": svc_pass,
            "fail": svc_fail,
            "not_found": svc_nf
        }
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Serve index.html for all other routes so React Router can handle them (if we add it later)
    # Since we are using a single page, we just serve index.html
    if path != "" and os.path.exists(app.template_folder + '/' + path):
        return send_from_directory(app.template_folder, path)
    else:
        return send_from_directory(app.template_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
