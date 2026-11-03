#!/usr/bin/env python3
"""
Generate a smooth MP4 walkthrough video from emulator screenshots using ffmpeg.
Usage:
    python3 scripts/make-walkthrough-video.py <app-name>
    python3 scripts/make-walkthrough-video.py all
"""
import sys
import os
import subprocess
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def generate_video_for_app(app_name):
    sc_dir = os.path.join(ROOT, "apps", app_name, "screenshots")
    if not os.path.exists(sc_dir):
        print(f"[{app_name}] Screenshots dir not found: {sc_dir}")
        return None

    # Pick valid non-empty step PNGs in order
    all_pngs = sorted(glob.glob(os.path.join(sc_dir, "*.png")))
    valid_pngs = []
    
    # Priority order: step-01..step-12, profile-tab, etc. (ignore fail-screencap if we have steps)
    step_pngs = [p for p in all_pngs if "step-" in os.path.basename(p) and os.path.getsize(p) > 1024]
    other_pngs = [p for p in all_pngs if "fail-" not in os.path.basename(p) and "step-" not in os.path.basename(p) and os.path.getsize(p) > 1024]
    
    valid_pngs = step_pngs + other_pngs
    if len(valid_pngs) < 2:
        # Fallback to any non-empty pngs
        valid_pngs = [p for p in all_pngs if os.path.getsize(p) > 1024]

    if len(valid_pngs) < 2:
        print(f"[{app_name}] Need at least 2 screenshots, found {len(valid_pngs)}")
        return None

    out_mp4 = os.path.join(sc_dir, f"{app_name}_walkthrough.mp4")
    print(f"[{app_name}] Compiling {len(valid_pngs)} screenshots into {out_mp4}...")

    slide_duration = 2.5
    fade_duration = 0.5

    inputs = []
    for p in valid_pngs:
        inputs.extend(["-loop", "1", "-t", str(slide_duration), "-i", p])

    # Build xfade filter chain
    filter_parts = []
    last_v = "0"
    for i in range(1, len(valid_pngs)):
        next_v = f"v{i}"
        offset = i * (slide_duration - fade_duration)
        filter_parts.append(f"[{last_v}][{i}]xfade=transition=fade:duration={fade_duration}:offset={offset:.2f}[{next_v}]")
        last_v = next_v

    filter_complex = ";".join(filter_parts)

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", f"[{last_v}]",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264",
        "-r", "30",
        "-preset", "fast",
        "-crf", "20",
        out_mp4
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        size_kb = os.stat(out_mp4).st_size // 1024
        print(f"[{app_name}] SUCCESS: {out_mp4} ({size_kb} KB)")
        return out_mp4
    else:
        print(f"[{app_name}] Error running ffmpeg: {res.stderr[-300:]}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/make-walkthrough-video.py <app-name|champions|all>")
        sys.exit(1)

    target = sys.argv[1].lower()
    champions = ["palate", "duobudget", "modestfit", "hulm"]

    if target == "champions":
        for a in champions:
            generate_video_for_app(a)
    elif target == "all":
        apps = sorted([d for d in os.listdir(os.path.join(ROOT, "apps")) if os.path.isdir(os.path.join(ROOT, "apps", d))])
        for a in apps:
            generate_video_for_app(a)
    else:
        generate_video_for_app(target)

if __name__ == "__main__":
    main()
