from datetime import datetime
from bson import ObjectId
import logging

class Task:
    STATUS = {
        'NOT_STARTED': 'not_started',
        'IN_PROGRESS': 'in_progress',
        'PENDING_APPROVAL': 'pending_approval',
        'DONE': 'done',
        'ARCHIVED': 'archived'
    }

    def __init__(self, db):
        self.db = db
        self.collection = db.tasks

    def create_task(self, data):
        logger.info(f"Creating task with data: {data}")
        try:
            task = {
                'title': data['title'],
                'description': data['description'],
                'department': data['department'],
                'created_by': data['created_by'],  # User ID
                'assigned_to': data.get('assigned_to', None),  # User ID or None
                'status': data.get('status', self.STATUS['NOT_STARTED']),
                'priority': data.get('priority', 'medium'),
                'due_date': data.get('due_date', None),
                'attachments': data.get('attachments', []),
                'tags': data.get('tags', []),  # Initialize tags as empty array if not provided
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'change_log': [{
                    'field': 'status',
                    'old_value': None,
                    'new_value': self.STATUS['NOT_STARTED'],
                    'changed_by': data['created_by'],
                    'changed_at': datetime.utcnow()
                }]
            }
            logger.info(f"Creating task: {task}")
            result = self.collection.insert_one(task)
            task['_id'] = str(result.inserted_id)
            return task
        except Exception as e:
            logger.error(f"Error creating task: {str(e)}")
            return None  # Return None or handle the error as needed

    # Other methods...
