import configparser
import os
from rules import RULES

CONFIG_FILES = {
    "Nova": "/snap/microstack/245/etc/nova/nova.conf",
    "Cinder": "/snap/microstack/245/etc/cinder/cinder.conf",
    "Neutron": "/snap/microstack/245/etc/neutron/neutron.conf",
    "Swift": None
}

def parse_config(filepath):
    config = configparser.ConfigParser()
    try:
        with open(filepath, 'r') as f:
            config.read_file(f)
        return config
    except Exception as e:
        return None

def run_scan():
    results = []

    for rule in RULES:
        service = rule["service"]
        filepath = CONFIG_FILES.get(service)

        # Handle missing config file
        if filepath is None or not os.path.exists(filepath):
            results.append({
                "id": rule["id"],
                "service": service,
                "parameter": rule["parameter"],
                "expected": rule["expected"],
                "actual": "N/A",
                "severity": rule["severity"],
                "remediation": rule["remediation"],
                "status": "NOT FOUND"
            })
            continue

        config = parse_config(filepath)

        if config is None:
            actual = "UNREADABLE"
            status = "ERROR"
        else:
            section = rule["section"]
            parameter = rule["parameter"]
            try:
                actual = config.get(section, parameter)
            except (configparser.NoSectionError, configparser.NoOptionError):
                actual = "NOT SET"

            if actual.lower() == rule["expected"].lower():
                status = "PASS"
            else:
                status = "FAIL"

        results.append({
            "id": rule["id"],
            "service": service,
            "parameter": rule["parameter"],
            "expected": rule["expected"],
            "actual": actual,
            "severity": rule["severity"],
            "remediation": rule["remediation"],
            "status": status
        })

    return results

if __name__ == "__main__":
    results = run_scan()
    for r in results:
        print(f"[{r['status']}] {r['id']} - {r['parameter']} (Severity: {r['severity']})")
