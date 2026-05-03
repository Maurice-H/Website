import sys
import os
from pathlib import Path

# Berechne den absoluten Pfad zum core.py Verzeichnis
current_file = Path(__file__).resolve()
root_dir = current_file.parent.parent.parent
core_dir = (root_dir / ".docs" / "skills" / "creative-design" / "ui-ux-pro-max" / "scripts").resolve()

# Prüfe, ob das Verzeichnis existiert
if not core_dir.exists():
    print(f"Error: Search core directory not found: {core_dir}")
    sys.exit(1)

# Lade das Modul direkt über den Dateipfad (robuster als sys.path)
import importlib.util
core_file = core_dir / "core.py"

if not core_file.exists():
    print(f"Error: core.py not found at {core_file}")
    sys.exit(1)

spec = importlib.util.spec_from_file_location("core", str(core_file))
if spec and spec.loader:
    core = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(core)
    search = core.search
    search_stack = core.search_stack
    AVAILABLE_STACKS = core.AVAILABLE_STACKS
else:
    print(f"Error: Could not load core module from {core_file}")
    sys.exit(1)

if __name__ == "__main__":
    import json

    if len(sys.argv) < 2:
        print("Usage: python search.py <query> [domain/stack]")
        sys.exit(1)

    query_str = sys.argv[1]
    domain_str = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Check if domain_str is actually a stack
    if domain_str in AVAILABLE_STACKS:
        res = search_stack(query_str, domain_str)
    else:
        res = search(query_str, domain=domain_str)
        
    print(json.dumps(res, indent=2))
