from django.db import models


class DummyUser(models.Model):
    username = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.username


class ChatMessage(models.Model):
    from_user = models.CharField(max_length=50)
    to_user = models.CharField(max_length=50)
    message = models.TextField(blank=True)
    image = models.ImageField(upload_to="chat_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)   # ⭐ IMPORTANT
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} → {self.to_user}"
