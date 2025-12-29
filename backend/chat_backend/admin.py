from django.contrib import admin
from .models import DummyUser, ChatMessage


@admin.register(DummyUser)
class DummyUserAdmin(admin.ModelAdmin):
    list_display = ("username",)
    search_fields = ("username",)
    ordering = ("username",)


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = (
        "from_user",
        "to_user",
        "message_preview",
        "image",
        "created_at",
    )
    list_filter = ("from_user", "to_user", "created_at")
    search_fields = ("from_user", "to_user", "message")
    ordering = ("-created_at",)

    def message_preview(self, obj):
        return obj.message[:50] if obj.message else "-"
    message_preview.short_description = "Message"
