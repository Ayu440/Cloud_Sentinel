from flask import Flask, render_template, request
from scanner import run_scan

app = Flask(__name__)

@app.route('/')
def index():
    results = run_scan()

    # Stats
    total = len(results)
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    not_found = sum(1 for r in results if r['status'] == 'NOT FOUND')

    # Filters
    service_filter = request.args.get('service', 'All')
    severity_filter = request.args.get('severity', 'All')

    filtered = results
    if service_filter != 'All':
        filtered = [r for r in filtered if r['service'] == service_filter]
    if severity_filter != 'All':
        filtered = [r for r in filtered if r['severity'] == severity_filter]

    services = ['All', 'Nova', 'Cinder', 'Neutron', 'Swift']
    severities = ['All', 'High', 'Medium', 'Low']

    return render_template('dashboard.html',
                           results=filtered,
                           total=total,
                           passed=passed,
                           failed=failed,
                           not_found=not_found,
                           services=services,
                           severities=severities,
                           service_filter=service_filter,
                           severity_filter=severity_filter)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
