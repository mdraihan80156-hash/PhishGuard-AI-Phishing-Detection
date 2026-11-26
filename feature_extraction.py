import re
from urllib.parse import urlparse


def extract_features(url):
    features = []

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)
    hostname = parsed.netloc

    # 1. URL length
    features.append(len(url))

    # 2. Number of dots
    features.append(url.count("."))

    # 3. Number of hyphens
    features.append(url.count("-"))

    # 4. Number of special characters
    special_chars = re.findall(r"[@?=&_%$#!]", url)
    features.append(len(special_chars))

    # 5. Number of subdomains
    subdomains = hostname.split(".")
    features.append(max(0, len(subdomains) - 2))

    # 6. HTTPS
    if parsed.scheme == "https":
        features.append(1)
    else:
        features.append(0)

    # 7. Contains @ symbol
    features.append(1 if "@" in url else 0)

    # 8. Contains IP address
    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    features.append(1 if re.match(ip_pattern, hostname.split(":")[0]) else 0)

    # 9. Suspicious words
    suspicious_words = [
        "login",
        "verify",
        "verification",
        "account",
        "secure",
        "update",
        "bank",
        "password",
        "signin",
        "confirm"
    ]

    count = 0
    lower_url = url.lower()

    for word in suspicious_words:
        if word in lower_url:
            count += 1

    features.append(count)

    return features