CloudSentinel
OpenStack Misconfiguration Scanner








What is this?

CloudSentinel is a security tool that scans OpenStack configs and identifies misconfigurations.

It reads real config files (Nova, Cinder, Neutron, Swift), applies a rule-based engine, and shows what’s wrong along with how to fix it.

Built as a college project at GLA University.

Team
Ayush Gaur (2415000403)
Divyansh (2415000558)
Ritika (2415001303)
Lakshay Agarwal (2415000887)

Mentor: Mr. Arvind Prasad

Features
Scans real OpenStack config files
Rule-based misconfiguration detection
Severity levels: High / Medium / Low
Remediation suggestions
Flask dashboard for results
Filters by service and severity
Read-only (does not modify configs)
Structure
cloudsentinel/
├── rules.py
├── scanner.py
├── app.py
└── templates/
    └── dashboard.html
How it works
Configs → Parser → Rule Engine → Violations → Dashboard
Reads configuration files
Extracts parameters
Compares with security rules
Displays results in UI
Tech Stack
Python
Flask
ConfigParser
Bootstrap
OpenStack (MicroStack)
Ubuntu
Setup
Install MicroStack
sudo snap install microstack --beta
sudo microstack init --auto --control
Clone repository
git clone https://github.com/Ayu440/Cloud_Sentinel.git
cd Cloud_Sentinel
Install dependencies
pip install flask
Run scanner
sudo python3 scanner.py
Launch dashboard
sudo python3 app.py
Open in browser
http://127.0.0.1:8080
Rules (examples)
NOVA-001 → allow_resize_to_same_host
NEUTRON-001 → auth_strategy
CINDER-001 → enable_v3_api
SWIFT-001 → auth_uri

Each rule validates whether a configuration is secure.

Config Paths (MicroStack)
/snap/microstack/.../nova.conf
/snap/microstack/.../cinder.conf
/snap/microstack/.../neutron.conf
References
OpenStack Documentation
Flask Documentation
NIST Cloud Security Guidelines
Note

This project is developed as an academic implementation to understand cloud security and misconfiguration detection.
