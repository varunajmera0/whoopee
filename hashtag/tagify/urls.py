from django.conf.urls import url
from .views import (
                    getTag,
                    Getfuck,
                    Getp
                    )

urlpatterns = [
    url(r'^varun/$', getTag.as_view()),
    url(r'^getfuck/$', Getfuck.as_view()),
    url(r'^getf/(?P<pk>(\d+))/$', Getfuck.as_view()),
    url(r'^getp/(?P<pk>(\d+))/$', Getp.as_view()),
]
