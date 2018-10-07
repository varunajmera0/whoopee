from django.conf.urls import url
from .views import (
                    getTag
                    )

urlpatterns = [
    url(r'^varun/$', getTag.as_view()),
]
