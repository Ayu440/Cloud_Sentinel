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
]
