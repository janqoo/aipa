import os

def find_and_run():
    # 1. Get the current folder you are in
    root_dir = os.getcwd()
    print(f"Searching for your project files in: {root_dir}")

    target_file = "app.py" # This is the file we are looking for
    found_path = None

    # 2. Walk through every single folder automatically
    for root, dirs, files in os.walk(root_dir):
        if target_file in files:
            found_path = os.path.join(root, target_file)
            break

    if found_path:
        print(f"✅ FOUND IT! Your file is at: {found_path}")
        print("--- Attempting to run it now ---")
        os.system(f"python {found_path}")
    else:
        print("❌ Could not find app.py.")
        print("\nHere are the files I DID find (so you can tell me the right name):")
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if file.endswith(".py"):
                    print(f" - {file} (in {root})")

if __name__ == "__main__":
    find_and_run()