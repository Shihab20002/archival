import sys
from pathlib import Path

# Add project directory to Python path
sys.path.append(str(Path(__file__).parent))

from backend.models.task import Task
from backend.app import create_app
from backend.config import config  # Adjusted import statement

app = create_app()

with app.app_context():
    task_model = Task(app.mongo.db)
    archived_tasks = task_model.get_tasks_by_status('archived')
    print(f"Found {len(archived_tasks)} archived tasks:")
    for task in archived_tasks:
        print(f"- {task['title']} (ID: {task['_id']})")
