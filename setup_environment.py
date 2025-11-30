import subprocess
import sys
import os

def install_requirements():
    """Install all required packages"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print(" All packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f" Error installing packages: {e}")
        return False
    return True

def verify_installation():
    """Verify that key packages are installed"""
    packages = ['pandas', 'numpy', 'sklearn', 'matplotlib', 'seaborn', 'jupyter']
    
    for package in packages:
        try:
            if package == 'sklearn':
                import sklearn
                print(f" scikit-learn version: {sklearn.__version__}")
            else:
                __import__(package)
                print(f" {package} installed successfully")
        except ImportError as e:
            print(f" {package} not installed: {e}")
            return False
    return True

if __name__ == "__main__":
    print("Setting up Autism Diagnosis System environment...")
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print(" requirements.txt not found!")
        sys.exit(1)
    
    # Install packages
    if install_requirements():
        print("\nVerifying installation...")
        verify_installation()
        print("\n Environment setup completed successfully!")
    else:
        print("\n Environment setup failed!")