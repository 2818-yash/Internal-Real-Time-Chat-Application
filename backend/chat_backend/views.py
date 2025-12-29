from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import DummyUser, ChatMessage


# =====================================================
# USERS
# =====================================================
@api_view(["GET"])
def users_api(request):
    users = DummyUser.objects.all().values("username")
    return Response(users)


# =====================================================
# MESSAGES (FETCH ALL)
# =====================================================
@api_view(["GET"])
def messages_api(request):
    messages = ChatMessage.objects.all().order_by("created_at")

    return Response([
        {
            "from": m.from_user,
            "to": m.to_user,
            "message": m.message,
            "image": m.image.url if m.image else None,
            "is_read": m.is_read,
            "created_at": m.created_at,
        }
        for m in messages
    ])


# =====================================================
# IMAGE UPLOAD
# =====================================================
@api_view(["POST"])
def upload_image_api(request):
    from_user = request.data.get("from")
    to_user = request.data.get("to")
    image = request.FILES.get("image")

    if not image:
        return Response({"error": "No image provided"}, status=400)

    msg = ChatMessage.objects.create(
        from_user=from_user,
        to_user=to_user,
        image=image,
        is_read=False
    )

    return Response({
        "from": msg.from_user,
        "to": msg.to_user,
        "image": msg.image.url,
        "is_read": msg.is_read,
    })


# =====================================================
# SESSION MANAGEMENT (NO localStorage)
# =====================================================
@api_view(["POST"])
def set_session_api(request):
    request.session["me"] = request.data.get("me")
    request.session["chatUser"] = request.data.get("chatUser")
    return Response({"success": True})


@api_view(["GET"])
def get_session_api(request):
    return Response({
        "me": request.session.get("me"),
        "chatUser": request.session.get("chatUser"),
    })


@api_view(["POST"])
def clear_session_api(request):
    request.session.flush()
    return Response({"success": True})


# =====================================================
# MARK MESSAGES AS READ
# =====================================================
@api_view(["POST"])
def mark_read_api(request):
    me = request.data.get("me")
    other = request.data.get("other")

    ChatMessage.objects.filter(
        from_user=other,
        to_user=me,
        is_read=False
    ).update(is_read=True)

    return Response({"success": True})


# =====================================================
# UNREAD MESSAGE COUNT (INSTAGRAM / FB STYLE)
# =====================================================
@api_view(["GET"])
def unread_count_api(request):
    me = request.GET.get("me")

    if not me:
        return Response([])

    data = (
        ChatMessage.objects
        .filter(to_user=me, is_read=False)
        .values("from_user")
        .annotate(count=Count("id"))
    )

    return Response(data)
