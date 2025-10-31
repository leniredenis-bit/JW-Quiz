#!/usr/bin/env python3
"""
Merge 'tags' and 'dificuldade' from a backup perguntas.json into the current perguntas.json.
Usage:
  python scripts/merge_metadata_from_backup.py --json DATA/perguntas.json --backup DATA/perguntas.json.bak.20251031100256

Behavior:
- Creates a timestamped backup of the current JSON before writing (same directory, .bak.TIMESTAMP)
- For each question id present in both files, if the backup has 'tags' or 'dificuldade' and the current file has an empty or missing value, copy it from the backup.
- If the current has values, preserve them (don't overwrite).
- Prints a short summary of how many items were changed.
"""
import argparse
import json
from pathlib import Path
from datetime import datetime
import shutil


def load(path: Path):
    with path.open(encoding='utf-8') as fh:
        return json.load(fh)


def save(path: Path, data):
    with path.open('w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)


def merge(json_path: Path, backup_path: Path):
    data = load(json_path)
    bak = load(backup_path)

    index_bak = {str(item.get('id')): item for item in bak if isinstance(item, dict) and 'id' in item}

    updated = 0
    for item in data:
        if not isinstance(item, dict) or 'id' not in item:
            continue
        rid = str(item['id'])
        b = index_bak.get(rid)
        if not b:
            continue
        changed = False
        # tags: if current has no tags or empty list, copy
        cur_tags = item.get('tags')
        bak_tags = b.get('tags')
        if bak_tags and (not cur_tags or len(cur_tags) == 0):
            item['tags'] = bak_tags
            changed = True
        # dificuldade: if current missing or None, copy
        cur_dif = item.get('dificuldade')
        bak_dif = b.get('dificuldade')
        if (cur_dif is None or cur_dif == '') and (bak_dif is not None):
            item['dificuldade'] = bak_dif
            changed = True
        if changed:
            updated += 1

    # backup current
    bak_out = json_path.with_suffix(json_path.suffix + f'.bak.{datetime.now().strftime("%Y%m%d%H%M%S")}')
    shutil.copy2(json_path, bak_out)
    save(json_path, data)
    print(f'Merged metadata from {backup_path.name} into {json_path.name}. Items updated={updated}. Backup made at {bak_out.name}')


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--json', required=True)
    p.add_argument('--backup', required=True)
    args = p.parse_args()
    merge(Path(args.json), Path(args.backup))
