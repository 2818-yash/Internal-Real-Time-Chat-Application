from django.urls import path
from .views import (
    users_api,
    messages_api,
    upload_image_api,
    set_session_api,
    get_session_api,
    clear_session_api,
    mark_read_api,
    unread_count_api,
)

urlpatterns = [
    path("api/users/", users_api),
    path("api/messages/", messages_api),
    path("api/upload-image/", upload_image_api),

    path("api/set-session/", set_session_api),
    path("api/get-session/", get_session_api),
    path("api/clear-session/", clear_session_api),

    path("api/mark-read/", mark_read_api),
    path("api/unread-count/", unread_count_api),
]
