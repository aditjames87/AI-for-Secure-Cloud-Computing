import sys

def verify_package(package_name, import_name=None):
    """Tries to import a package and prints the status."""
    if import_name is None:
        import_name = package_name
    
    try:
        __import__(import_name)
        print(f"✅  Successfully imported '{import_name}' (from '{package_name}')")
        return True
    except ImportError:
        print(f"❌  Failed to import '{import_name}' (from '{package_name}'). Please check your installation.")
        return False

if __name__ == "__main__":
    print(f"Verifying package installations for Python {sys.version}\n")
    
    packages_to_check = {
        "fastapi": "fastapi",
        "uvicorn": "uvicorn",
        "sqlalchemy": "sqlalchemy",
        "psycopg2-binary": "psycopg2",
        "alembic": "alembic",
        "scikit-learn": "sklearn",
    }
    
    all_successful = all(verify_package(pkg, imp) for pkg, imp in packages_to_check.items())
    
    print("\nVerification complete." if all_successful else "\nSome packages failed to import.")