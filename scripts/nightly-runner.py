#!/usr/bin/env python3
"""
Nightly Test Orchestrator for 23 Portfolio Apps.
- Runs every 30 mins.
- Checks GitHub Actions runs.
- Downloads screenshots for successful runs.
- Diagnoses failures.
- Dispatches next waiting apps in Group A and Group B.
- Updates NIGHTLY_REPORT.md.
"""
import subprocess
import json
import os
import glob
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def run(cmd):
    try:
        return subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return e.output

def get_workflows():
    res = []
    for f in sorted(glob.glob(".github/workflows/e2e-*.yml")):
        content = open(f).read()
        group = "a" if "group: android-emulator-a" in content else "b"
        app = os.path.basename(f).replace("e2e-", "").replace(".yml", "")
        res.append({"file": os.path.basename(f), "app": app, "group": group})
    return res

def main():
    workflows = get_workflows()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{now_str}] Starting Nightly Orchestration Check...")

    raw_runs = run(["gh", "run", "list", "--limit", "60", "--json", "databaseId,workflowName,status,conclusion,createdAt,url"])
    try:
        runs = json.loads(raw_runs)
    except Exception as e:
        print(f"Error parsing runs: {e}")
        return

    # Map latest run for each workflow file
    latest_by_app = {}
    for r in runs:
        wfname = r["workflowName"]
        for w in workflows:
            if f"({w['app']})" in wfname:
                if w['app'] not in latest_by_app:
                    latest_by_app[w['app']] = r
                elif latest_by_app[w['app']]["conclusion"] == "cancelled" and r["conclusion"] == "success":
                    latest_by_app[w['app']] = r

    status_summary = []
    group_a_running = False
    group_b_running = False
    passed_tonight = set()
    failed_tonight = set()
    pending_apps = []

    for w in workflows:
        app = w["app"]
        group = w["group"]
        r = latest_by_app.get(app)

        if r:
            st = r["status"]
            conc = r["conclusion"]
            run_id = r["databaseId"]

            if st in ("in_progress", "queued"):
                if group == "a": group_a_running = True
                if group == "b": group_b_running = True
                status_summary.append((app, group, "RUNNING", run_id, None))
            elif conc == "success":
                passed_tonight.add(app)
                status_summary.append((app, group, "PASSED", run_id, None))
                # Download screenshots if not already downloaded
                sc_dir = os.path.join("apps", app, "screenshots")
                if not os.path.exists(sc_dir) or len(os.listdir(sc_dir)) == 0:
                    print(f"Downloading screenshots for {app}...")
                    run(["gh", "run", "download", str(run_id), "-n", f"screenshots-{app}", "-D", sc_dir])
            else:
                failed_tonight.add(app)
                status_summary.append((app, group, f"FAILED ({conc})", run_id, None))
                pending_apps.append(w)
        else:
            status_summary.append((app, group, "NOT_STARTED", None, None))
            pending_apps.append(w)

    # Next dispatches if slots are free
    dispatched = []
    if not group_a_running:
        cand_a = [w for w in pending_apps if w["group"] == "a" and w["app"] not in passed_tonight]
        if cand_a:
            target = cand_a[0]
            print(f"Group A idle -> Dispatching {target['file']}")
            run(["gh", "workflow", "run", target["file"]])
            dispatched.append(target["app"])
            group_a_running = True

    if not group_b_running:
        cand_b = [w for w in pending_apps if w["group"] == "b" and w["app"] not in passed_tonight]
        if cand_b:
            target = cand_b[0]
            print(f"Group B idle -> Dispatching {target['file']}")
            run(["gh", "workflow", "run", target["file"]])
            dispatched.append(target["app"])
            group_b_running = True

    # Write Markdown Report
    report_lines = [
        "# Nightly 23-App Portfolio E2E Test Report",
        f"**Last Check:** {now_str}",
        f"**Passed Tonight:** {len(passed_tonight)} / 23",
        f"**Active Runs (Group A/B):** Group A={'Active' if group_a_running else 'Idle'}, Group B={'Active' if group_b_running else 'Idle'}",
        f"**Dispatched This Cycle:** {', '.join(dispatched) if dispatched else 'None (slots busy)'}",
        "",
        "| App | Concurrency Group | Status | Latest Run ID |",
        "|---|:---:|---|:---:|"
    ]
    for app, group, st, run_id, _ in sorted(status_summary):
        rid = f"[{run_id}](https://github.com/sxaad69/palate/actions/runs/{run_id})" if run_id else "-"
        report_lines.append(f"| `{app}` | Group {group.upper()} | {st} | {rid} |")

    report_content = "\n".join(report_lines) + "\n"
    with open("NIGHTLY_REPORT.md", "w") as f:
        f.write(report_content)
    print("NIGHTLY_REPORT.md updated.")

if __name__ == "__main__":
    main()
