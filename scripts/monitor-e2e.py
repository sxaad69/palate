#!/usr/bin/env python3
"""
Automated Monitor & Diagnosis for 23 Portfolio E2E Runs.
Queries GitHub Actions, checks running/failed/successful workflows,
and dumps diagnostic info for any failure.
"""
import subprocess
import json
import os
import sys

def run_cmd(cmd):
    try:
        return subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return e.output

def main():
    print("=== Checking GitHub Actions E2E Status ===")
    out = run_cmd(["gh", "run", "list", "--limit", "40", "--json", "databaseId,workflowName,status,conclusion,createdAt,url"])
    runs = json.loads(out)
    
    # Map latest run per workflow
    latest = {}
    for r in runs:
        name = r["workflowName"]
        if name.startswith("E2E (") and name not in latest:
            latest[name] = r

    completed_success = 0
    in_progress = 0
    failed = []

    for name, r in sorted(latest.items()):
        status = r["status"]
        conclusion = r["conclusion"]
        run_id = r["databaseId"]
        
        if status == "in_progress" or status == "queued":
            in_progress += 1
            print(f"[*] {name:<35} | {status.upper()}")
        elif conclusion == "success":
            completed_success += 1
            print(f"[✓] {name:<35} | SUCCESS")
        else:
            failed.append(r)
            print(f"[✗] {name:<35} | FAILED ({conclusion}) -> ID: {run_id}")

    print("\n--- Summary ---")
    print(f"Total Unique E2E Workflows: {len(latest)}")
    print(f"Passed: {completed_success}")
    print(f"In Progress / Queued: {in_progress}")
    print(f"Failed: {len(failed)}")

    # If any failed, pull failure summary
    if failed:
        print("\n--- Diagnosis for Failed Workflows ---")
        for f in failed:
            print(f"\nDiagnosis for {f['workflowName']} (Run {f['databaseId']}):")
            view = run_cmd(["gh", "run", "view", str(f["databaseId"]), "--log-failed"])
            print(view[:1500])

if __name__ == "__main__":
    main()
