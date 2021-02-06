from django.db import models

class StarredTerm(models.Model):
    term = models.TextField(primary_key=True)
    notes = models.TextField()

    def __repr__(self):
        return f'<Starred term="{self.term}" notes="{self.notes}">'
