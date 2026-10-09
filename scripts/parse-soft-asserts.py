#!/usr/bin/env python3
"""Parse Maestro output for failed optional assertions and write JSON report."""
import json
import os
import re
import sys

def main():
    app = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    log_path = sys.argv[2] if len(sys.argv) > 2 else "maestro-output.log"
    out_path = sys.argv[3] if len(sys.argv) > 3 else "screenshots/soft-assert-failures.json"

    failures = []
    try:
        with open(log_path) as f:
            output = f.read()
    except FileNotFoundError:
        output = ""

    # Look for lines indicating optional step failures
    for line in output.split("\n"):
        low = line.lower()
        if "optional" in low and ("fail" in low or "skip" in low or "not found" in low or "not visible" in low):
            failures.append({"type": "soft_assert", "detail": line.strip()[:300]})

    report = {"app": app, "soft_failures": failures, "count": len(failures)}
    # Create output directory if needed
    out_dir = os.path.dirname(out_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Soft assert failures for {app}: {len(failures)}")

if __name__ == "__main__":
    main()
