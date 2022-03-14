import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from . import models

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def save_message(self, data):
        user = User.objects.get(id=data['user_id'])
        user_relationship = models.UserRelationship.objects.get(
            chatID=self.room_name)
        models.ChatContent.objects.create(
            user=user,
            message=data['message'],
            chatID=user_relationship
        )

    # Receive message from WebSocket

    async def receive(self, text_data=None, bytes_data=None):
        text_data = json.loads(text_data)
        user_id = text_data['user_id']
        if text_data['type'] == "chat":
            message = text_data['message']
            status = text_data['status']
            await self.save_message(text_data)
            # send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': user_id,
                    'status': status
                }
            )
        if text_data['type'] == 'start_typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'start_typing',
                    'user_id': user_id
                }
            )
        if text_data['type'] == 'end_typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'end_typing',
                    'user_id': user_id
                }
            )

        if text_data['type'] == 'chat_file':
            message = text_data['message']
            status = text_data['status']
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': user_id,
                    'status': status
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        status = event['status']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'user_id': user_id,
            'status': status
        }))

    async def start_typing(self, event):
        user_id = event['user_id']
        await self.send(text_data=json.dumps({
            'type': 'start_typing',
            'user_id': user_id
        }))

    async def end_typing(self, event):
        user_id = event['user_id']
        await self.send(text_data=json.dumps({
            'type': 'end_typing',
            'user_id': user_id
        }))
