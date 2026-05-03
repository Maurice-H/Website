import sys
import os
from pathlib import Path

# Berechne den absoluten Pfad zum core.py Verzeichnis
# Wir gehen von .agent/scripts/ aus zwei Ebenen hoch zum Root und dann in die Docs
root_dir = Path(__file__).parent.parent.parent
core_dir = root_dir / ".docs" / "skills" / "creative-design" / "ui-ux-pro-max" / "scripts"

# Füge das Verzeichnis zu sys.path hinzu, damit wir 'core' direkt importieren können
sys.path.append(str(core_dir))

try:
    from core import search, search_stack, AVAILABLE_STACKS
except ImportError as e:
    print(f"Error: Could not import core search module. {e}")
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
