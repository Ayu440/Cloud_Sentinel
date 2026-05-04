RULES = [
    # NOVA RULES
    {
        "id": "NOVA-001",
        "service": "Nova",
        "section": "DEFAULT",
        "parameter": "allow_resize_to_same_host",
        "expected": "false",
        "severity": "High",
        "remediation": "Set allow_resize_to_same_host=false to prevent resource abuse."
    },
    {
        "id": "NOVA-002",
        "service": "Nova",
        "section": "DEFAULT",
        "parameter": "use_neutron",
        "expected": "true",
        "severity": "High",
        "remediation": "Enable Neutron networking for better network isolation."
    },
    {
        "id": "NOVA-003",
        "service": "Nova",
        "section": "DEFAULT",
        "parameter": "force_config_drive",
        "expected": "true",
        "severity": "Low",
        "remediation": "Enable config drive for better instance configuration security."
    },
    {
        "id": "NOVA-004",
        "service": "Nova",
        "section": "DEFAULT",
        "parameter": "ram_allocation_ratio",
        "expected": "1.0",
        "severity": "Medium",
        "remediation": "Keep RAM allocation ratio at 1.0 to avoid memory overcommit and stability risks."
    },

    # CINDER RULES
    {
        "id": "CINDER-001",
        "service": "Cinder",
        "section": "DEFAULT",
        "parameter": "enable_v3_api",
        "expected": "true",
        "severity": "Medium",
        "remediation": "Enable Cinder v3 API for improved security features."
    },
    {
        "id": "CINDER-002",
        "service": "Cinder",
        "section": "DEFAULT",
        "parameter": "os_region_name",
        "expected": "RegionOne",
        "severity": "Low",
        "remediation": "Set correct region name for proper service isolation."
    },
    {
        "id": "CINDER-003",
        "service": "Cinder",
        "section": "DEFAULT",
        "parameter": "nas_secure_file_operations",
        "expected": "true",
        "severity": "High",
        "remediation": "Enable nas_secure_file_operations to prevent unprivileged access to NAS-backed volumes."
    },

    # NEUTRON RULES
    {
        "id": "NEUTRON-001",
        "service": "Neutron",
        "section": "DEFAULT",
        "parameter": "auth_strategy",
        "expected": "keystone",
        "severity": "High",
        "remediation": "Set auth_strategy=keystone to enforce authentication."
    },
    {
        "id": "NEUTRON-002",
        "service": "Neutron",
        "section": "DEFAULT",
        "parameter": "allow_overlapping_ips",
        "expected": "true",
        "severity": "Medium",
        "remediation": "Enable overlapping IPs for better network isolation."
    },
    {
        "id": "NEUTRON-003",
        "service": "Neutron",
        "section": "DEFAULT",
        "parameter": "notify_nova_on_port_status_changes",
        "expected": "true",
        "severity": "Medium",
        "remediation": "Enable Nova notifications on port changes so Nova can react to network events promptly and securely."
    },

    # SWIFT RULES
    {
        "id": "SWIFT-001",
        "service": "Swift",
        "section": "DEFAULT",
        "parameter": "auth_uri",
        "expected": "http://controller:5000",
        "severity": "High",
        "remediation": "Set correct Keystone auth URI for Swift authentication."
    },
    {
        "id": "SWIFT-003",
        "service": "Swift",
        "section": "DEFAULT",
        "parameter": "account_autocreate",
        "expected": "false",
        "severity": "High",
        "remediation": "Disable account_autocreate to prevent unauthorised users from automatically provisioning storage accounts."
    },
]
