from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatMessage
import json


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room = "global_chat"

        async_to_sync(self.channel_layer.group_add)(
            self.room,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)

        from_user = data.get("from")
        to_user = data.get("to")
        message = data.get("message")
        image = data.get("image")

        # ===============================
        # TEXT MESSAGE → SAVE + BROADCAST
        # ===============================
        if message:
            chat = ChatMessage.objects.create(
                from_user=from_user,
                to_user=to_user,
                message=message,
                is_read=False
            )

            payload = {
                "type": "chat_message",
                "from": chat.from_user,
                "to": chat.to_user,
                "message": chat.message,
                "image": None
            }

        # ===============================
        # IMAGE MESSAGE → ONLY BROADCAST
        # (already saved via API)
        # ===============================
        else:
            payload = {
                "type": "chat_message",
                "from": from_user,
                "to": to_user,
                "message": "",
                "image": image
            }

        async_to_sync(self.channel_layer.group_send)(
            self.room,
            payload
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))
