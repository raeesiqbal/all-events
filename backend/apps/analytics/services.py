        

from apps.analytics.models import Message


def message_creation(chat_messages,chat_obj):
    data=[]
    for msg in chat_messages:
        data.append(Message(
            **msg,
            chat=chat_obj
        ))
    Message.objects.bulk_create(data)