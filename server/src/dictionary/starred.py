from django.db import models

class Starred(models.Model):
    term = models.TextField()
    notes = models.TextField()

    def __repr__(self):
        return f'<Starred term="{self.term}" notes="{self.notes}">'
